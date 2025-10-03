import React from "react";

export interface StatsDonutProps {
  score: number;
  subtitle?: string;
  bullets?: string[];
}

export const StatsDonut: React.FC<StatsDonutProps> = ({ score, subtitle = "Compliant with WCAG", bullets = [] }) => {
  const safeScore = Math.max(0, Math.min(100, Math.round(score)));

  return (
    <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
      <div className="donut">
        <svg viewBox="0 0 36 36">
          <path className="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <path className="fg" strokeDasharray={`${safeScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
          <text x="18" y="20.35" className="percent">{safeScore}%</text>
        </svg>
        <div className="donut-sub">{subtitle}</div>
      </div>
      <div style={{ flex: 1 }}>
        {bullets.length > 0 && (
          <ul className="bullets">
            {bullets.map((b, i) => (<li key={i}>{b}</li>))}
          </ul>
        )}
      </div>
    </div>
  );
};


