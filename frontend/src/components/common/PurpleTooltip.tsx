import React from 'react';
import Tooltip, { tooltipClasses, TooltipProps } from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

const PurpleBase = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(() => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#5b21b6',
    color: '#ffffff',
    padding: '8px 10px',
    fontSize: '12px',
    borderRadius: 14,
    boxShadow: '0 6px 18px rgba(0,0,0,0.15)',
    zIndex: 999999999,
    textAlign: 'center'
  },
  [`& .${tooltipClasses.arrow}`]: {
    color: '#5b21b6'
  },
  [`& .${tooltipClasses.popper}`]: {
    zIndex: 999999999
  }
}));

export const PurpleTooltip: React.FC<TooltipProps> = (props) => {
  return <PurpleBase arrow enterDelay={300} {...props} />;
};

export default PurpleTooltip;


