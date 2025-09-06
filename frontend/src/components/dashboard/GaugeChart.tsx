import React from 'react';
import { Gauge } from '@mui/x-charts/Gauge';
import './GaugeChart.css';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { useState } from 'react';

interface CategoryStats {
  score: number;
  totalRequirements: number;
  compliantCount: number;
  atRiskCount: number;
  nonCompliantCount: number;
}

interface GaugeChartProps {
  score: number;
  totalRequirements: number;
  compliantCount: number;
  atRiskCount: number;
  nonCompliantCount: number;
  categoryData: {
    [category: string]: CategoryStats;
  };
}

export const GaugeChart: React.FC<GaugeChartProps> = ({
  score,
  totalRequirements,
  compliantCount,
  atRiskCount,
  nonCompliantCount,
  categoryData
}) => {

  const [selectedCategory, setSelectedCategory] = useState('All');

  const displayData =
  selectedCategory !== 'All' && categoryData[selectedCategory]
    ? categoryData[selectedCategory]
    : { score, totalRequirements, compliantCount, atRiskCount, nonCompliantCount };

  const getScoreCategory = () => {
    if (displayData.score >= 80) return { category: 'Compliant', color: '#10b981' };
    if (displayData.score >= 60) return { category: 'At Risk', color: '#f59e0b' };
    return { category: 'Non Compliant', color: '#ef4444' };
  };

  const scoreInfo = getScoreCategory();


  return (
    <div className="gauge-chart">
      {/* Header */}
      <div className="gauge-header">
        <h3>Overall Accessibility Score</h3>
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="gauge-category-label">Category</InputLabel>
          <Select
            sx={{textAlign: 'left'}}
            labelId="gauge-category-label"
            value={selectedCategory}
            label="Category"
            onChange={(e) => setSelectedCategory(e.target.value)}
          >
            <MenuItem value="All">All</MenuItem>
            <MenuItem value="Perceivable">Perceivable</MenuItem>
            <MenuItem value="Operable">Operable</MenuItem>
            <MenuItem value="Understandable">Understandable</MenuItem>
            <MenuItem value="Robust">Robust</MenuItem>
          </Select>
        </FormControl>
      </div>
  
      {/* Gauge with integrated score */}
      <div className="gauge-container">
        <div className="gauge-wrapper">
          <Gauge
            value={displayData.score}
            startAngle={-90}
            endAngle={90}
            width={400}
            height={400}
            sx={{
              [`& .MuiGauge-valueArc`]: { fill: scoreInfo.color },
              [`& .MuiGauge-referenceArc`]: { fill: '#e0e0e0' },
              [`& .MuiGauge-valueText`]: { display: 'none' },
            }}
          />
          <div className="gauge-center">
            <div className="score-value" style={{ color: scoreInfo.color }}>
              {displayData.score}%
            </div>
            <div className="score-category" style={{ color: scoreInfo.color }}>
              {scoreInfo.category}
            </div>
          </div>
        </div>
      </div>
  
      {/* Metrics underneath the gauge */}
<div className="gauge-metrics">
  <div className="metric">
    <div className="metric-circle">
      <div className="metric-value">{totalRequirements}</div>
    </div>
    <div className="metric-label">Requirements</div>
  </div>
  <div className="metric compliant">
    <div className="metric-circle">
      <div className="metric-value compliant">{compliantCount}</div>
    </div>
    <div className="metric-label">Compliant</div>
  </div>
  <div className="metric at-risk">
    <div className="metric-circle">
      <div className="metric-value at-risk">{atRiskCount}</div>
    </div>
    <div className="metric-label">At Risk</div>
  </div>
  <div className="metric non-compliant">
    <div className="metric-circle">
      <div className="metric-value non-compliant">{nonCompliantCount}</div>
    </div>
    <div className="metric-label">Noncompliant</div>
  </div>
</div>
</div>
  );
};