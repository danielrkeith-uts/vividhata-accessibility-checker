import React from 'react';
import './GaugeChart.css';

interface GaugeChartProps {
  score: number;
  totalRequirements: number;
  compliantCount: number;
  atRiskCount: number;
  nonCompliantCount: number;
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  score,
  totalRequirements,
  compliantCount,
  atRiskCount,
  nonCompliantCount
}) => {
  // Calculate the rotation angle for the gauge needle
  const rotation = (score / 100) * 180 - 90; 
  
  // Determine the score category and color
  const getScoreCategory = () => {
    if (score >= 80) return { category: 'Compliant', color: '#10b981' };
    if (score >= 60) return { category: 'At Risk', color: '#f59e0b' };
    return { category: 'Non Compliant', color: '#ef4444' };
  };

  const scoreInfo = getScoreCategory();

  return (
    <div className="gauge-chart">
      <div className="gauge-header">
        <h3>Overall Accessibility Score</h3>
        <select className="gauge-filter">
          <option>All</option>
          <option>Perceivable</option>
          <option>Operable</option>
          <option>Understandable</option>
          <option>Robust</option>
        </select>
      </div>
      
      <div className="gauge-container">
        <div className="gauge">
          {/* Gauge background with color sections */}
          <div className="gauge-background">
            <div className="gauge-section compliant" style={{ width: '40%' }}></div>
            <div className="gauge-section at-risk" style={{ width: '30%' }}></div>
            <div className="gauge-section non-compliant" style={{ width: '30%' }}></div>
          </div>
          
          {/* Gauge needle */}
          <div 
            className="gauge-needle"
            style={{ transform: `rotate(${rotation}deg)` }}
          ></div>
          
          {/* Center score display */}
          <div className="gauge-center">
            <div className="score-value" style={{ color: scoreInfo.color }}>
              {score}%
            </div>
            <div className="score-category" style={{ color: scoreInfo.color }}>
              {scoreInfo.category}
            </div>
          </div>
        </div>
      </div>
      
      {/* Metrics below the gauge */}
      <div className="gauge-metrics">
        <div className="metric">
          <span className="metric-value">{totalRequirements}</span>
          <span className="metric-label">Requirements</span>
        </div>
        <div className="metric">
          <span className="metric-value compliant">{compliantCount}</span>
          <span className="metric-label">Compliant</span>
        </div>
        <div className="metric">
          <span className="metric-value at-risk">{atRiskCount}</span>
          <span className="metric-label">At risk</span>
        </div>
        <div className="metric">
          <span className="metric-value non-compliant">{nonCompliantCount}</span>
          <span className="metric-label">Non compliant</span>
        </div>
      </div>
    </div>
  );
};
