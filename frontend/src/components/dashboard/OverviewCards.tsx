import React from 'react';
import './OverviewCards.css';

interface OverviewCardsProps {
  accessibilityTrend: number[];
  ranking: string;
  improvement: number;
  majorIssues: number;
  targetCompliance: number;
  topIssues: string[];
}

export const OverviewCards: React.FC<OverviewCardsProps> = ({
  accessibilityTrend,
  ranking,
  improvement,
  majorIssues,
  targetCompliance,
  topIssues
}) => {
  return (
    <div className="overview-cards">
      <div className="overview-card">
        <div className="card-header">
          <h3>Accessibility over last 30 days</h3>
        </div>
        <div className="card-content">
          <div className="trend-chart">
            {/* Simple line chart representation */}
            <div className="trend-line">
              {accessibilityTrend.map((value, index) => (
                <div
                  key={index}
                  className="trend-point"
                  style={{ 
                    left: `${(index / (accessibilityTrend.length - 1)) * 100}%`,
                    bottom: `${value}%`
                  }}
                />
              ))}
            </div>
            <div className="trend-axis">
              <span>0</span>
              <span>50</span>
              <span>100</span>
            </div>
          </div>
        </div>
      </div>

      <div className="overview-card">
        <div className="card-header">
          <div className="card-icon purple">
            <span>📊</span>
          </div>
          <h3>Your ranking</h3>
        </div>
        <div className="card-content">
          <p className="ranking-text">{ranking}</p>
          <p className="improvement-text">
            <span className="improvement-arrow">↗</span>
            {improvement}% since last scan
          </p>
        </div>
      </div>

      <div className="overview-card">
        <div className="card-header">
          <div className="card-icon purple">
            <span>🎯</span>
          </div>
          <h3>Action needed</h3>
        </div>
        <div className="card-content">
          <p className="action-text">
            Address {majorIssues} major issues to reach {targetCompliance}% compliance
          </p>
        </div>
      </div>

      <div className="overview-card">
        <div className="card-header">
          <div className="card-icon purple">
            <span>📋</span>
          </div>
          <h3>Top issues to fix</h3>
        </div>
        <div className="card-content">
          <ul className="top-issues-list">
            {topIssues.map((issue, index) => (
              <li key={index} className="top-issue-item">
                {issue}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
