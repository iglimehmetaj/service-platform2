// components/charts/AppointmentsChart.tsx
'use client';

import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface AppointmentsChartProps {
  timePeriod: 'week' | 'month';
  selectedDate: Date;
}

export default function AppointmentsChart({ timePeriod, selectedDate }: AppointmentsChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/appointments/chart?period=${timePeriod}&date=${selectedDate.toISOString()}`
        );
        const data = await response.json();
        
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Takimet',
              data: data.values,
              backgroundColor: 'rgba(59, 130, 246, 0.8)',
            },
          ],
        });
      } catch (error) {
        console.error('Error fetching chart data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchChartData();
  }, [timePeriod, selectedDate]);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Takimet ${timePeriod === 'week' ? 'javore' : 'mujore'}`,
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Takimet</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500">Duke ngarkuar të dhënat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Takimet</h3>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500">Nuk ka të dhëna për këtë periudhë</p>
        </div>
      )}
    </div>
  );
}