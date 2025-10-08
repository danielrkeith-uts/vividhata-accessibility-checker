import React, { useState } from 'react';
import { Paper } from '@mui/material';
import PurpleTooltip from '../common/PurpleTooltip';
import { Chip } from '../common/Chip';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';
import './RequirementsCard.css';
import { Lightbulb } from '@mui/icons-material';

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
  isExporting?: boolean;
};

export const RequirementsCard: React.FC<Props> = ({ tab, setTab, requirementsRows, quickWins, isExporting = false }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedPriority, setSelectedPriority] = useState<string>('All');
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [expandedCodeBlocks, setExpandedCodeBlocks] = useState<Set<string>>(new Set());

  const toggleRowExpansion = (rowId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(rowId)) {
      newExpanded.delete(rowId);
    } else {
      newExpanded.add(rowId);
    }
    setExpandedRows(newExpanded);
  };

  const toggleCodeBlockExpansion = (codeBlockId: string) => {
    const newExpanded = new Set(expandedCodeBlocks);
    if (newExpanded.has(codeBlockId)) {
      newExpanded.delete(codeBlockId);
    } else {
      newExpanded.add(codeBlockId);
    }
    setExpandedCodeBlocks(newExpanded);
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
                        <Chip 
                          variant={
                            wcagCategory === 'Perceivable' ? 'purple' :
                            wcagCategory === 'Operable' ? 'blue' :
                            wcagCategory === 'Understandable' ? 'orange' : 'gray'
                          }
                          style={{ height: '20px', minHeight: '20px', fontSize: '11px', padding: '0 12px' }}
                        >
                          {wcagCategory}
                        </Chip>
                      </div>
                    </PurpleTooltip>
              </div>
              <div>
                    <PurpleTooltip title={priorityTooltips[r.level]} placement="top" arrow>
                      <div>
                        <Chip 
                          variant={r.level === 'A' ? 'green' : r.level === 'AA' ? 'orange' : 'red'}
                          style={{ height: '20px', minHeight: '20px', fontSize: '11px', padding: '0 12px' }}
                        >
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
                        <Chip 
                          variant="blue"
                          style={{ height: '20px', minHeight: '20px', fontSize: '11px', padding: '0 12px' }}
                        >
                          {r.count} violation{r.count !== 1 ? 's' : ''}
                        </Chip>
                      </div>
                    </PurpleTooltip>
                  </div>
                </div>
                {isExpanded && (
                  <>
                    <div className="expanded-content">
                      <div style={{ marginBottom: '8px', fontWeight: '600', color: 'var(--text-primary)', textAlign: 'left' }}>
                        Found {r.count} violation{r.count !== 1 ? 's' : ''}:
                      </div>
                    {r.issues && r.issues.length > 0 ? (
                      <>
                        {!isExporting && r.issues.length > 10 && (
                          <div style={{ padding: '8px', background: '#f0f0f0', borderRadius: '4px', marginBottom: '8px', fontSize: '12px', color: '#666' }}>
                            Showing first 10 of {r.issues.length} violations. Large datasets are truncated for performance.
                            <br />
                             <strong><Lightbulb fontSize='small' sx={{ verticalAlign: 'top'}}/> Tip:</strong> Export to PDF to see all {r.issues.length} violations with complete details.
                          </div>
                        )}
                        {(isExporting ? r.issues : r.issues.slice(0, 10)).map((issue, idx) => {
                          try {
                            const codeBlockId = `${r.id}-${idx}`;
                            const isCodeExpanded = expandedCodeBlocks.has(codeBlockId);
                            
                            // Count lines in the snippet
                            const lineCount = issue.htmlSnippet ? issue.htmlSnippet.split('\n').length : 0;
                            const hasScrollableContent = lineCount > 3; // Expand for anything over 3 lines
                            
                            // Clean up the snippet - remove extra blank lines
                            const cleanedSnippet = issue.htmlSnippet 
                              ? issue.htmlSnippet
                                  .split('\n')
                                  .filter(line => line.trim() !== '') // Remove empty lines
                                  .join('\n')
                              : '';
                            
                            // Truncate very large snippets to prevent performance issues
                            const maxSnippetLength = isExporting ? 50000 : 5000; // 50KB limit for PDF, 5KB for web
                            const displaySnippet = cleanedSnippet && cleanedSnippet.length > maxSnippetLength 
                              ? cleanedSnippet.substring(0, maxSnippetLength) + '\n\n... [Content truncated for performance - ' + (cleanedSnippet.length - maxSnippetLength) + ' characters omitted]'
                              : cleanedSnippet;
                          
                          return (
                          <div key={idx} className="violation-item">
                            <div className="violation-header" style={{ textAlign: 'left', fontFamily: 'inherit', fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <span>Violation #{idx + 1} - {issue.issueType}</span>
                              {hasScrollableContent && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <Chip 
                                    variant="blue"
                                    onClick={() => toggleCodeBlockExpansion(codeBlockId)}
                                    style={{ cursor: 'pointer', fontSize: '10px', padding: '0 8px', height: '18px', minHeight: '18px' }}
                                  >
                                    {isCodeExpanded ? (
                                      <>
                                        <ArrowDropUpIcon style={{ fontSize: '12px', marginRight: '2px' }} />
                                        Collapse
                                      </>
                                    ) : (
                                      <>
                                        <ArrowDropDownIcon style={{ fontSize: '12px', marginRight: '2px' }} />
                                        Expand
                                      </>
                                    )}
                                  </Chip>
                                </div>
                              )}
                            </div>
                            <div className="code-block-container">
                              <div 
                                className={`code-block ${isCodeExpanded ? 'expanded' : ''}`} 
                                style={{ 
                                  textAlign: 'left', 
                                  fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, Courier New, monospace',
                                  maxHeight: isCodeExpanded ? 'none' : '100px'
                                }}
                              >
                                <pre style={{ textAlign: 'left', fontFamily: 'Monaco, Menlo, Ubuntu Mono, Consolas, Courier New, monospace', margin: 0, whiteSpace: 'pre-line' }}>
                                  {displaySnippet}
                                </pre>
                              </div>
                            </div>
                          </div>
                          );
                        } catch (error) {
                          console.error(`Error rendering violation ${idx} for requirement ${r.id}:`, error);
                          console.error('Issue data:', issue);
                          return (
                            <div key={idx} className="violation-item">
                              <div className="violation-header" style={{ textAlign: 'left', fontFamily: 'inherit', fontWeight: 'bold' }}>
                                Error rendering violation #{idx + 1} - {issue.issueType || 'Unknown'}
                              </div>
                              <div style={{ color: 'red', fontSize: '12px', padding: '8px' }}>
                                Error: {error instanceof Error ? error.message : 'Unknown error'}
                              </div>
                            </div>
                          );
                        }
                      })}
                      </>
                    ) : (
                      <div style={{ textAlign: 'left', fontFamily: 'inherit', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                        No specific violations found for this requirement.
                      </div>
                    )}
                    </div>
                  </>
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
                          <Chip 
                            variant="green"
                            style={{ height: '20px', minHeight: '20px', fontSize: '11px', padding: '0 12px' }}
                          >
                            Quick Win
                          </Chip>
                        </div>
                      </PurpleTooltip>
                    ) : (
                      <PurpleTooltip title={`Implementing this fix could improve your accessibility score by approximately ${impactPercentage}%.`} placement="top" arrow>
                        <div>
                          <Chip 
                            variant="blue"
                            style={{ height: '20px', minHeight: '20px', fontSize: '11px', padding: '0 12px' }}
                          >
                            +{impactPercentage}%
                          </Chip>
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