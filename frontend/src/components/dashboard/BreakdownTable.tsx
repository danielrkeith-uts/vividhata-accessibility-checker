import React, { useState } from 'react';
import './BreakdownTable.css';
import { Select, MenuItem, FormControl, InputLabel } from '@mui/material';

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
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');

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
    return '●'; 
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 70) return 'High';
    if (severity >= 40) return 'Medium';
    return 'Low';
  };

  const filteredRequirements = requirements.filter(req => {
    const categoryMatch = selectedCategory === 'All' || req.category === selectedCategory;
    const statusMatch = selectedStatus === 'All' || req.status === selectedStatus;
    const severityLabel = getSeverityLabel(req.severity);
    const severityMatch = selectedSeverity === 'All' || severityLabel === selectedSeverity;
    return categoryMatch && statusMatch && severityMatch;
  });

  const categories = ['Perceivable', 'Operable', 'Understandable', 'Robust'];

  return (
    <div className="breakdown-table">
      <div className="table-header">
        <h3>Breakdown</h3>
        <div className="table-filters">
          {/* Category Filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 140, marginRight: 1 }} className="custom-filter">
            <InputLabel>Category</InputLabel>
            <Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              label="Category"
            >
              <MenuItem value="All">All</MenuItem>
              {categories.map(cat => (
                <MenuItem key={cat} value={cat}>{cat}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Status Filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 140, marginRight: 1 }} className="custom-filter">
            <InputLabel>Status</InputLabel>
            <Select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              label="Status"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="Compliant">Compliant</MenuItem>
              <MenuItem value="At Risk">At Risk</MenuItem>
              <MenuItem value="Noncompliant">Noncompliant</MenuItem>
            </Select>
          </FormControl>

          {/* Severity Filter */}
          <FormControl variant="outlined" size="small" sx={{ minWidth: 140 }} className="custom-filter">
            <InputLabel>Severity</InputLabel>
            <Select
              value={selectedSeverity}
              onChange={(e) => setSelectedSeverity(e.target.value)}
              label="Severity"
            >
              <MenuItem value="All">All</MenuItem>
              <MenuItem value="High">High</MenuItem>
              <MenuItem value="Medium">Medium</MenuItem>
              <MenuItem value="Low">Low</MenuItem>
            </Select>
          </FormControl>
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
            {filteredRequirements.map((requirement) => (
              <tr key={requirement.id}>
                <td className="requirement-description">{requirement.description}</td>
                <td className="requirement-category">{requirement.category}</td>
                <td className="requirement-status">
                  <span
                    className="status-indicator"
                    style={{ color: getStatusColor(requirement.status), marginRight: '6px' }}
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
                        backgroundColor: getStatusColor(requirement.status),
                      }}
                    ></div>
                  </div>
                  <span className="severity-text">{requirement.severity}%</span>
                </td>
              </tr>
            ))}
            {filteredRequirements.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>
                  No requirements match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
