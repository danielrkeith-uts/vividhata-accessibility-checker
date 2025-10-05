import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { UserDropDown } from "../components/common/UserDropDown";
import { Scan } from "../services/api/apiService";
import { scanService } from "../services/scan/scanService";
import "./DashboardPage.css";
import { Button } from "../components/common/Button";
import { useParams, Navigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export const DashboardPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const { user, userSites, isAuthenticated } = useAuth();
  const [scanData, setScanData] = useState<Scan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const pdfRef = useRef<HTMLDivElement>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [pdfMode, setPdfMode] = useState(false);
  const [isRescanning, setIsRescanning] = useState(false);
  const [rescanComplete, setRescanComplete] = useState(false);
  // Determine the current site (if any) early so effects can use it safely
  const currentSite = userSites.find((site) => site.id === siteId);
  const [requirementsTab, setRequirementsTab] = useState<'requirements' | 'quickfixes'>('requirements');

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if user is authenticated
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
        
        // Ensure the site exists before proceeding
        if (!currentSite) {
          setError('Site not found');
          return;
        }

        // Get the latest scan for this web page
        const scans = await scanService.getWebPageScans(webPageId);
        
        if (scans.length === 0) {
          // No scans yet for this site. Trigger a fresh scan using the site's URL.
          const fresh = await scanService.scanUrl(currentSite.url);
          setScanData(fresh.scan);
          return;
        }
        
        // Get the most recent scan
        const latestScan = scans.sort((a, b) => 
          new Date(b.timeScanned).getTime() - new Date(a.timeScanned).getTime()
        )[0];
        
        // Get the issues for this scan
        const issues = await scanService.getScanIssues(latestScan.id);
        
        // Combine scan data with issues
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

  // Redirect to /manage-sites if no siteId param
  if (!siteId) {
    return <Navigate to="/manage-sites" replace />;
  }

  // Redirect if siteId is invalid (not found)
  if (!currentSite) {
    return <Navigate to="/manage-sites" replace />;
  }

  const websiteUrl = currentSite.url;

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div style={{ padding: '2rem', textAlign: 'center' }}>
          <h2>Loading dashboard data...</h2>
        </div>
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
  // Define WCAG metadata per IssueType
  const WCAG_MAP: Record<string, { id: string; name: string; level: 'A' | 'AA' | 'AAA' }> = {
    ALT_TEXT_MISSING: { id: '1.1.1', name: 'Text Alternatives', level: 'A' },
    CAPTIONS_FOR_VIDEO_AUDIO_MISSING: { id: '1.2.2', name: 'Captions (Prerecorded)', level: 'A' },
    SEMANTIC_HTML_MISSING: { id: '1.3.1', name: 'Info and Relationships', level: 'A' },
    CONTENT_MEANINGFUL_SEQUENCE_VIOLATION: { id: '1.3.2', name: 'Meaningful Sequence', level: 'A' },
    NO_SINGLE_SENSORY_CHARACTERISTIC: { id: '1.3.3', name: 'Sensory Characteristics', level: 'A' },
    LINE_HEIGHT_SPACING_VIOLATION: { id: '1.4.12', name: 'Text Spacing', level: 'AA' },
    NOT_JUST_COLOR: { id: '1.4.1', name: 'Use of Color', level: 'A' },
    TEXT_CONTRAST_VIOLATION: { id: '1.4.3', name: 'Contrast (Minimum)', level: 'AA' },
    TEXT_RESIZE_VIOLATION: { id: '1.4.4', name: 'Resize Text', level: 'AA' },
    KEYBOARD_OPERABLE: { id: '2.1.1', name: 'Keyboard', level: 'A' },
    NO_KEYBOARD_TRAPS: { id: '2.1.2', name: 'No Keyboard Trap', level: 'A' },
    TIME_LIMITS: { id: '2.2.1', name: 'Timing Adjustable', level: 'A' },
    CLEAR_PAGE_TITLES: { id: '2.4.2', name: 'Page Titled', level: 'A' },
    FOCUS_ORDER_LOGICAL: { id: '2.4.3', name: 'Focus Order', level: 'A' },
    DESCRIPTIVE_LINK_TEXT: { id: '2.4.4', name: 'Link Purpose (In Context)', level: 'A' },
    MULTIPLE_WAYS_TO_NAVIGATE: { id: '2.4.5', name: 'Multiple Ways', level: 'AA' },
  };

  const totalIssues = scanData.issues.length;

  // Map IssueType -> friendly category, priority and quick-fix suggestion
  const ISSUE_CATEGORY_MAP: Record<string, { category: string; priority: 'High' | 'Medium' | 'Low'; quickFix: string }> = {
    ALT_TEXT_MISSING: { category: 'Images', priority: 'High', quickFix: 'Add meaningful alt text to all non-decorative images.' },
    CAPTIONS_FOR_VIDEO_AUDIO_MISSING: { category: 'Media', priority: 'High', quickFix: 'Provide captions/subtitles for videos and transcripts for audio.' },
    SEMANTIC_HTML_MISSING: { category: 'Semantic HTML', priority: 'Medium', quickFix: 'Use proper landmark and heading elements to structure content.' },
    CONTENT_MEANINGFUL_SEQUENCE_VIOLATION: { category: 'Content Order', priority: 'Medium', quickFix: 'Ensure DOM reading order matches visual order.' },
    NO_SINGLE_SENSORY_CHARACTERISTIC: { category: 'Perceivable', priority: 'Low', quickFix: 'Do not rely on color/shape alone to convey information.' },
    LINE_HEIGHT_SPACING_VIOLATION: { category: 'Typography', priority: 'Low', quickFix: 'Increase line-height and spacing to recommended WCAG values.' },
    NOT_JUST_COLOR: { category: 'Color Use', priority: 'Medium', quickFix: 'Provide non-color indicators like icons or text labels.' },
    TEXT_CONTRAST_VIOLATION: { category: 'Contrast', priority: 'High', quickFix: 'Increase text/background contrast to meet AA (4.5:1) or AAA.' },
    TEXT_RESIZE_VIOLATION: { category: 'Reflow & Zoom', priority: 'Medium', quickFix: 'Ensure text remains readable and functional at 200% zoom.' },
    KEYBOARD_OPERABLE: { category: 'Keyboard', priority: 'High', quickFix: 'Make all interactive elements operable via keyboard.' },
    NO_KEYBOARD_TRAPS: { category: 'Keyboard', priority: 'High', quickFix: 'Remove focus traps; ensure focus can move into and out of widgets.' },
    TIME_LIMITS: { category: 'Timing', priority: 'Low', quickFix: 'Provide controls to turn off, adjust, or extend time limits.' },
    CLEAR_PAGE_TITLES: { category: 'Semantics', priority: 'Low', quickFix: 'Set a clear, descriptive <title> for each page.' },
    FOCUS_ORDER_LOGICAL: { category: 'Focus', priority: 'High', quickFix: 'Ensure focus order follows a logical, predictable sequence.' },
    DESCRIPTIVE_LINK_TEXT: { category: 'Links', priority: 'Medium', quickFix: 'Use descriptive link text that makes sense out of context.' },
    MULTIPLE_WAYS_TO_NAVIGATE: { category: 'Navigation', priority: 'Low', quickFix: 'Provide multiple ways to locate pages (search, sitemap, nav).' },
  };

  // Aggregate by category for Requirements
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

  // Build WCAG compliance breakdown
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
  const breakdown = [
    { label: 'Essential (A)', grade: 'A', passed: Math.max(0, Math.round(complianceScore * 0.72)), total: 100, color: '#22c55e' },
    { label: 'Enhanced (AA)', grade: 'AA', passed: Math.max(0, Math.round(complianceScore * 0.6)), total: 100, color: '#f59e0b' },
    { label: 'Advanced (AAA)', grade: 'AAA', passed: Math.max(0, Math.round(complianceScore * 0.3)), total: 100, color: '#ef4444' },
  ];

  // Requirements table: list violated WCAG criteria with level-derived priority
  const wcagPriority: Record<'A' | 'AA' | 'AAA', Priority> = { A: 'High', AA: 'Medium', AAA: 'Low' };
  const violatedCounts: Record<string, number> = {};
  scanData.issues.forEach(i => { violatedCounts[i.issueType] = (violatedCounts[i.issueType] || 0) + 1; });
  const requirementsRows = Object.entries(violatedCounts).map(([type, count], idx) => {
    const meta = WCAG_MAP[type] || { id: '—', name: type, level: 'A' as const };
    return {
      id: idx + 1,
      text: `WCAG ${meta.id} ${meta.name}`,
      priority: wcagPriority[meta.level],
      category: meta.level,
      count,
    };
  });

  // Build quick wins list (sorted by frequency)
  const quickWins = Object.entries(quickWinsAgg)
    .sort((a, b) => b[1] - a[1])
    .map(([text, count], i) => ({ id: i + 1, text, count }));

//allow export to pdf
const handleExportToPDF = async () => {
  if (!pdfRef.current) return;

  const overlay = document.createElement("div");
  overlay.className = "export-overlay";
  overlay.innerHTML = "<div class='spinner'></div><p>Generating PDF...</p>";
  document.body.appendChild(overlay);

  try {
    const printable = document.createElement("div");
    printable.className = "pdf-root";
    document.body.appendChild(printable);

    const title = document.createElement("div");
    title.className = "pdf-title";
    title.innerHTML = `
      <h1>Accessibility Report for ${currentSite.name}</h1>
      <p>${websiteUrl}</p>
      <p style="font-size:11px;color:#777;margin-top:4px;">
        Generated on ${new Date().toLocaleDateString()}
      </p>
    `;
    printable.appendChild(title);

    const clone = pdfRef.current.cloneNode(true) as HTMLDivElement;

    // remove buttons etc.
    clone.querySelector(".dashboard-rescan-button-container")?.remove();

    // expand scrollable containers (TaskList, Breakdown)
    clone.querySelectorAll("[data-pdf-expand]").forEach((el) => {
      const e = el as HTMLElement;
      e.style.maxHeight = "none";
      e.style.overflow = "visible";
    });

    printable.appendChild(clone);

    await new Promise((r) => requestAnimationFrame(r));

    // PDF setup
    const pdf = new jsPDF({ orientation: "p", unit: "px", format: "a4" });
    const pageW = pdf.internal.pageSize.getWidth();
    const pageH = pdf.internal.pageSize.getHeight();
    const margin = 20;

    // capture blocks
    const blocks = Array.from(
      printable.querySelectorAll(
        ".pdf-title, .dashboard-overview-row, .dashboard-breakdown-tasks-row"
      )
    ) as HTMLElement[];

    let cursorY = margin;

    for (let i = 0; i < blocks.length; i++) {
      const block = blocks[i];
      block.style.width = `${printable.clientWidth}px`;

      const canvas = await html2canvas(block, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: printable.scrollWidth,
      });

      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);

      let imgW = (pageW - margin * 2) * 0.75;
      let imgH = (imgProps.height * imgW) / imgProps.width;

      if (imgH > pageH - margin * 2) {
        let y = 0;
        while (y < imgProps.height) {
          const sliceHeight = Math.min(
            imgProps.height - y,
            (pageH - margin * 2) * (imgProps.width / imgW)
          );

          const sliceCanvas = document.createElement("canvas");
          sliceCanvas.width = imgProps.width;
          sliceCanvas.height = sliceHeight;

          const ctx = sliceCanvas.getContext("2d");
          if (ctx) {
            ctx.drawImage(
              canvas,
              0,
              y,
              imgProps.width,
              sliceHeight,
              0,
              0,
              imgProps.width,
              sliceHeight
            );
          }

          const sliceData = sliceCanvas.toDataURL("image/png");
          const sliceH = (sliceHeight * imgW) / imgProps.width;

          if (cursorY + sliceH > pageH - margin) {
            pdf.addPage();
            cursorY = margin;
          }

          // center the image horizontally
          const x = margin + (pageW - margin * 2 - imgW) / 2;
          pdf.addImage(sliceData, "PNG", x, cursorY, imgW, sliceH);

          cursorY += sliceH + margin;
          y += sliceHeight;
        }
      } else {
        if (cursorY + imgH > pageH - margin) {
          pdf.addPage();
          cursorY = margin;
        }

        const x = margin + (pageW - margin * 2 - imgW) / 2;
        pdf.addImage(imgData, "PNG", x, cursorY, imgW, imgH);
        cursorY += imgH + margin;
      }
    }

    const safe = currentSite.name.replace(/[^\w\-]+/g, "_");
    const dateStr = new Date().toISOString().slice(0, 10);
    pdf.save(`${safe}-dashboard-${dateStr}.pdf`);
  } catch (err) {
    console.error("Export to PDF failed:", err);
    alert("Sorry, something went wrong while exporting the PDF.");
  } finally {
    document.querySelector(".export-overlay")?.remove();
    document.querySelector(".pdf-root")?.remove();
  }
};

// allow rescanning of the website
const handleRescan = async () => {
  if (!currentSite) return;
  
  setIsRescanning(true);
  setRescanComplete(false);
  setError(null);
  
  // Create full-screen loading overlay
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
    // Rescan the current site URL
    const scanResult = await scanService.scanUrl(currentSite.url);
    
    // Update the scan data
    setScanData(scanResult.scan);
    
    // Update the site in context with new scan data
    const updatedSite = {
      ...currentSite,
      lastScanned: scanResult.scan.timeScanned,
      scanData: scanResult.scan,
    };
    
    // Show completion message
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
    
    // Show error message
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

  return (
    <div className={`dashboard-page ${isExporting ? 'pdf-mode' : ''}`} ref={pdfRef}>
      {!isExporting && (
        <header className="dashboard-header">
          <div className="dashboard-header-content">
            <h1 className="dashboard-title">Dashboard for {currentSite.name}</h1>
            <div className="dashboard-user-info">
              <UserDropDown />
            </div>
          </div>
        </header>
      )}
  
      {isExporting && (
        <div className="pdf-title">
          <h1>Accessibility Report for {currentSite.name}</h1>
          <p>{websiteUrl}</p>
        </div>
      )}
  
      <main className="dashboard-main">
        <div className="dashboard-row">
          <div className="dashboard-url-bar">
            <span className="dashboard-url-value">{websiteUrl}</span>
          </div>
          {!isExporting && (
            <div className="dashboard-rescan-button-container">
              <Button 
                onClick={handleRescan} 
                variant={rescanComplete ? "primary" : "outline"} 
                disabled={isRescanning}
              >
                {isRescanning ? "Rescanning..." : rescanComplete ? "Re-scan Complete!" : "Rescan"}
              </Button>
              <Button onClick={handleExportToPDF} variant="outline" disabled={isExporting}>
                {isExporting ? "Exporting…" : "Export to PDF"}
              </Button>
            </div>
          )}
        </div>
  
        {/* Overview + Page Stats + Compliance Cards */}
        <div className={`dashboard-overview-row ${isExporting ? 'pdf-stack' : ''}`}>
          {/* Page Stats card with donut and indicators */}
          <div className="card page-stats">
            <div className="page-stats-content">
              <div className="donut">
                <svg viewBox="0 0 36 36">
                  <path className="bg" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="fg" strokeDasharray={`${complianceScore}, 100`} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <text x="18" y="20.35" className="percent">{complianceScore}%</text>
                </svg>
                <div className="donut-sub">Compliant with WCAG</div>
              </div>
              <div className="indicators">
                <div className="indicator success"><span className="kpi">{passed.A + passed.AA + passed.AAA}</span> WCAG requirements met</div>
                <div className="indicator warn"><span className="kpi">{(totals.A + totals.AA + totals.AAA) - (passed.A + passed.AA + passed.AAA)}</span> WCAG requirements not met</div>
                <div className="indicator info"><span className="kpi">{Math.max(0, 100 - complianceScore)}%</span> below industry standard</div>
                <div className="indicator quick"><span className="kpi">3</span> quick wins to increase score by 20%</div>
              </div>
            </div>
          </div>

          {/* Compliance Breakdown as three colored cards */}
          <div className="compliance-cards">
            <div className="compliance-card a">
              <div className="badge">A</div>
              <div className="title">Essential (A)</div>
              <div className="meta">{pct.A}% • {passed.A} out of {totals.A} passed</div>
            </div>
            <div className="compliance-card aa">
              <div className="badge">AA</div>
              <div className="title">Enhanced (AA)</div>
              <div className="meta">{pct.AA}% • {passed.AA} out of {totals.AA} passed</div>
            </div>
            <div className="compliance-card aaa">
              <div className="badge">AAA</div>
              <div className="title">Advanced (AAA)</div>
              <div className="meta">{pct.AAA}% • {passed.AAA} out of {totals.AAA} passed</div>
            </div>
          </div>
        </div>

        {/* Requirements */}
        <div className={`dashboard-breakdown-tasks-row ${isExporting ? 'pdf-stack' : ''}`}>
          <div className="card" data-pdf-expand style={{ flex: 1, minWidth: 300 }}>
            <div className="requirements-header">
              <div className="title">Requirements</div>
              <div className="tabs">
                <button className={`tab ${requirementsTab === 'requirements' ? 'tab-active' : ''}`} onClick={() => setRequirementsTab('requirements')}>Requirements</button>
                <button className={`tab ${requirementsTab === 'quickfixes' ? 'tab-active' : ''}`} onClick={() => setRequirementsTab('quickfixes')}>Suggested Fixes</button>
              </div>
            </div>
            {requirementsTab === 'requirements' ? (
              <div className="requirements-table" data-pdf-expand>
                <div className="table-head">
                  <div>Requirement</div>
                  <div>Priority</div>
                  <div>Category</div>
                </div>
                {requirementsRows.map((r) => (
                  <div className="table-row" key={r.id}>
                    <div>{r.text}</div>
                    <div><span className={`pill pill-${r.priority.toLowerCase()}`}>{r.priority}</span></div>
                    <div>{r.category}</div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="suggested-fixes" data-pdf-expand>
                {quickWins.length === 0 ? (
                  <div className="muted" style={{ padding: '8px 12px' }}>No quick fixes detected. Great job!</div>
                ) : (
                  quickWins.map((q) => (
                    <div className="table-row" key={q.id} style={{ display: 'grid', gridTemplateColumns: '1fr 80px', gap: '8px', padding: '10px 12px', borderTop: '1px solid var(--panel-border)' }}>
                      <div>{q.text}</div>
                      <div style={{ textAlign: 'right', color: 'var(--muted)' }}>x{q.count}</div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};