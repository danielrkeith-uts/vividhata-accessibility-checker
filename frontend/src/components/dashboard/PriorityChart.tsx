import React from 'react';
import './PriorityChart.css';
import { PieChart } from '@mui/x-charts';

interface PriorityData {
  level: string;
  value: number;
  color: string;
}

interface PriorityChartProps {
  priorityData: PriorityData[];
}

export const PriorityChart: React.FC<PriorityChartProps> = ({ priorityData }) => {
  // Transform the data to match MUI PieChart format
  const chartData = priorityData.map((item, index) => ({
    id: index,
    value: item.value,
    label: item.level,
    color: item.color
  }));

  return (
    <div className="priority-chart">
      <div className="chart-header">
        <h3>Priority</h3>
      </div>
      <div className="chart-container">
        <PieChart
          series={[
            {
              data: chartData,
            },
          ]}
          width={250}
          height={250}
          colors={priorityData.map(item => item.color)} // Pass colors to the chart
        />
      </div>
    </div>
  );
};