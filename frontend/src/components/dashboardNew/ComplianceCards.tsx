import React from "react";

export interface BreakdownItem {
  label: string;
  grade: string;
  passedPercent: number;
  color?: string;
}

export const ComplianceCards: React.FC<{ items: BreakdownItem[] }> = ({ items }) => {
  return (
    <div className="card">
      <h3 className="card-title">Compliance Breakdown</h3>
      <div className="breakdown-list">
        {items.map((b) => (
          <div key={b.grade} className="breakdown-item">
            <div className="badge" style={{ background: b.color ?? '#22c55e' }}>{b.grade}</div>
            <div className="breakdown-copy">
              <div className="label">{b.label}</div>
              <div className="muted">{b.passedPercent}% passed</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


