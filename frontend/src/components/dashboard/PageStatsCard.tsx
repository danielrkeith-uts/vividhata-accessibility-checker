import React from 'react';
import { Stack, Paper } from '@mui/material';

type Props = {
  complianceScore: number;
  metCount: number;
  notMetCount: number;
  belowPercent: number;
};

export const PageStatsCard: React.FC<Props> = ({ complianceScore, metCount, notMetCount, belowPercent }) => {
  return (
    <Paper className="card page-stats">
      <Stack direction="row" spacing={2} alignItems="center" className="page-stats-content">
        <div className="donut">
          <svg viewBox="0 0 36 36">
            <path className="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className="fg" strokeDasharray={`${complianceScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="20.35" className="percent">{complianceScore}%</text>
          </svg>
          <div className="donut-sub">Compliant with WCAG</div>
        </div>
        <div className="indicators">
          <div className="indicator-bar good">
            <div className="count-badge">{metCount}</div>
            <div className="label">WCAG requirements met</div>
          </div>
          <div className="indicator-bar bad">
            <div className="count-badge">{notMetCount}</div>
            <div className="label">WCAG requirements not met</div>
          </div>
          <div className="indicator-bar warn">
            <div className="count-badge">{belowPercent}%</div>
            <div className="label">Below industry standard</div>
          </div>
          <div className="indicator-bar info">
            <div className="count-badge">3</div>
            <div className="label">Quick wins to increase score by 20%</div>
          </div>
        </div>
      </Stack>
    </Paper>
  );
};

export default PageStatsCard;


