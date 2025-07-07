import React, { useState, useEffect } from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { 
  TrendingUp, 
  TrendingDown, 
  Activity, 
  Heart, 
  Thermometer,
  Droplets,
  Calendar,
  Filter
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const HealthTrends = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('7days');
  const [selectedMetric, setSelectedMetric] = useState('all');
  const [healthData, setHealthData] = useState({});

  const periods = [
    { id: '7days', name: '7 Days' },
    { id: '1month', name: '1 Month' },
    { id: '3months', name: '3 Months' },
    { id: '6months', name: '6 Months' }
  ];

  const metrics = [
    { id: 'all', name: 'All Metrics', icon: Activity },
    { id: 'heartRate', name: 'Heart Rate', icon: Heart },
    { id: 'temperature', name: 'Temperature', icon: Thermometer },
    { id: 'hydration', name: 'Hydration', icon: Droplets }
  ];

  useEffect(() => {
    generateHealthData();
  }, [selectedPeriod]);

  const generateHealthData = () => {
    const days = selectedPeriod === '7days' ? 7 : 
                 selectedPeriod === '1month' ? 30 :
                 selectedPeriod === '3months' ? 90 : 180;

    const labels = [];
    const heartRateData = [];
    const temperatureData = [];
    const hydrationData = [];
    const symptomsData = [];

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      if (days <= 7) {
        labels.push(date.toLocaleDateString('en', { weekday: 'short' }));
      } else if (days <= 30) {
        labels.push(date.toLocaleDateString('en', { month: 'short', day: 'numeric' }));
      } else {
        labels.push(date.toLocaleDateString('en', { month: 'short' }));
      }

      // Generate realistic health data with some variation
      heartRateData.push(Math.floor(Math.random() * 20) + 65); // 65-85 bpm
      temperatureData.push((Math.random() * 2 + 97.5).toFixed(1)); // 97.5-99.5°F
      hydrationData.push(Math.floor(Math.random() * 4) + 6); // 6-10 glasses
      symptomsData.push(Math.floor(Math.random() * 3)); // 0-2 symptoms
    }

    setHealthData({
      labels,
      heartRate: heartRateData,
      temperature: temperatureData,
      hydration: hydrationData,
      symptoms: symptomsData
    });
  };

  const heartRateChartData = {
    labels: healthData.labels || [],
    datasets: [
      {
        label: 'Heart Rate (bpm)',
        data: healthData.heartRate || [],
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const temperatureChartData = {
    labels: healthData.labels || [],
    datasets: [
      {
        label: 'Temperature (°F)',
        data: healthData.temperature || [],
        borderColor: 'rgb(245, 158, 11)',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        tension: 0.4,
        fill: true
      }
    ]
  };

  const hydrationChartData = {
    labels: healthData.labels || [],
    datasets: [
      {
        label: 'Water Intake (glasses)',
        data: healthData.hydration || [],
        backgroundColor: 'rgba(59, 130, 246, 0.8)',
        borderColor: 'rgb(59, 130, 246)',
        borderWidth: 1
      }
    ]
  };

  const symptomsDistribution = {
    labels: ['No Symptoms', 'Mild Symptoms', 'Moderate Symptoms'],
    datasets: [
      {
        data: [
          (healthData.symptoms || []).filter(s => s === 0).length,
          (healthData.symptoms || []).filter(s => s === 1).length,
          (healthData.symptoms || []).filter(s => s === 2).length
        ],
        backgroundColor: ['#10B981', '#F59E0B', '#EF4444'],
        borderWidth: 0
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: false,
      },
    },
  };

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
    },
  };

  const getHealthScore = () => {
    if (!healthData.heartRate || !healthData.temperature || !healthData.symptoms) return 0;
    
    const avgHeartRate = healthData.heartRate.reduce((a, b) => a + b, 0) / healthData.heartRate.length;
    const avgTemp = healthData.temperature.reduce((a, b) => a + parseFloat(b), 0) / healthData.temperature.length;
    const avgSymptoms = healthData.symptoms.reduce((a, b) => a + b, 0) / healthData.symptoms.length;
    
    let score = 100;
    
    // Deduct points for abnormal heart rate
    if (avgHeartRate < 60 || avgHeartRate > 100) score -= 10;
    
    // Deduct points for abnormal temperature
    if (avgTemp < 97 || avgTemp > 99) score -= 15;
    
    // Deduct points for symptoms
    score -= avgSymptoms * 20;
    
    return Math.max(score, 0);
  };

  const getTrend = (data) => {
    if (!data || data.length < 2) return 'stable';
    const recent = data.slice(-3).reduce((a, b) => a + (typeof b === 'string' ? parseFloat(b) : b), 0) / 3;
    const previous = data.slice(-6, -3).reduce((a, b) => a + (typeof b === 'string' ? parseFloat(b) : b), 0) / 3;
    
    if (recent > previous * 1.05) return 'up';
    if (recent < previous * 0.95) return 'down';
    return 'stable';
  };

  const healthScore = getHealthScore();

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Health Trends</h2>
            <p className="text-gray-600 text-sm">Track your health metrics over time</p>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {periods.map(period => (
              <option key={period.id} value={period.id}>{period.name}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Health Score */}
      <div className="mb-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Overall Health Score</h3>
            <p className="text-gray-600 text-sm">Based on your recent health data</p>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${
              healthScore >= 80 ? 'text-green-600' :
              healthScore >= 60 ? 'text-yellow-600' : 'text-red-600'
            }`}>
              {Math.round(healthScore)}
            </div>
            <div className="text-sm text-gray-500">out of 100</div>
          </div>
        </div>
        <div className="mt-3 w-full bg-gray-200 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-500 ${
              healthScore >= 80 ? 'bg-green-500' :
              healthScore >= 60 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${healthScore}%` }}
          ></div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="p-4 bg-red-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Heart className="w-5 h-5 text-red-500" />
              <span className="font-medium text-gray-900">Heart Rate</span>
            </div>
            {getTrend(healthData.heartRate) === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : getTrend(healthData.heartRate) === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {healthData.heartRate ? Math.round(healthData.heartRate.slice(-1)[0]) : '--'} bpm
          </div>
          <div className="text-sm text-gray-500">Average: {healthData.heartRate ? Math.round(healthData.heartRate.reduce((a, b) => a + b, 0) / healthData.heartRate.length) : '--'} bpm</div>
        </div>

        <div className="p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Thermometer className="w-5 h-5 text-yellow-500" />
              <span className="font-medium text-gray-900">Temperature</span>
            </div>
            {getTrend(healthData.temperature) === 'up' ? (
              <TrendingUp className="w-4 h-4 text-red-500" />
            ) : getTrend(healthData.temperature) === 'down' ? (
              <TrendingDown className="w-4 h-4 text-green-500" />
            ) : (
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {healthData.temperature ? healthData.temperature.slice(-1)[0] : '--'}°F
          </div>
          <div className="text-sm text-gray-500">
            Average: {healthData.temperature ? (healthData.temperature.reduce((a, b) => a + parseFloat(b), 0) / healthData.temperature.length).toFixed(1) : '--'}°F
          </div>
        </div>

        <div className="p-4 bg-blue-50 rounded-lg">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Droplets className="w-5 h-5 text-blue-500" />
              <span className="font-medium text-gray-900">Hydration</span>
            </div>
            {getTrend(healthData.hydration) === 'up' ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : getTrend(healthData.hydration) === 'down' ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <div className="w-4 h-4 bg-gray-400 rounded-full"></div>
            )}
          </div>
          <div className="text-2xl font-bold text-gray-900">
            {healthData.hydration ? healthData.hydration.slice(-1)[0] : '--'} glasses
          </div>
          <div className="text-sm text-gray-500">
            Average: {healthData.hydration ? Math.round(healthData.hydration.reduce((a, b) => a + b, 0) / healthData.hydration.length) : '--'} glasses
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Heart Rate Trend</h3>
          <div className="h-64">
            <Line data={heartRateChartData} options={chartOptions} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Temperature Trend</h3>
          <div className="h-64">
            <Line data={temperatureChartData} options={chartOptions} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Water Intake</h3>
          <div className="h-64">
            <Bar data={hydrationChartData} options={barChartOptions} />
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Symptoms Distribution</h3>
          <div className="h-64">
            <Doughnut data={symptomsDistribution} options={doughnutOptions} />
          </div>
        </div>
      </div>

      {/* Health Insights */}
      <div className="mt-8 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-3">AI Health Insights</h3>
        <div className="space-y-2 text-sm">
          {healthScore >= 80 && (
            <p className="text-green-700">✅ Your health metrics are looking great! Keep up the good work.</p>
          )}
          {healthData.heartRate && healthData.heartRate.slice(-1)[0] > 85 && (
            <p className="text-yellow-700">⚠️ Your heart rate has been slightly elevated. Consider relaxation techniques.</p>
          )}
          {healthData.hydration && healthData.hydration.slice(-1)[0] < 7 && (
            <p className="text-blue-700">💧 Remember to stay hydrated. Aim for at least 8 glasses of water daily.</p>
          )}
          {healthData.symptoms && healthData.symptoms.slice(-3).some(s => s > 0) && (
            <p className="text-red-700">🏥 You've reported some symptoms recently. Consider consulting with a healthcare provider.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default HealthTrends;