import base64
import io
import speech_recognition as sr
from gtts import gTTS
from pydub import AudioSegment
import tempfile
import os
from typing import Optional

class VoiceProcessor:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.supported_languages = {
            'en': 'en-US',
            'hi': 'hi-IN', 
            'te': 'te-IN',
            'ta': 'ta-IN'
        }
    
    async def speech_to_text(self, audio_data: str, language: str = 'en') -> str:
        """Convert speech to text"""
        try:
            # Decode base64 audio data
            audio_bytes = base64.b64decode(audio_data)
            
            # Create temporary file
            with tempfile.NamedTemporaryFile(suffix='.wav', delete=False) as temp_file:
                temp_file.write(audio_bytes)
                temp_file_path = temp_file.name
            
            # Convert audio format if needed
            audio = AudioSegment.from_file(temp_file_path)
            audio = audio.set_frame_rate(16000).set_channels(1)
            
            # Save as WAV
            wav_path = temp_file_path.replace('.wav', '_converted.wav')
            audio.export(wav_path, format='wav')
            
            # Recognize speech
            with sr.AudioFile(wav_path) as source:
                audio_data = self.recognizer.record(source)
                
            # Get language code
            lang_code = self.supported_languages.get(language, 'en-US')
            
            # Recognize speech
            text = self.recognizer.recognize_google(audio_data, language=lang_code)
            
            # Cleanup
            os.unlink(temp_file_path)
            os.unlink(wav_path)
            
            return text
            
        except sr.UnknownValueError:
            return "Could not understand audio"
        except sr.RequestError as e:
            return f"Speech recognition error: {str(e)}"
        except Exception as e:
            return f"Error processing audio: {str(e)}"
    
    async def text_to_speech(self, text: str, language: str = 'en') -> str:
        """Convert text to speech and return base64 encoded audio"""
        try:
            # Create TTS object
            tts = gTTS(text=text, lang=language, slow=False)
            
            # Save to temporary file
            with tempfile.NamedTemporaryFile(suffix='.mp3', delete=False) as temp_file:
                tts.save(temp_file.name)
                temp_file_path = temp_file.name
            
            # Convert to WAV for better compatibility
            audio = AudioSegment.from_mp3(temp_file_path)
            wav_path = temp_file_path.replace('.mp3', '.wav')
            audio.export(wav_path, format='wav')
            
            # Read and encode as base64
            with open(wav_path, 'rb') as audio_file:
                audio_data = audio_file.read()
                encoded_audio = base64.b64encode(audio_data).decode('utf-8')
            
            # Cleanup
            os.unlink(temp_file_path)
            os.unlink(wav_path)
            
            return encoded_audio
            
        except Exception as e:
            raise Exception(f"Text-to-speech error: {str(e)}")