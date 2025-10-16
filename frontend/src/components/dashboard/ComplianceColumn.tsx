import React from 'react';
import { Stack, Paper } from '@mui/material';
import PurpleTooltip from '../common/PurpleTooltip';
import { Chip } from '../common/Chip';
import WCAGExplanationCards from './WCAGExplanationCards';
import './ComplianceColumn.css';

type Props = {
  pct: { A: number; AA: number; AAA: number };
  passed: { A: number; AA: number; AAA: number };
  totals: { A: number; AA: number; AAA: number };
};

export const ComplianceColumn: React.FC<Props> = ({ pct, passed, totals }) => {
  return (
    <Stack direction="column" className="right-column">
      <Paper className="card">
        <div className="card-title">
          <span>Compliance Breakdown</span>
          <PurpleTooltip title="WCAG compliance is divided into three priority levels: A (critical), AA (important for most users), and AAA (advanced, ideal for specific needs). Your compliance score shows how well your site meets each level's requirements.">
            <span className="tooltip-icon">?</span>
          </PurpleTooltip>
        </div>
        <div className="compliance-cards">
          {([
            { 
              key: 'A', 
              className: 'a', 
              title: 'Essential (A)', 
              desc: 'Basic accessibility requirements.',
              tooltip: 'Priority A is crucial for basic accessibility. If these requirements aren’t met. the content might be inaccessible to some users. Ensuring compliance is essential for basic usability.'
            },
            { 
              key: 'AA', 
              className: 'aa', 
              title: 'Enhanced (AA)', 
              desc: 'Standard compliance level.',
              tooltip: 'Priority AA addresses broader accessibility issues. Meeting these criteria improves usability for most users, including those with common disabilities. It’s key for general accessibility.'
            },
            { 
              key: 'AAA', 
              className: 'aaa', 
              title: 'Advanced (AAA)', 
              desc: 'Highest accessibility standard.',
              tooltip: 'Priority AAA ensures maximum accessibility for users with specific needs. It’s optional but ideal for the most inclusive experience.'
            },
          ] as const).map(item => (
            <div key={item.key} className={`compliance-card ${item.className}`}>
              <div className="left">
                <Chip variant={item.key === 'A' ? 'green' : item.key === 'AA' ? 'orange' : 'red'} size="medium">{item.key}</Chip>
                <div className="copy">
                  <div className="title">
                    {item.title}
                    <PurpleTooltip title={item.tooltip}>
                      <span className="tooltip-icon">?</span>
                    </PurpleTooltip>
                  </div>
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

      <Paper className="card wcag-info-card">
        <div className="wcag-header">
          <h3 className="wcag-title">What is WCAG?</h3>
          <div className="wcag-icon">♿</div>
        </div>
        <p className="wcag-description">
          WCAG accessibility ensures your site is usable by people with disabilities. It's important for creating an inclusive web where everyone can access content.
        </p>
        <div className="wcag-link">
          <a 
            href="https://www.w3.org/WAI/WCAG22/quickref/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="wcag-documentation-link"
          >
            View WCAG 2.2 Guidelines →
          </a>
        </div>
      </Paper>

      <WCAGExplanationCards />
    </Stack>
  );
};

export default ComplianceColumn;


