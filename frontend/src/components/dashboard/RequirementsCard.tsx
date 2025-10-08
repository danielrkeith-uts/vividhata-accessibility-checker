import React, { useState } from 'react';
import { Paper } from '@mui/material';
import PurpleTooltip from '../common/PurpleTooltip';
import { Chip } from '../common/Chip';
import './RequirementsCard.css';

type Row = { 
  id: number; 
  text: string; 
  category: string; 
  level: 'A' | 'AA' | 'AAA'; 
  count: number;
  issues: { htmlSnippet: string; issueType: string }[];
};

type Props = {
  tab: 'requirements' | 'quickfixes';
  setTab: (t: 'requirements' | 'quickfixes') => void;
  requirementsRows: Row[];
  quickWins: { id: number; text: string; count: number; priority: 'High' | 'Medium' | 'Low'; issueTypes: string[] }[];
};

export const RequirementsCard: React.FC<Props> = ({ tab, setTab, requirementsRows, quickWins }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRowExpansion = (rowId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  // Map current categories to WCAG principles
  const categoryToWCAG: Record<string, string> = {
    'Images': 'Perceivable',
    'Media': 'Perceivable', 
    'Semantic HTML': 'Perceivable',
    'Content Order': 'Perceivable',
    'Perceivable': 'Perceivable',
    'Typography': 'Perceivable',
    'Color Use': 'Perceivable',
    'Contrast': 'Perceivable',
    'Reflow & Zoom': 'Perceivable',
    'Keyboard': 'Operable',
    'Timing': 'Operable',
    'Focus': 'Operable',
    'Links': 'Operable',
    'Navigation': 'Operable',
    'Semantics': 'Understandable',
    'Other': 'Robust'
  };

  // Define tooltips for WCAG categories
  const wcagCategoryTooltips: Record<string, string> = {
    'Perceivable': 'Making content available to all senses.',
    'Operable': 'Ensuring users can interact with the content.',
    'Understandable': 'Ensuring content is easy to read and interact with.',
    'Robust': 'Ensuring content works across different platforms and devices.'
  };

  // Define tooltips for priority levels
  const priorityTooltips: Record<string, string> = {
    'A': 'WCAG Level A - Essential requirements that must be met for basic accessibility. Critical for users with disabilities.',
    'AA': 'WCAG Level AA - Standard compliance level required by most organizations. Important for general accessibility.',
    'AAA': 'WCAG Level AAA - Advanced accessibility standards. Optional but ideal for maximum inclusivity.'
  };

  // Calculate potential impact percentage for a quick fix
  const calculateImpactPercentage = (quickWin: { count: number; priority: 'High' | 'Medium' | 'Low' }) => {
    const baseImpact = {
      'High': 15,    // High priority fixes can improve score by ~15%
      'Medium': 8,   // Medium priority fixes can improve score by ~8%
      'Low': 3       // Low priority fixes can improve score by ~3%
    };
    
    // Scale based on count (more instances = higher impact)
    const countMultiplier = Math.min(quickWin.count / 5, 2); // Cap at 2x multiplier
    return Math.round(baseImpact[quickWin.priority] * countMultiplier);
  };

  // Get unique categories and priorities for filtering
  const uniqueCategories = ['All', ...Array.from(new Set(requirementsRows.map(r => categoryToWCAG[r.category] || 'Robust')))];
  const uniquePriorities = ['All', 'A', 'AA', 'AAA'];

  // Filter requirements based on selected filters
  const filteredRequirements = requirementsRows.filter(row => {
    const wcagCategory = categoryToWCAG[row.category] || 'Robust';
    const categoryMatch = selectedCategory === 'All' || wcagCategory === selectedCategory;
    const priorityMatch = selectedPriority === 'All' || row.level === selectedPriority;
    return categoryMatch && priorityMatch;
  });

  return (
    <Paper className="card" data-pdf-expand>
      <div className="requirements-header">
        <div className="title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span>Requirements</span>
          <PurpleTooltip title="These are accessibility requirements that haven't been fully implemented yet. Addressing them will improve the user experience and help ensure your content is accessible to all users.">
            <span style={{ cursor: 'help', color: '#6b21a8', fontWeight: 700 }}>?</span>
          </PurpleTooltip>
        </div>
        
        {/* Tabs and filters in the same row */}
        <div className="tabs-filters-row">
          <div className="tabs">
            <Chip 
              variant={tab === 'requirements' ? 'purple' : 'default'}
              size="small"
              style={{ cursor: 'pointer' }}
              onClick={() => setTab('requirements')}
            >
              Requirements
            </Chip>
            <Chip 
              variant={tab === 'quickfixes' ? 'blue' : 'default'}
              size="small"
              style={{ cursor: 'pointer' }}
              onClick={() => setTab('quickfixes')}
            >
              Suggested Fixes
            </Chip>
          </div>
          
          {/* Filter dropdowns */}
          {tab === 'requirements' && (
            <div className="filters">
              <Chip
                variant="purple"
                size="small"
                isFilter={true}
                filterOptions={uniqueCategories}
                selectedValue={selectedCategory}
                onValueChange={setSelectedCategory}
              >
                Category: {selectedCategory}
              </Chip>
              <Chip
                variant="blue"
                size="small"
                isFilter={true}
                filterOptions={uniquePriorities}
                selectedValue={selectedPriority}
                onValueChange={setSelectedPriority}
              >
                Priority: {selectedPriority}
              </Chip>
            </div>
          )}
        </div>
        
      </div>
      {tab === 'requirements' ? (
        <div className="requirements-table" data-pdf-expand>
          <div className="table-head">
            <div>Requirement</div>
            <div>Category</div>
            <div>Priority</div>
            <div>Count</div>
          </div>
          {filteredRequirements.map((r) => {
            const wcagCategory = categoryToWCAG[r.category] || 'Robust';
            const isExpanded = expandedRows.has(r.id);
            
            return (
              <div key={r.id}>
                <div className="table-row" style={{ cursor: 'pointer' }} onClick={() => toggleRowExpansion(r.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '14px' }}>{isExpanded ? '▼' : '▶'}</span>
                    <span>{r.text}</span>
                  </div>
                  <div>
                    <PurpleTooltip title={wcagCategoryTooltips[wcagCategory]} placement="top" arrow>
                      <div>
                        <Chip variant={
                          wcagCategory === 'Perceivable' ? 'purple' :
                          wcagCategory === 'Operable' ? 'blue' :
                          wcagCategory === 'Understandable' ? 'orange' : 'gray'
                        }>
                          {wcagCategory}
                        </Chip>
                      </div>
                    </PurpleTooltip>
                  </div>
                  <div>
                    <PurpleTooltip title={priorityTooltips[r.level]} placement="top" arrow>
                      <div>
                        <Chip variant={r.level === 'A' ? 'green' : r.level === 'AA' ? 'orange' : 'red'}>
                          Level {r.level}
                        </Chip>
                      </div>
                    </PurpleTooltip>
                  </div>
                  <div>
                    <PurpleTooltip 
                      title={`${r.count} violation${r.count !== 1 ? 's' : ''} of WCAG ${r.level} guideline "${r.text.replace('WCAG ', '').split(' ').slice(1).join(' ')}" found in your page`} 
                      placement="top" 
                      arrow
                    >
                      <div>
                        <Chip variant="blue">{r.count} violation{r.count !== 1 ? 's' : ''}</Chip>
                      </div>
                    </PurpleTooltip>
                  </div>
                </div>
                {isExpanded && (
                  <div className="expanded-content">
                    <div style={{ marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)' }}>
                      Found {r.count} violation{r.count !== 1 ? 's' : ''}:
                    </div>
                    {r.issues.map((issue, idx) => (
                      <div key={idx} className="violation-item">
                        <div className="violation-header">
                          Violation #{idx + 1} - {issue.issueType}
                        </div>
                        <div className="code-block">
                          <pre>{issue.htmlSnippet}</pre>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      ) : (
        <div className="suggested-fixes" data-pdf-expand>
          <div className="disclaimer">
          Suggested fixes are recommendations based on WCAG guidelines. While they can improve accessibility, <b>be sure to test and review changes</b> to ensure they meet your specific needs and the needs of your users.          </div>
          {quickWins.length === 0 ? (
            <div className="muted" style={{ padding: '8px 12px' }}>No quick fixes detected. Great job!</div>
          ) : (
            quickWins.map((q) => {
              const impactPercentage = calculateImpactPercentage(q);
              const isQuickWin = q.priority === 'High' && q.count >= 3;
              
              return (
                <div className="table-row" key={q.id} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '8px', padding: '10px 12px', borderTop: '1px solid var(--panel-border)' }}>
                  <div style={{ textAlign: 'left' }}>{q.text}</div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {isQuickWin ? (
                      <PurpleTooltip title="This is a high-impact fix that affects multiple issues and can significantly improve your accessibility score." placement="top" arrow>
                        <div>
                          <Chip variant="green">Quick Win</Chip>
                        </div>
                      </PurpleTooltip>
                    ) : (
                      <PurpleTooltip title={`Implementing this fix could improve your accessibility score by approximately ${impactPercentage}%.`} placement="top" arrow>
                        <div>
                          <Chip variant="blue">+{impactPercentage}%</Chip>
                        </div>
                      </PurpleTooltip>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      )}
    </Paper>
  );
};

export default RequirementsCard;