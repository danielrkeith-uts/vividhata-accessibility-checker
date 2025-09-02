import React from 'react';
import './PriorityChart.css';

interface PriorityData {
  level: string;
  value: number;
  color: string;
}

interface PriorityChartProps {
  data: PriorityData[];
}

export const PriorityChart: React.FC<PriorityChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  
  // Calculate SVG path for pie chart
  const createPieSlice = (startAngle: number, endAngle: number, radius: number) => {
    const x1 = radius * Math.cos(startAngle);
    const y1 = radius * Math.sin(startAngle);
    const x2 = radius * Math.cos(endAngle);
    const y2 = radius * Math.sin(endAngle);
    
    const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;
    
    return [
      `M ${radius} ${radius}`,
      `L ${radius + x1} ${radius + y1}`,
      `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${radius + x2} ${radius + y2}`,
      'Z'
    ].join(' ');
  };

  let currentAngle = -Math.PI / 2; 

  return (
    <div className="priority-chart">
      <div className="chart-header">
        <h3>Priority Breakdown</h3>
      </div>
      
      <div className="chart-container">
        <div className="pie-chart">
          <svg width="200" height="200" viewBox="0 0 200 200">
            {data.map((item, index) => {
              const sliceAngle = (item.value / total) * 2 * Math.PI;
              const startAngle = currentAngle;
              const endAngle = currentAngle + sliceAngle;
              
              const path = createPieSlice(startAngle, endAngle, 80);
              
              currentAngle += sliceAngle;
              
              return (
                <path
                  key={index}
                  d={path}
                  fill={item.color}
                  stroke="white"
                  strokeWidth="2"
                />
              );
            })}
          </svg>
        </div>
        
        <div className="chart-legend">
          {data.map((item, index) => (
            <div key={index} className="legend-item">
              <div 
                className="legend-color"
                style={{ backgroundColor: item.color }}
              ></div>
              <div className="legend-text">
                <span className="legend-level">{item.level}</span>
                <span className="legend-value">{item.value.toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
