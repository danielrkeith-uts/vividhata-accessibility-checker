import React from 'react';
import './OverviewCard.css';
import { LineChart } from '@mui/x-charts';

interface OverviewCardsProps {
  accessibilityXAxis: number[];
  accessibilityYAxis: number[];
  improvement: number;
}

export const OverviewCard: React.FC<OverviewCardsProps> = ({
  accessibilityXAxis,
  accessibilityYAxis,
  improvement,
}) => {
  
  return (
    <div className="overview-cards">
      {/* Accessibility Trend Card */}
      <div className="overview-card">
        <div className="card-header">
          <h3>Overview</h3>
        </div>
        <div className="chart-container">
        <div className="card-content">
          <LineChart
            xAxis={[
              {
                data: accessibilityXAxis,
                label: 'Days',
                scaleType: 'linear',
              }
            ]}
            series={[
              {
                data: accessibilityYAxis,
                label: 'Accessibility Score',
                color: '#8b5cf6',
                curve: 'linear',
              },
            ]}
            width={500}
            height={200}
            margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
            grid={{ vertical: true, horizontal: true }}
            sx={{
              '& .MuiLineChart-root': {
                '& .MuiChartsAxis-line': {
                  stroke: '#e5e7eb',
                },
                '& .MuiChartsAxis-tick': {
                  stroke: '#e5e7eb',
                },
                '& .MuiChartsAxis-tickLabel': {
                  fontSize: '12px',
                  fill: '#6b7280',
                },
                '& .MuiChartsGrid-line': {
                  stroke: '#f3f4f6',
                  strokeDasharray: '3 3',
                },
              },
            }}
          />

        </div>
        <p className="improvement-text">
            <span className="improvement-arrow">↗</span>
            {improvement}% since last scan
          </p>
        </div>
      </div>
    </div>
  );
};