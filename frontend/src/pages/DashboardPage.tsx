import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { GlobalHeader } from "../components/common/GlobalHeader";
import { Scan } from "../services/api/apiService";
import { scanService } from "../services/scan/scanService";
import "./DashboardPage.css";
import { Button } from "../components/common/Button";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import PurpleTooltip from "../components/common/PurpleTooltip";
import PageStatsCard from '../components/dashboard/PageStatsCard';
import ComplianceColumn from '../components/dashboard/ComplianceColumn';
import RequirementsCard from '../components/dashboard/RequirementsCard';

export const DashboardPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const navigate = useNavigate();
  const { user, userSites, isAuthenticated } = useAuth();
  const [scanData, setScanData] = useState<Scan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [pdfMode, setPdfMode] = useState(false);
  const [isRescanning, setIsRescanning] = useState(false);
  const [rescanComplete, setRescanComplete] = useState(false);
  const currentSite = userSites.find((site) => site.id === siteId);
  const [requirementsTab, setRequirementsTab] = useState<'requirements' | 'quickfixes'>('requirements');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!isAuthenticated) {
          setError('Please log in to view dashboard');
          return;
        }
        
        if (!siteId) {
          setError('No site ID provided');
          return;
        }
        
        const webPageId = parseInt(siteId);
        if (isNaN(webPageId)) {
          setError('Invalid site ID');
          return;
        }
        
        if (!currentSite) {
          setError('Site not found');
          return;
        }
        
        const scans = await scanService.getWebPageScans(webPageId);
        
        if (scans.length === 0) {
          const fresh = await scanService.scanUrl(currentSite.url);
          setScanData(fresh.scan);
          return;
        }
        
        const latestScan = scans.sort((a, b) => 
          new Date(b.timeScanned).getTime() - new Date(a.timeScanned).getTime()
        )[0];
        
        const issues = await scanService.getScanIssues(latestScan.id);
        
        const scanWithIssues: Scan = {
          ...latestScan,
          issues: issues
        };
        
        setScanData(scanWithIssues);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    if (siteId) {
      loadDashboardData();
    }
  }, [siteId]);

  if (!siteId) {
    return <Navigate to="/manage-sites" replace />;
  }

  if (!currentSite) {
    return <Navigate to="/manage-sites" replace />;
  }

  const websiteUrl = currentSite.url;

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <GlobalHeader />
        <main className="dashboard-main">
          <div className="dashboard-two-col">
            <div className="left-column">
              {/* Page Stats Card Skeleton */}
              <div className="card skeleton-card">
                <div className="skeleton-content">
                  <div className="skeleton-donut"></div>
                  <div className="skeleton-indicators">
                    <div className="skeleton-indicator"></div>
                    <div className="skeleton-indicator"></div>
                    <div className="skeleton-indicator"></div>
                    <div className="skeleton-indicator"></div>
                  </div>
                </div>
              </div>
              
              {/* Requirements Card Skeleton */}
              <div className="card skeleton-card">
                <div className="skeleton-header">
                  <div className="skeleton-title"></div>
                  <div className="skeleton-tabs">
                    <div className="skeleton-tab"></div>
                    <div className="skeleton-tab"></div>
                  </div>
                </div>
                <div className="skeleton-table">
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row"></div>
                  <div className="skeleton-row"></div>
                </div>
              </div>
            </div>
            
            <div className="right-column">
              {/* Compliance Column Skeleton */}
              <div className="card skeleton-card">
                <div className="skeleton-title"></div>
                <div className="skeleton-compliance">
                  <div className="skeleton-compliance-item"></div>
                  <div className="skeleton-compliance-item"></div>
                  <div className="skeleton-compliance-item"></div>
                </div>
              </div>
              
              <div className="card skeleton-card">
                <div className="skeleton-title"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-text"></div>
                <div className="skeleton-link"></div>
              </div>
            </div>
        </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-page">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Error: {error}</h2>
          <Button onClick={() => window.location.reload()} variant="primary">
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!scanData) {
    return (
      <div className="dashboard-page">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>No data available</h2>
        </div>
      </div>
    );
  }

  // Transform scan data for dashboard
  const WCAG_MAP: Record<string, { id: string; name: string; level: 'A' | 'AA' | 'AAA'; principle: 'Perceivable' | 'Operable' | 'Understandable' | 'Robust' }> = {
    ELEMENT_TOO_SMALL_AAA: { id: '2.5.5', name: 'Target Size (Enhanced)', level: 'AAA', principle: 'Operable' },
    TEXT_CONTRAST_VIOLATION_AAA: { id: '1.4.6', name: 'Contrast (Enhanced)', level: 'AAA', principle: 'Perceivable' },
    ALT_TEXT_MISSING: { id: '1.1.1', name: 'Text Alternatives', level: 'A', principle: 'Perceivable' },
    ARIA_ROLE_MISSING_OR_INVALID: { id: '4.1.2', name: 'Valid ARIA Role', level: 'A', principle: 'Robust' },
    CAPTIONS_FOR_VIDEO_AUDIO_MISSING: { id: '1.2.2', name: 'Captions (Prerecorded)', level: 'A', principle: 'Perceivable' },
    CLEAR_PAGE_TITLES: { id: '2.4.2', name: 'Page Titled', level: 'A', principle: 'Operable' },
    COMPONENTS_NOT_CONSISTENT: { id: '3.2.4', name: 'Consistent Components', level: 'AA', principle: 'Understandable' },
    CONTENT_MEANINGFUL_SEQUENCE_VIOLATION: { id: '1.3.2', name: 'Meaningful Sequence', level: 'A', principle: 'Perceivable' },
    LANGUAGE_NOT_DEFINED: { id: '3.1.1', name: 'Language of Page', level: 'A', principle: 'Understandable' },
    DESCRIPTIVE_LINK_TEXT: { id: '2.4.4', name: 'Link Purpose', level: 'A', principle: 'Operable' },
    NO_DRAG_AND_DROP_ALTERNATIVE: { id: '2.5.3', name: 'Label in Name', level: 'A', principle: 'Operable' },
    ERROR_SUGGESTION_NOT_PROVIDED: { id: '3.3.3', name: 'Error Suggestion', level: 'AA', principle: 'Understandable' },
    FOCUS_ORDER_LOGICAL: { id: '2.4.3', name: 'Focus Order', level: 'A', principle: 'Operable' },
    HELP_NOT_AVAILABLE: { id : '3.3.5', name: 'Help', level: 'AAA', principle: 'Understandable' },
    ELEMENT_TOO_SMALL: { id: '2.5.8', name: 'Target Size (Minimum', level: 'AA', principle: 'Operable' },
    KEYBOARD_OPERABLE: { id: '2.1.1', name: 'Keyboard', level: 'A', principle: 'Operable' },
    LABELS_OR_INSTRUCTIONS_UNCLEAR: { id: '3.3.2', name: 'Labels or Instructions', level: 'A', principle: 'Understandable' },
    LANGUAGE_CHANGE_NOT_MARKED: { id: '3.1.2', name: 'Language of Parts', level: 'AA', principle: 'Understandable' },
    LINE_HEIGHT_SPACING_VIOLATION: { id: '1.4.12', name: 'Text Spacing', level: 'AA', principle: 'Perceivable' },
    MULTIPLE_WAYS_TO_NAVIGATE: { id: '2.4.5', name: 'Multiple Ways', level: 'AA', principle: 'Operable' },
    NO_KEYBOARD_TRAPS: { id: '2.1.2', name: 'No Keyboard Trap', level: 'A', principle: 'Operable' },
    NO_SINGLE_SENSORY_CHARACTERISTIC: { id: '1.3.3', name: 'Sensory Characteristics', level: 'A', principle: 'Perceivable' },
    NOT_JUST_COLOR: { id: '1.4.1', name: 'Use of Color', level: 'A', principle: 'Perceivable' },
    REDUNDANT_ENTRY: { id: '3.3.7', name: 'Redundant Entry', level: 'A', principle: 'Understandable' },
    SEMANTIC_HTML_MISSING: { id: '1.3.1', name: 'Info and Relationships', level: 'A', principle: 'Perceivable' },
    STATUS_MESSAGE_MISSING: { id: '4.1.3', name: 'Status Messages', level: 'AA', principle: 'Robust' },
    TEXT_CONTRAST_VIOLATION: { id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA', principle: 'Perceivable' },
    TEXT_RESIZE_VIOLATION: { id: '1.4.4', name: 'Resize Text', level: 'AA', principle: 'Perceivable' },
    TIME_LIMITS: { id: '2.2.1', name: 'Timing Adjustable', level: 'A', principle: 'Operable' },
    INVALID_HTML: { id: '4.1.1', name: 'Parsing', level: 'A', principle: 'Robust' },
    FOCUS_NOT_VISIBLE: { id: '2.4.7', name: 'Focus Visible', level: 'AA', principle: 'Operable' },
    FOCUS_INDICATOR_HIDDEN: { id: '2.4.11', name: 'Focus Not Obscured (Minimum)', level: 'AA', principle: 'Operable' },
  };

  const totalIssues = scanData.issues.length;

  const ISSUE_CATEGORY_MAP: Record<string, { category: string; priority: 'High' | 'Medium' | 'Low'; quickFix: string }> = {
    ELEMENT_TOO_SMALL_AAA: { category: 'Touch Targets', priority: 'Low', quickFix: 'Increase interactive element sizes to at least 44x44 CSS pixels.' },
    TEXT_CONTRAST_VIOLATION_AAA: { category: 'Contrast', priority: 'Low', quickFix: 'Increase text/background contrast to meet AAA (7:1) standards.' },
    ALT_TEXT_MISSING: { category: 'Images', priority: 'High', quickFix: 'Add meaningful alt text to all non-decorative images.' },
    ARIA_ROLE_MISSING_OR_INVALID: { category: 'ARIA', priority: 'Medium', quickFix: 'Use valid ARIA roles and attributes to enhance accessibility.' },
    CAPTIONS_FOR_VIDEO_AUDIO_MISSING: { category: 'Media', priority: 'High', quickFix: 'Provide captions/subtitles for videos and transcripts for audio.' },
    CLEAR_PAGE_TITLES: { category: 'Semantics', priority: 'Low', quickFix: 'Set a clear, descriptive <title> for each page.' },
    COMPONENTS_NOT_CONSISTENT: { category: 'Consistency', priority: 'Medium', quickFix: 'Use consistent UI components and behaviors across the site.' },
    CONTENT_MEANINGFUL_SEQUENCE_VIOLATION: { category: 'Content Order', priority: 'Medium', quickFix: 'Ensure DOM reading order matches visual order.' },
    LANGUAGE_NOT_DEFINED: { category: 'Language', priority: 'Low', quickFix: 'Add lang="en" or appropriate language in the HTML' },
    DESCRIPTIVE_LINK_TEXT: { category: 'Links', priority: 'Medium', quickFix: 'Use descriptive link text that makes sense out of context.' },
    NO_DRAG_AND_DROP_ALTERNATIVE: { category: 'Drag & Drop', priority: 'Medium', quickFix: 'Provide alternative methods for drag-and-drop functionality.' },
    ERROR_SUGGESTION_NOT_PROVIDED: { category: 'Forms', priority: 'High', quickFix: 'Provide suggestions to fix input errors in forms.' },
    FOCUS_ORDER_LOGICAL: { category: 'Focus', priority: 'High', quickFix: 'Ensure focus order follows a logical, predictable sequence.' },
    HELP_NOT_AVAILABLE: { category: 'Help', priority: 'Low', quickFix: 'Provide help documentation or guidance for complex tasks.' },
    ELEMENT_TOO_SMALL: { category: 'Touch Targets', priority: 'High', quickFix: 'Increase interactive element sizes to at least 32x32 CSS pixels.' },
    KEYBOARD_OPERABLE: { category: 'Keyboard', priority: 'High', quickFix: 'Make all interactive elements operable via keyboard.' },
    LABELS_OR_INSTRUCTIONS_UNCLEAR : { category: 'Forms', priority: 'High', quickFix: 'Provide clear labels and instructions for form fields.' },
    LANGUAGE_CHANGE_NOT_MARKED: { category: 'Language', priority: 'Medium', quickFix: 'Mark any language changes in the content using lang attributes.' },
    LINE_HEIGHT_SPACING_VIOLATION: { category: 'Typography', priority: 'Low', quickFix: 'Increase line-height and spacing to recommended WCAG values.' },
    MULTIPLE_WAYS_TO_NAVIGATE: { category: 'Navigation', priority: 'Low', quickFix: 'Provide multiple ways to locate pages (search, sitemap, nav).' },
    NO_KEYBOARD_TRAPS: { category: 'Keyboard', priority: 'High', quickFix: 'Remove focus traps; ensure focus can move into and out of widgets.' },
    NO_SINGLE_SENSORY_CHARACTERISTIC: { category: 'Perceivable', priority: 'Low', quickFix: 'Do not rely on color/shape alone to convey information.' },
    NOT_JUST_COLOR: { category: 'Color Use', priority: 'Medium', quickFix: 'Provide non-color indicators like icons or text labels.' },
    REDUNDANT_ENTRY: { category: 'Forms', priority: 'Low', quickFix: 'Avoid asking users to enter the same information multiple times or use autofill.' },
    SEMANTIC_HTML_MISSING: { category: 'Semantic HTML', priority: 'Medium', quickFix: 'Use proper landmark and heading elements to structure content.' },
    STATUS_MESSAGE_MISSING: { category: 'Status Messages', priority: 'Medium', quickFix: 'Use ARIA live regions to announce dynamic content changes.' },
    TEXT_CONTRAST_VIOLATION: { category: 'Contrast', priority: 'High', quickFix: 'Increase text/background contrast to meet AA (4.5:1) or AAA.' },
    TEXT_RESIZE_VIOLATION: { category: 'Reflow & Zoom', priority: 'Medium', quickFix: 'Ensure text remains readable and functional at 200% zoom.' },
    TIME_LIMITS: { category: 'Timing', priority: 'Low', quickFix: 'Provide controls to turn off, adjust, or extend time limits.' },
    INVALID_HTML: { category: 'Code Quality', priority: 'Medium', quickFix: 'Fix unclosed tags and use semantic tags instead of general <div>' },
    FOCUS_NOT_VISIBLE: { category: 'Focus', priority: 'Medium', quickFix: 'Apply clear focus styles in CSS or custom focus indicators' },
    FOCUS_INDICATOR_HIDDEN: { category: 'Focus', priority: 'Low', quickFix: 'Fix overlapping content and ensure focus indicators are not obscured by other content.' },
  };

  type Priority = 'High' | 'Medium' | 'Low';
  const priorityRank: Record<Priority, number> = { High: 3, Medium: 2, Low: 1 };
  const categoryAgg: Record<string, { count: number; priority: Priority }> = {};
  const quickWinsAgg: Record<string, number> = {};
  scanData.issues.forEach((issue) => {
    const map = ISSUE_CATEGORY_MAP[issue.issueType] || { category: 'Other', priority: 'Low' as Priority, quickFix: 'Review this element for accessibility.' };
    if (!categoryAgg[map.category]) {
      categoryAgg[map.category] = { count: 0, priority: map.priority };
    }
    categoryAgg[map.category].count += 1;
    if (priorityRank[map.priority] > priorityRank[categoryAgg[map.category].priority]) {
      categoryAgg[map.category].priority = map.priority;
    }
    quickWinsAgg[map.quickFix] = (quickWinsAgg[map.quickFix] || 0) + 1;
  });

  const allCriteria = Object.keys(WCAG_MAP);
  const violatedTypes = new Set(scanData.issues.map(i => i.issueType));
  const totals = {
    A: allCriteria.filter(t => WCAG_MAP[t].level === 'A').length,
    AA: allCriteria.filter(t => WCAG_MAP[t].level === 'AA').length,
    AAA: allCriteria.filter(t => WCAG_MAP[t].level === 'AAA').length,
  };
  const violated = {
    A: Array.from(violatedTypes).filter(t => WCAG_MAP[t]?.level === 'A').length,
    AA: Array.from(violatedTypes).filter(t => WCAG_MAP[t]?.level === 'AA').length,
    AAA: Array.from(violatedTypes).filter(t => WCAG_MAP[t]?.level === 'AAA').length,
  };
  const passed = {
    A: Math.max(0, totals.A - violated.A),
    AA: Math.max(0, totals.AA - violated.AA),
    AAA: Math.max(0, totals.AAA - violated.AAA),
  };
  const pct = {
    A: totals.A ? Math.round((passed.A / totals.A) * 100) : 0,
    AA: totals.AA ? Math.round((passed.AA / totals.AA) * 100) : 0,
    AAA: totals.AAA ? Math.round((passed.AAA / totals.AAA) * 100) : 0,
  };

  const overallTotal = totals.A + totals.AA + totals.AAA;
  const overallPassed = passed.A + passed.AA + passed.AAA;
  const complianceScore = overallTotal ? Math.round((overallPassed / overallTotal) * 100) : 0;

  const wcagPriority: Record<'A' | 'AA' | 'AAA', Priority> = { A: 'High', AA: 'Medium', AAA: 'Low' };
  const violatedCounts: Record<string, number> = {};
  const violatedIssues: Record<string, any[]> = {};
  
  scanData.issues.forEach(i => { 
    violatedCounts[i.issueType] = (violatedCounts[i.issueType] || 0) + 1;
    if (!violatedIssues[i.issueType]) {
      violatedIssues[i.issueType] = [];
    }
    violatedIssues[i.issueType].push(i);
  });
  
  const requirementsRows = Object.entries(violatedCounts).map(([type, count], idx) => {
    const meta = WCAG_MAP[type] || { id: '—', name: type, level: 'A' as const, principle: 'Perceivable' as const };
    const issues = violatedIssues[type] || [];
    return {
      id: idx + 1,
      text: `WCAG ${meta.id} ${meta.name}`,
      priority: wcagPriority[meta.level],
      category: meta.principle,
      level: meta.level,
      count,
      issues: issues.map(issue => ({
        htmlSnippet: issue.htmlSnippet,
        issueType: issue.issueType
      }))
    };
  });

  const quickWins = Object.entries(quickWinsAgg)
    .sort((a, b) => b[1] - a[1])
    .map(([text, count], i) => {
      // Find the priority for this quick fix by looking at the issue types that generate it
      const issueTypes = Object.entries(ISSUE_CATEGORY_MAP)
        .filter(([_, map]) => map.quickFix === text)
        .map(([issueType, _]) => issueType);
      
      const priorities = issueTypes.map(issueType => ISSUE_CATEGORY_MAP[issueType]?.priority || 'Low');
      const highestPriority = priorities.reduce((highest, current) => 
        priorityRank[current as Priority] > priorityRank[highest as Priority] ? current : highest, 'Low' as Priority
      );
      
      return { 
        id: i + 1, 
        text, 
        count, 
        priority: highestPriority,
        issueTypes 
      };
    });

  const handleExportToPDF = async () => {
    setIsExporting(true);

    const overlay = document.createElement("div");
    overlay.className = "export-overlay";
    overlay.innerHTML = "<div class='spinner'></div><p>Generating Accessibility Report...</p>";
    document.body.appendChild(overlay);

    try {
      const pdf = new jsPDF({ orientation: "p", unit: "mm", format: "a4" });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 15;
      let yPosition = margin;

      // Helper function to add text with word wrapping
      const addText = (text: string, fontSize: number = 12, isBold: boolean = false) => {
        pdf.setFontSize(fontSize);
        pdf.setFont("helvetica", isBold ? "bold" : "normal");
        
        const lines = pdf.splitTextToSize(text, pageWidth - (margin * 2));
        const lineHeight = fontSize * 0.4;
        
        for (const line of lines) {
          if (yPosition + lineHeight > pageHeight - margin) {
            pdf.addPage();
            yPosition = margin;
          }
          pdf.text(line, margin, yPosition);
          yPosition += lineHeight;
        }
        yPosition += lineHeight * 0.5; // Add some spacing
      };

      // Helper function to add a new page if needed
      const checkNewPage = (requiredSpace: number = 10) => {
        if (yPosition + requiredSpace > pageHeight - margin) {
          pdf.addPage();
          yPosition = margin;
        }
      };

      // Report Header
      pdf.setFillColor(74, 85, 104);
      pdf.rect(0, 0, pageWidth, 25, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(20);
      pdf.setFont("helvetica", "bold");
      pdf.text("Accessibility Report", margin, 15);
      
      pdf.setFontSize(12);
      pdf.setFont("helvetica", "normal");
      pdf.text(`Website: ${websiteUrl}`, margin, 22);
      
      yPosition = 35;

      // Executive Summary
      pdf.setTextColor(0, 0, 0);
      addText("EXECUTIVE SUMMARY", 16, true);
      
      const totalIssues = scanData?.issues?.length || 0;
      const totalRequirements = requirementsRows.length;
      const violatedRequirements = requirementsRows.filter(r => r.count > 0).length;
      
      addText(`Overall Accessibility Score: ${complianceScore}%`, 14, true);
      addText(`Total Issues Found: ${totalIssues}`, 12);
      addText(`Requirements Violated: ${violatedRequirements} out of ${totalRequirements}`, 12);
      addText(`Scan Date: ${new Date().toLocaleDateString()}`, 12);

      // Compliance Breakdown
      checkNewPage(20);
      addText("COMPLIANCE BREAKDOWN", 16, true);
      
      const complianceData = [
        { level: "A", passed: passed.A, total: totals.A, color: [34, 197, 94] },
        { level: "AA", passed: passed.AA, total: totals.AA, color: [249, 115, 22] },
        { level: "AAA", passed: passed.AAA, total: totals.AAA, color: [239, 68, 68] }
      ];

      complianceData.forEach(({ level, passed, total, color }) => {
        const percentage = total > 0 ? Math.round((passed / total) * 100) : 100;
        addText(`Level ${level}: ${passed}/${total} requirements met (${percentage}%)`, 12);
      });

      // Detailed Violations Report
      checkNewPage(30);
      addText("DETAILED VIOLATIONS REPORT", 16, true);
      
      // Group violations by requirement
      const violationsByRequirement = requirementsRows
        .filter(r => r.count > 0)
        .sort((a, b) => b.count - a.count);

      violationsByRequirement.forEach((requirement, reqIndex) => {
        checkNewPage(25);
        
        // Requirement header
        addText(`${reqIndex + 1}. ${requirement.text}`, 14, true);
        addText(`Level: ${requirement.level} | Category: ${requirement.category}`, 10);
        addText(`Violations Found: ${requirement.count}`, 12, true);
        
        // List all violations for this requirement
        if (requirement.issues && requirement.issues.length > 0) {
          requirement.issues.forEach((issue, issueIndex) => {
            checkNewPage(15);
            addText(`Violation ${issueIndex + 1}: ${issue.issueType}`, 12, true);
            
            // Add code snippet (truncated for PDF)
            if (issue.htmlSnippet) {
              const maxSnippetLength = 2000; // 2KB limit for PDF
              const snippet = issue.htmlSnippet.length > maxSnippetLength 
                ? issue.htmlSnippet.substring(0, maxSnippetLength) + "... [truncated]"
                : issue.htmlSnippet;
              
              // Clean up snippet
              const cleanedSnippet = snippet
                .split('\n')
                .filter((line: string) => line.trim() !== '')
                .join('\n');
              
              addText("Code:", 10, true);
              pdf.setFont("courier", "normal");
              pdf.setFontSize(8);
              const codeLines: string[] = pdf.splitTextToSize(cleanedSnippet, pageWidth - (margin * 2));
              
              for (const line of codeLines) {
                checkNewPage(5);
                pdf.text(line, margin + 5, yPosition);
                yPosition += 3;
              }
              
              pdf.setFont("helvetica", "normal");
              pdf.setFontSize(12);
              yPosition += 5;
            }
          });
        }
        
        yPosition += 5; // Space between requirements
      });

      // Quick Wins Section
      if (quickWins.length > 0) {
        checkNewPage(30);
        addText("RECOMMENDED QUICK WINS", 16, true);
        
        quickWins.forEach((quickWin, index) => {
          checkNewPage(15);
          addText(`${index + 1}. ${quickWin.text}`, 12, true);
          addText(`Priority: ${quickWin.priority} | Affects ${quickWin.count} issues`, 10);
        });
      }

      // Footer
      const totalPages = pdf.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setFontSize(8);
        pdf.setTextColor(128, 128, 128);
        pdf.text(`Page ${i} of ${totalPages}`, pageWidth - 30, pageHeight - 5);
        pdf.text(`Generated by Vividhata Accessibility Checker`, margin, pageHeight - 5);
      }

      // Save the PDF
      const safe = websiteUrl.replace(/[^a-zA-Z0-9]/g, '-');
      const dateStr = new Date().toISOString().split('T')[0];
      pdf.save(`${safe}-accessibility-report-${dateStr}.pdf`);

    } catch (err) {
      console.error("Export to PDF failed:", err);
      alert("Sorry, something went wrong while generating the accessibility report.");
    } finally {
      setIsExporting(false);
      document.body.removeChild(overlay);
    }
  };

  const handleRescan = async () => {
    if (!currentSite) return;
    
    setIsRescanning(true);
    setRescanComplete(false);
    setError(null);
    
    const overlay = document.createElement("div");
    overlay.className = "export-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.backgroundColor = "rgba(0, 0, 0, 0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = "9999";
    document.body.appendChild(overlay);
    
    const loadingDiv = document.createElement("div");
    loadingDiv.style.backgroundColor = "white";
    loadingDiv.style.padding = "2rem";
    loadingDiv.style.borderRadius = "8px";
    loadingDiv.style.textAlign = "center";
    loadingDiv.innerHTML = `
      <div style="font-size: 1.2rem; margin-bottom: 1rem;">Rescanning Website...</div>
      <div style="color: #666;">Please wait while we analyze the accessibility of your site</div>
    `;
    overlay.appendChild(loadingDiv);
    
    try {
      const scanResult = await scanService.scanUrl(currentSite.url);
      setScanData(scanResult.scan);
      
      const updatedSite = {
        ...currentSite,
        lastScanned: scanResult.scan.timeScanned,
        scanData: scanResult.scan,
      };
      
      loadingDiv.innerHTML = `
        <div style="font-size: 1.2rem; margin-bottom: 1rem; color: #22c55e;">✓ Re-scan Complete!</div>
        <div style="color: #666;">Your website has been successfully re-analyzed</div>
      `;
      
      setTimeout(() => {
        document.querySelector(".export-overlay")?.remove();
      }, 2000);
      
    } catch (err) {
      console.error('Error during rescan:', err);
      setError(err instanceof Error ? err.message : 'Failed to rescan. Please try again.');
      
      loadingDiv.innerHTML = `
        <div style="font-size: 1.2rem; margin-bottom: 1rem; color: #ef4444;">✗ Rescan Failed</div>
        <div style="color: #666;">${err instanceof Error ? err.message : 'Failed to rescan. Please try again.'}</div>
      `;
      
      setTimeout(() => {
        document.querySelector(".export-overlay")?.remove();
      }, 3000);
    } finally {
      setIsRescanning(false);
    }
  };

  const handleScanNewSite = () => {
    navigate('/enter-url');
  };

  return (
    <div className={`dashboard-page ${isExporting ? 'pdf-mode' : ''}`} ref={pdfRef}>
      {!isExporting && (
        <GlobalHeader
          siteUrl={currentSite?.url}
          onRescan={handleRescan}
          onExportPDF={handleExportToPDF}
          onScanNewSite={handleScanNewSite}
          isRescanning={isRescanning}
          isExporting={isExporting}
          showLogoText={false}
          showDashboardActions={true}
        />
      )}
  
      {isExporting && (
        <div className="pdf-title">
          <h1>Accessibility Report for {currentSite.name}</h1>
          <p>{websiteUrl}</p>
        </div>
      )}
  
      <main id="main" className="dashboard-main" role="main" aria-label="Dashboard main content">
        <div className={`dashboard-two-col ${isExporting ? 'pdf-stack' : ''}`}>
          <div className="left-column">
            <PageStatsCard
              complianceScore={complianceScore}
              metCount={passed.A + passed.AA + passed.AAA}
              notMetCount={(totals.A + totals.AA + totals.AAA) - (passed.A + passed.AA + passed.AAA)}
              belowPercent={Math.max(0, 100 - complianceScore)}
            />
            <RequirementsCard
              tab={requirementsTab}
              setTab={setRequirementsTab}
              requirementsRows={requirementsRows}
              quickWins={quickWins}
              isExporting={isExporting}
            />
          </div>
          <ComplianceColumn pct={pct} passed={passed} totals={totals} />
        </div>
      </main>
    </div>
  );
};