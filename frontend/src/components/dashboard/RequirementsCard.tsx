import React from 'react';
import { Paper } from '@mui/material';
import PurpleTooltip from '../common/PurpleTooltip';

type Row = { id: number; text: string; category: string; level: 'A' | 'AA' | 'AAA'; };

type Props = {
  tab: 'requirements' | 'quickfixes';
  setTab: (t: 'requirements' | 'quickfixes') => void;
  requirementsRows: Row[];
  quickWins: { id: number; text: string; count: number }[];
};

export const RequirementsCard: React.FC<Props> = ({ tab, setTab, requirementsRows, quickWins }) => {
  return (
    <Paper className="card" data-pdf-expand>
      <div className="requirements-header">
        <div className="title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Requirements</span>
          <PurpleTooltip title="Detected WCAG criteria that need attention">
            <span style={{ cursor: 'help', color: '#6b21a8', fontWeight: 700 }}>?</span>
          </PurpleTooltip>
        </div>
        <div className="tabs">
          <button className={`tab ${tab === 'requirements' ? 'tab-active' : ''}`} onClick={() => setTab('requirements')}>Requirements</button>
          <button className={`tab ${tab === 'quickfixes' ? 'tab-active' : ''}`} onClick={() => setTab('quickfixes')}>Suggested Fixes</button>
        </div>
      </div>
      {tab === 'requirements' ? (
        <div className="requirements-table" data-pdf-expand>
          <div className="table-head">
            <div>Requirement</div>
            <div>Category</div>
            <div>Priority</div>
          </div>
          {requirementsRows.map((r) => (
            <div className="table-row" key={r.id}>
              <div>{r.text}</div>
              <div>{r.category}</div>
              <div>{r.level}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="suggested-fixes" data-pdf-expand>
          {quickWins.length === 0 ? (
            <div className="muted" style={{ padding: '8px 12px' }}>No quick fixes detected. Great job!</div>
          ) : (
            quickWins.map((q) => (
              <div className="table-row" key={q.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px', padding: '10px 12px', borderTop: '1px solid var(--panel-border)' }}>
                <div>{q.text}</div>
                <div style={{ textAlign: 'right', color: 'var(--muted)' }}>x{q.count}</div>
              </div>
            ))
          )}
        </div>
      )}
    </Paper>
  );
};

export default RequirementsCard;
