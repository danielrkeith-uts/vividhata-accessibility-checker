import React from 'react';
import './BreakdownTable.css';

interface Requirement {
  id: string;
  description: string;
  category: string;
  status: 'Compliant' | 'At Risk' | 'Noncompliant';
  severity: number;
}

interface BreakdownTableProps {
  requirements: Requirement[];
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({ requirements }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant':
        return '#10b981';
      case 'At Risk':
        return '#f59e0b';
      case 'Noncompliant':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Compliant':
        return '●';
      case 'At Risk':
        return '●';
      case 'Noncompliant':
        return '●';
      default:
        return '○';
    }
  };

  return (
    <div className="breakdown-table">
      <div className="table-header">
        <h3>Breakdown</h3>
        <div className="table-filters">
          <select className="table-filter">
            <option>Category</option>
            <option>Perceivable</option>
            <option>Operable</option>
            <option>Understandable</option>
            <option>Robust</option>
          </select>
          <select className="table-filter">
            <option>Status</option>
            <option>Compliant</option>
            <option>At Risk</option>
            <option>Non Compliant</option>
          </select>
          <select className="table-filter">
            <option>Severity</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>
        </div>
      </div>
      
      <div className="table-container">
        <table className="breakdown-table-content">
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Category</th>
              <th>Status</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {requirements.map((requirement) => (
              <tr key={requirement.id}>
                <td className="requirement-description">
                  {requirement.description}
                </td>
                <td className="requirement-category">
                  {requirement.category}
                </td>
                <td className="requirement-status">
                  <span 
                    className="status-indicator"
                    style={{ color: getStatusColor(requirement.status) }}
                  >
                    {getStatusIcon(requirement.status)}
                  </span>
                  {requirement.status}
                </td>
                <td className="requirement-severity">
                  <div className="severity-bar">
                    <div 
                      className="severity-fill"
                      style={{ 
                        width: `${requirement.severity}%`,
                        backgroundColor: getStatusColor(requirement.status)
                      }}
                    ></div>
                  </div>
                  <span className="severity-text">{requirement.severity}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
