import React from 'react';
import { Visibility, Gamepad, Psychology, Build } from '@mui/icons-material';
import './WCAGExplanationCards.css';

export const WCAGExplanationCards: React.FC = () => {
  const wcagPrinciples = [
    {
      id: 'perceivable',
      title: 'Perceivable',
      icon: <Visibility />,
      description: 'Content must be presentable to all senses.',
      color: '#3B82F6'
    },
    {
      id: 'operable',
      title: 'Operable',
      icon: <Gamepad />,
      description: 'UI must be operable by all users.',
      color: '#10B981'
    },
    {
      id: 'understandable',
      title: 'Understandable',
      icon: <Psychology />,
      description: 'Content must be understandable.',
      color: '#F59E0B'
    },
    {
      id: 'robust',
      title: 'Robust',
      icon: <Build />,
      description: 'Content must work with assistive tech.',
      color: '#EF4444'
    }
  ];

  return (
    <div className="wcag-explanation-cards">
      <div className="wcag-cards-grid">
        {wcagPrinciples.map((principle) => (
          <div key={principle.id} className="wcag-card" style={{ '--card-color': principle.color } as React.CSSProperties}>
            <div className="wcag-card-header">
              <div className="wcag-icon">{principle.icon}</div>
              <h4 className="wcag-title">{principle.title}</h4>
            </div>
            <p className="wcag-description">{principle.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WCAGExplanationCards;
