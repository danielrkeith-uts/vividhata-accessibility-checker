import React from 'react';
import { Stack, Paper } from '@mui/material';
import PurpleTooltip from '../common/PurpleTooltip';

type Props = {
  pct: { A: number; AA: number; AAA: number };
  passed: { A: number; AA: number; AAA: number };
  totals: { A: number; AA: number; AAA: number };
};

export const ComplianceColumn: React.FC<Props> = ({ pct, passed, totals }) => {
  return (
    <Stack direction="column" className="right-column">
      <Paper className="card">
        <div className="card-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Compliance Breakdown</span>
          <PurpleTooltip title="WCAG compliance grouped by priority level (A, AA, AAA)">
            <span style={{ cursor: 'help', color: '#6b21a8', fontWeight: 700 }}>?</span>
          </PurpleTooltip>
        </div>
        <div className="compliance-cards">
          {([
            { key: 'A', className: 'a', title: 'Essential (A)', desc: 'Basic accessibility requirements.' },
            { key: 'AA', className: 'aa', title: 'Enhanced (AA)', desc: 'Standard compliance level.' },
            { key: 'AAA', className: 'aaa', title: 'Advanced (AAA)', desc: 'Highest accessibility standard.' },
          ] as const).map(item => (
            <div key={item.key} className={`compliance-card ${item.className}`}>
              <div className="left">
                <div className="badge">{item.key}</div>
                <div className="copy">
                  <div className="title">{item.title}</div>
                  <div className="desc">{item.desc}</div>
                </div>
              </div>
              <div className="right">
                <div className="pct">{pct[item.key as 'A' | 'AA' | 'AAA']}%</div>
                <div className="small">{passed[item.key as 'A' | 'AA' | 'AAA']} out of {totals[item.key as 'A' | 'AA' | 'AAA']} passed</div>
              </div>
            </div>
          ))}
        </div>
      </Paper>

      <Paper className="card">
        <h3 className="card-title">What is WCAG?</h3>
        <p className="muted">WCAG accessibility ensures your site is usable by people with disabilities. It’s important for creating an inclusive web where everyone can access content. Find out more.</p>
      </Paper>
    </Stack>
  );
};

export default ComplianceColumn;


