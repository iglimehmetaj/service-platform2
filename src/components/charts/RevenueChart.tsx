// components/charts/RevenueChart.tsx
'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { useState, useEffect } from 'react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RevenueChartProps {
  timePeriod: 'week' | 'month';
  selectedDate: Date;
}

export default function RevenueChart({ timePeriod, selectedDate }: RevenueChartProps) {
  const [chartData, setChartData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          `/api/dashboard/revenue/chart?period=${timePeriod}&date=${selectedDate.toISOString()}`
        );
        const data = await response.json();
        
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: 'Të Ardhurat (L)',
              data: data.values,
              borderColor: 'rgb(34, 197, 94)',
              backgroundColor: 'rgba(34, 197, 94, 0.2)',
              tension: 0.3,
              fill: true,
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
        text: `Të Ardhurat ${timePeriod === 'week' ? 'javore' : 'mujore'}`,
      },
    },
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Të Ardhurat</h3>
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500">Duke ngarkuar të dhënat...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
      <h3 className="text-lg font-semibold text-slate-800 mb-4">Të Ardhurat</h3>
      {chartData ? (
        <Line data={chartData} options={options} />
      ) : (
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500">Nuk ka të dhëna për këtë periudhë</p>
        </div>
      )}
    </div>
  );
}