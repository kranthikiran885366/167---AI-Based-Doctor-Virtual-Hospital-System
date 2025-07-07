import cv2
import numpy as np
import pandas as pd
from typing import List, Dict, Any, Optional
import re
import json
from PIL import Image
import pytesseract
from pdf2image import convert_from_path
import tensorflow as tf
from models.medical_models import ReportAnalysisResponse, LabResult

class ReportAnalyzer:
    def __init__(self):
        self.lab_reference_ranges = self._load_lab_references()
        self.report_patterns = self._load_report_patterns()
        
    def _load_lab_references(self) -> Dict[str, Dict[str, Any]]:
        """Load laboratory reference ranges"""
        return {
            "hemoglobin": {
                "male": {"min": 13.5, "max": 17.5, "unit": "g/dL"},
                "female": {"min": 12.0, "max": 15.5, "unit": "g/dL"},
                "aliases": ["hb", "haemoglobin", "hemoglobin"]
            },
            "wbc_count": {
                "normal": {"min": 4000, "max": 11000, "unit": "/μL"},
                "aliases": ["wbc", "white blood cell", "leucocyte", "leukocyte"]
            },
            "rbc_count": {
                "male": {"min": 4.7, "max": 6.1, "unit": "million/μL"},
                "female": {"min": 4.2, "max": 5.4, "unit": "million/μL"},
                "aliases": ["rbc", "red blood cell", "erythrocyte"]
            },
            "platelet_count": {
                "normal": {"min": 150000, "max": 450000, "unit": "/μL"},
                "aliases": ["platelets", "thrombocyte"]
            },
            "glucose": {
                "fasting": {"min": 70, "max": 100, "unit": "mg/dL"},
                "random": {"min": 70, "max": 140, "unit": "mg/dL"},
                "aliases": ["blood sugar", "blood glucose", "sugar"]
            },
            "cholesterol": {
                "total": {"min": 0, "max": 200, "unit": "mg/dL"},
                "aliases": ["total cholesterol", "chol"]
            },
            "hdl_cholesterol": {
                "male": {"min": 40, "max": 999, "unit": "mg/dL"},
                "female": {"min": 50, "max": 999, "unit": "mg/dL"},
                "aliases": ["hdl", "good cholesterol"]
            },
            "ldl_cholesterol": {
                "normal": {"min": 0, "max": 100, "unit": "mg/dL"},
                "aliases": ["ldl", "bad cholesterol"]
            },
            "triglycerides": {
                "normal": {"min": 0, "max": 150, "unit": "mg/dL"},
                "aliases": ["tg", "triglyceride"]
            },
            "creatinine": {
                "male": {"min": 0.7, "max": 1.3, "unit": "mg/dL"},
                "female": {"min": 0.6, "max": 1.1, "unit": "mg/dL"},
                "aliases": ["creat", "serum creatinine"]
            },
            "urea": {
                "normal": {"min": 7, "max": 20, "unit": "mg/dL"},
                "aliases": ["blood urea", "bun"]
            },
            "bilirubin_total": {
                "normal": {"min": 0.3, "max": 1.2, "unit": "mg/dL"},
                "aliases": ["total bilirubin", "bilirubin"]
            },
            "sgpt_alt": {
                "male": {"min": 7, "max": 56, "unit": "U/L"},
                "female": {"min": 7, "max": 56, "unit": "U/L"},
                "aliases": ["alt", "sgpt", "alanine aminotransferase"]
            },
            "sgot_ast": {
                "normal": {"min": 10, "max": 40, "unit": "U/L"},
                "aliases": ["ast", "sgot", "aspartate aminotransferase"]
            },
            "thyroid_tsh": {
                "normal": {"min": 0.27, "max": 4.2, "unit": "μIU/mL"},
                "aliases": ["tsh", "thyroid stimulating hormone"]
            },
            "vitamin_d": {
                "normal": {"min": 30, "max": 100, "unit": "ng/mL"},
                "aliases": ["25-oh vitamin d", "vitamin d3"]
            },
            "vitamin_b12": {
                "normal": {"min": 200, "max": 900, "unit": "pg/mL"},
                "aliases": ["b12", "cobalamin"]
            }
        }
    
    def _load_report_patterns(self) -> Dict[str, List[str]]:
        """Load patterns for different report types"""
        return {
            "blood_test": [
                r"complete blood count", r"cbc", r"hemogram", r"blood test",
                r"lipid profile", r"liver function", r"kidney function"
            ],
            "urine_test": [
                r"urine", r"urinalysis", r"urine routine", r"urine culture"
            ],
            "xray": [
                r"x-ray", r"xray", r"radiograph", r"chest x-ray", r"skeletal"
            ],
            "ct_scan": [
                r"ct scan", r"computed tomography", r"ct", r"cat scan"
            ],
            "mri": [
                r"mri", r"magnetic resonance", r"mr imaging"
            ],
            "ecg": [
                r"ecg", r"ekg", r"electrocardiogram", r"cardiac"
            ],
            "ultrasound": [
                r"ultrasound", r"sonography", r"usg", r"doppler"
            ]
        }
    
    async def analyze_report(
        self, 
        text: str, 
        file_type: str, 
        file_name: str, 
        user_id: str
    ) -> ReportAnalysisResponse:
        """Analyze medical report text"""
        
        # Determine report type
        report_type = self._identify_report_type(text, file_name)
        
        # Extract lab values
        lab_results = self._extract_lab_values(text)
        
        # Analyze findings
        findings = []
        abnormal_count = 0
        
        for result in lab_results:
            status, concern = self._analyze_lab_value(
                result["parameter"], 
                result["value"], 
                result["unit"]
            )
            
            lab_finding = LabResult(
                parameter=result["parameter"],
                value=result["value"],
                unit=result["unit"],
                normalRange=result["normal_range"],
                status=status,
                concern=concern
            )
            findings.append(lab_finding)
            
            if status in ["high", "low", "critical"]:
                abnormal_count += 1
        
        # Generate diagnosis and recommendations
        diagnosis = self._generate_diagnosis(findings, report_type)
        recommendations = self._generate_recommendations(findings, report_type)
        urgency = self._determine_urgency(findings)
        
        # Calculate confidence
        confidence = self._calculate_confidence(findings, text)
        
        return ReportAnalysisResponse(
            type=report_type.replace("_", " ").title(),
            findings=findings,
            diagnosis=diagnosis,
            recommendations=recommendations,
            urgency=urgency,
            confidence=confidence,
            model="report-analyzer-v1.0"
        )
    
    async def analyze_uploaded_file(self, file_path: str, user_id: str) -> ReportAnalysisResponse:
        """Analyze uploaded file (image or PDF)"""
        
        file_extension = file_path.split('.')[-1].lower()
        extracted_text = ""
        
        try:
            if file_extension == 'pdf':
                # Convert PDF to images and extract text
                images = convert_from_path(file_path)
                for image in images:
                    # Convert PIL image to numpy array
                    img_array = np.array(image)
                    text = pytesseract.image_to_string(img_array)
                    extracted_text += text + "\n"
            
            elif file_extension in ['jpg', 'jpeg', 'png', 'bmp', 'tiff']:
                # Process image and extract text
                processed_image = self._preprocess_image(file_path)
                extracted_text = pytesseract.image_to_string(processed_image)
            
            # Analyze the extracted text
            return await self.analyze_report(
                text=extracted_text,
                file_type=file_extension,
                file_name=file_path.split('/')[-1],
                user_id=user_id
            )
            
        except Exception as e:
            # Return error response
            return ReportAnalysisResponse(
                type="Error",
                findings=[],
                diagnosis=f"Error processing file: {str(e)}",
                recommendations=["Please try uploading a clearer image or different file format"],
                urgency="low",
                confidence=0.0,
                model="report-analyzer-v1.0"
            )
    
    def _preprocess_image(self, image_path: str) -> np.ndarray:
        """Preprocess image for better OCR results"""
        
        # Read image
        image = cv2.imread(image_path)
        
        # Convert to grayscale
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        
        # Apply Gaussian blur to reduce noise
        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
        
        # Apply threshold to get binary image
        _, thresh = cv2.threshold(blurred, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
        
        # Morphological operations to clean up
        kernel = np.ones((1, 1), np.uint8)
        cleaned = cv2.morphologyEx(thresh, cv2.MORPH_CLOSE, kernel)
        cleaned = cv2.morphologyEx(cleaned, cv2.MORPH_OPEN, kernel)
        
        # Resize image for better OCR
        height, width = cleaned.shape
        if height < 1000:
            scale_factor = 1000 / height
            new_width = int(width * scale_factor)
            cleaned = cv2.resize(cleaned, (new_width, 1000), interpolation=cv2.INTER_CUBIC)
        
        return cleaned
    
    def _identify_report_type(self, text: str, file_name: str) -> str:
        """Identify the type of medical report"""
        
        text_lower = text.lower()
        file_name_lower = file_name.lower()
        combined_text = text_lower + " " + file_name_lower
        
        for report_type, patterns in self.report_patterns.items():
            for pattern in patterns:
                if re.search(pattern, combined_text):
                    return report_type
        
        return "general_report"
    
    def _extract_lab_values(self, text: str) -> List[Dict[str, str]]:
        """Extract laboratory values from text"""
        
        lab_results = []
        lines = text.split('\n')
        
        # Common patterns for lab values
        value_patterns = [
            r'(\w+(?:\s+\w+)*)\s*:?\s*(\d+\.?\d*)\s*(\w+/?[\w\s]*)',
            r'(\w+(?:\s+\w+)*)\s+(\d+\.?\d*)\s+(\w+/?[\w\s]*)',
            r'(\w+(?:\s+\w+)*)\s*[-:]\s*(\d+\.?\d*)\s*(\w+/?[\w\s]*)'
        ]
        
        for line in lines:
            line = line.strip()
            if not line or len(line) < 5:
                continue
                
            for pattern in value_patterns:
                matches = re.findall(pattern, line, re.IGNORECASE)
                for match in matches:
                    parameter = match[0].strip()
                    value = match[1].strip()
                    unit = match[2].strip() if len(match) > 2 else ""
                    
                    # Skip if parameter is too short or looks like noise
                    if len(parameter) < 3 or parameter.isdigit():
                        continue
                    
                    # Find matching lab parameter
                    matched_param = self._match_lab_parameter(parameter)
                    if matched_param:
                        normal_range = self._get_normal_range(matched_param)
                        
                        lab_results.append({
                            "parameter": matched_param.replace("_", " ").title(),
                            "value": value,
                            "unit": unit or self.lab_reference_ranges[matched_param].get("unit", ""),
                            "normal_range": normal_range
                        })
        
        return lab_results
    
    def _match_lab_parameter(self, parameter: str) -> Optional[str]:
        """Match extracted parameter with known lab parameters"""
        
        parameter_lower = parameter.lower()
        
        for lab_param, info in self.lab_reference_ranges.items():
            # Check direct match
            if lab_param.replace("_", " ") in parameter_lower:
                return lab_param
            
            # Check aliases
            for alias in info.get("aliases", []):
                if alias.lower() in parameter_lower:
                    return lab_param
        
        return None
    
    def _get_normal_range(self, parameter: str) -> str:
        """Get normal range for a parameter"""
        
        param_info = self.lab_reference_ranges.get(parameter, {})
        
        if "normal" in param_info:
            range_info = param_info["normal"]
            unit = param_info.get("unit", "")
            return f"{range_info['min']}-{range_info['max']} {unit}"
        elif "male" in param_info and "female" in param_info:
            male_range = param_info["male"]
            female_range = param_info["female"]
            unit = param_info.get("unit", "")
            return f"M: {male_range['min']}-{male_range['max']}, F: {female_range['min']}-{female_range['max']} {unit}"
        
        return "Reference range not available"
    
    def _analyze_lab_value(self, parameter: str, value: str, unit: str) -> tuple:
        """Analyze if lab value is normal, high, or low"""
        
        try:
            numeric_value = float(value)
        except ValueError:
            return "unknown", "Unable to analyze non-numeric value"
        
        # Find parameter in reference ranges
        param_key = None
        for key in self.lab_reference_ranges.keys():
            if key.replace("_", " ").lower() == parameter.lower():
                param_key = key
                break
        
        if not param_key:
            return "unknown", "Reference range not available"
        
        param_info = self.lab_reference_ranges[param_key]
        
        # Determine reference range (using normal or male range as default)
        if "normal" in param_info:
            ref_range = param_info["normal"]
        elif "male" in param_info:
            ref_range = param_info["male"]
        else:
            return "unknown", "Reference range not available"
        
        min_val = ref_range["min"]
        max_val = ref_range["max"]
        
        # Analyze value
        if numeric_value < min_val:
            severity = "critical" if numeric_value < min_val * 0.5 else "low"
            concern = self._get_low_value_concern(param_key, numeric_value, min_val)
            return severity, concern
        elif numeric_value > max_val:
            severity = "critical" if numeric_value > max_val * 2 else "high"
            concern = self._get_high_value_concern(param_key, numeric_value, max_val)
            return severity, concern
        else:
            return "normal", None
    
    def _get_low_value_concern(self, parameter: str, value: float, min_val: float) -> str:
        """Get concern message for low values"""
        
        concerns = {
            "hemoglobin": "Possible anemia - may cause fatigue and weakness",
            "wbc_count": "Low immunity - increased infection risk",
            "platelet_count": "Bleeding risk - consult hematologist",
            "glucose": "Hypoglycemia - monitor blood sugar closely",
            "thyroid_tsh": "Possible hyperthyroidism",
            "vitamin_d": "Vitamin D deficiency - bone health concern",
            "vitamin_b12": "B12 deficiency - may cause neurological issues"
        }
        
        return concerns.get(parameter, f"Below normal range - consult doctor")
    
    def _get_high_value_concern(self, parameter: str, value: float, max_val: float) -> str:
        """Get concern message for high values"""
        
        concerns = {
            "wbc_count": "Possible infection or inflammation",
            "glucose": "Possible diabetes - requires immediate attention",
            "cholesterol": "High cholesterol - cardiovascular risk",
            "ldl_cholesterol": "Bad cholesterol high - heart disease risk",
            "triglycerides": "High triglycerides - metabolic concern",
            "creatinine": "Kidney function concern",
            "urea": "Kidney function issue",
            "bilirubin_total": "Liver function concern",
            "sgpt_alt": "Liver enzyme elevated",
            "sgot_ast": "Liver enzyme elevated",
            "thyroid_tsh": "Possible hypothyroidism"
        }
        
        return concerns.get(parameter, f"Above normal range - consult doctor")
    
    def _generate_diagnosis(self, findings: List[LabResult], report_type: str) -> str:
        """Generate overall diagnosis based on findings"""
        
        abnormal_findings = [f for f in findings if f.status in ["high", "low", "critical"]]
        
        if not abnormal_findings:
            return f"Normal {report_type.replace('_', ' ')} with no significant abnormalities detected"
        
        # Group abnormalities by system
        liver_issues = [f for f in abnormal_findings if any(term in f.parameter.lower() 
                      for term in ["bilirubin", "sgpt", "sgot", "alt", "ast"])]
        kidney_issues = [f for f in abnormal_findings if any(term in f.parameter.lower() 
                        for term in ["creatinine", "urea", "bun"])]
        cardiac_issues = [f for f in abnormal_findings if any(term in f.parameter.lower() 
                         for term in ["cholesterol", "triglyceride", "hdl", "ldl"])]
        blood_issues = [f for f in abnormal_findings if any(term in f.parameter.lower() 
                       for term in ["hemoglobin", "wbc", "rbc", "platelet"])]
        metabolic_issues = [f for f in abnormal_findings if any(term in f.parameter.lower() 
                           for term in ["glucose", "thyroid", "tsh"])]
        
        diagnosis_parts = []
        
        if liver_issues:
            diagnosis_parts.append("liver function abnormalities")
        if kidney_issues:
            diagnosis_parts.append("kidney function concerns")
        if cardiac_issues:
            diagnosis_parts.append("cardiovascular risk factors")
        if blood_issues:
            diagnosis_parts.append("hematological abnormalities")
        if metabolic_issues:
            diagnosis_parts.append("metabolic disorders")
        
        if diagnosis_parts:
            return f"Report shows {', '.join(diagnosis_parts)}. Further evaluation recommended."
        else:
            return f"Multiple abnormal values detected in {report_type.replace('_', ' ')}. Comprehensive medical evaluation needed."
    
    def _generate_recommendations(self, findings: List[LabResult], report_type: str) -> List[str]:
        """Generate recommendations based on findings"""
        
        recommendations = []
        abnormal_findings = [f for f in findings if f.status in ["high", "low", "critical"]]
        
        if not abnormal_findings:
            recommendations.extend([
                "Continue regular health monitoring",
                "Maintain healthy lifestyle",
                "Follow up as per doctor's advice"
            ])
            return recommendations
        
        # Critical findings
        critical_findings = [f for f in findings if f.status == "critical"]
        if critical_findings:
            recommendations.append("Seek immediate medical attention for critical values")
        
        # Specific recommendations based on abnormalities
        for finding in abnormal_findings:
            param_lower = finding.parameter.lower()
            
            if "hemoglobin" in param_lower and finding.status == "low":
                recommendations.append("Iron-rich diet and iron supplements as prescribed")
            elif "glucose" in param_lower and finding.status == "high":
                recommendations.append("Diabetes screening and dietary modifications")
            elif "cholesterol" in param_lower and finding.status == "high":
                recommendations.append("Low-fat diet and regular exercise")
            elif "creatinine" in param_lower and finding.status == "high":
                recommendations.append("Nephrology consultation and kidney function monitoring")
            elif "liver" in param_lower or any(term in param_lower for term in ["sgpt", "sgot", "bilirubin"]):
                recommendations.append("Hepatology consultation and liver function monitoring")
        
        # General recommendations
        recommendations.extend([
            "Follow up with healthcare provider",
            "Repeat tests as recommended",
            "Maintain medication compliance if prescribed"
        ])
        
        return list(set(recommendations))  # Remove duplicates
    
    def _determine_urgency(self, findings: List[LabResult]) -> str:
        """Determine urgency level based on findings"""
        
        critical_count = len([f for f in findings if f.status == "critical"])
        abnormal_count = len([f for f in findings if f.status in ["high", "low"]])
        
        if critical_count > 0:
            return "critical"
        elif abnormal_count >= 3:
            return "high"
        elif abnormal_count >= 1:
            return "moderate"
        else:
            return "low"
    
    def _calculate_confidence(self, findings: List[LabResult], text: str) -> float:
        """Calculate confidence in the analysis"""
        
        base_confidence = 0.7
        
        # Increase confidence based on number of extracted values
        value_count = len(findings)
        if value_count >= 5:
            base_confidence += 0.2
        elif value_count >= 3:
            base_confidence += 0.1
        
        # Increase confidence if text quality seems good
        if len(text) > 500 and not re.search(r'[^\w\s\.\,\:\-\(\)]', text):
            base_confidence += 0.1
        
        return min(base_confidence * 100, 95.0)  # Cap at 95%