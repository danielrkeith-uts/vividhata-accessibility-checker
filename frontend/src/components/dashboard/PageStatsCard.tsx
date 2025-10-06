import React from 'react';
import { Stack, Paper } from '@mui/material';
import { Chip } from '../common/Chip';
import './PageStatsCard.css';

type Props = {
  complianceScore: number;
  metCount: number;
  notMetCount: number;
  belowPercent: number;
};

export const PageStatsCard: React.FC<Props> = ({ complianceScore, metCount, notMetCount, belowPercent }) => {
  const getScoreClass = (score: number) => {
    if (score >= 90) return 'score-excellent';
    if (score >= 70) return 'score-good';
    if (score >= 50) return 'score-fair';
    return 'score-poor';
  };

  return (
    <Paper className="card page-stats">
      <Stack direction="row" spacing={2} alignItems="center" className="page-stats-content">
        <div className="donut">
          <svg viewBox="0 0 36 36">
            <path className="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <path className={`fg ${getScoreClass(complianceScore)}`} strokeDasharray={`${complianceScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
            <text x="18" y="20.35" className="percent">{complianceScore}%</text>
          </svg>
          <div className="donut-sub">Compliant with WCAG</div>
        </div>
        <div className="indicators">
          <div className="indicator-bar good">
            <Chip variant="green" size="medium">{metCount}</Chip>
            <div className="label">WCAG requirements met</div>
          </div>
          <div className="indicator-bar bad">
            <Chip variant="red" size="medium">{notMetCount}</Chip>
            <div className="label">WCAG requirements not met</div>
          </div>
          <div className="indicator-bar warn">
            <Chip variant="orange" size="medium">{belowPercent}%</Chip>
            <div className="label">Below industry standard</div>
          </div>
          <div className="indicator-bar info">
            <Chip variant="blue" size="medium">3</Chip>
            <div className="label">Quick wins to increase score by 20%</div>
          </div>
        </div>
      </Stack>
    </Paper>
  );
};

export default PageStatsCard;


