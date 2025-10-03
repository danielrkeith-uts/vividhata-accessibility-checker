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
        
        // Get the latest scan for this web page
        const scans = await scanService.getWebPageScans(webPageId);
        
        if (scans.length === 0) {
          setError('No scans found for this site');
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

  // Find the site matching the siteId
  const currentSite = userSites.find((site) => site.id === siteId);

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
  const totalIssues = scanData.issues.length;
  const complianceScore = Math.max(0, Math.min(100, 100 - totalIssues * 2));

  // Group issues by category for requirements table and breakdown
  const issuesByCategory: Record<string, number> = {};
  scanData.issues.forEach(issue => {
    const category = issue.issueType.split('_')[0] || 'Other';
    issuesByCategory[category] = (issuesByCategory[category] || 0) + 1;
  });
  const breakdown = [
    { label: 'Essential (A)', grade: 'A', passed: Math.max(0, Math.round(complianceScore * 0.72)), total: 100, color: '#22c55e' },
    { label: 'Enhanced (AA)', grade: 'AA', passed: Math.max(0, Math.round(complianceScore * 0.6)), total: 100, color: '#f59e0b' },
    { label: 'Advanced (AAA)', grade: 'AAA', passed: Math.max(0, Math.round(complianceScore * 0.3)), total: 100, color: '#ef4444' },
  ];

  const requirementsRows = Object.entries(issuesByCategory).map(([category, count], i) => ({
    id: i + 1,
    text: `Fix ${category.toLowerCase()} accessibility issues`,
    priority: count > 3 ? 'High' : count > 1 ? 'Medium' : 'Low',
    category,
  }));

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
  
        {/* Overview + Stats ring */}
        <div className={`dashboard-overview-row ${isExporting ? 'pdf-stack' : ''}`}>
          <div className="card" style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
            <div className="donut">
              <svg viewBox="0 0 36 36">
                <path className="bg" d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
                <path className="fg" strokeDasharray={`${complianceScore}, 100`} d="M18 2.0845
                  a 15.9155 15.9155 0 0 1 0 31.831
                  a 15.9155 15.9155 0 0 1 0 -31.831" />
                <text x="18" y="20.35" className="percent">{complianceScore}%</text>
              </svg>
              <div className="donut-sub">Compliant with WCAG</div>
            </div>
            <div style={{ flex: 1 }}>
              <div className="callout">You're on the right track! Keep improving.</div>
              <ul className="bullets">
                <li><b>{Math.round(complianceScore / 4)}</b> WCAG requirements met</li>
                <li><b>{Math.max(0, 100 - Math.round(complianceScore / 4))}</b> WCAG requirements not met</li>
                <li><b>{Math.max(0, 100 - complianceScore)}%</b> below industry standard</li>
                <li><b>3</b> quick wins to increase score by 20%</li>
              </ul>
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">Compliance Breakdown</h3>
            <div className="breakdown-list">
              {breakdown.map((b) => (
                <div key={b.grade} className="breakdown-item">
                  <div className="badge" style={{ background: b.color }}>{b.grade}</div>
                  <div className="breakdown-copy">
                    <div className="label">{b.label}</div>
                    <div className="muted">{b.passed}% passed</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="card">
            <h3 className="card-title">What is WCAG?</h3>
            <p className="muted">WCAG ensures your site is usable by people with disabilities. It creates an inclusive web where everyone can access content. Find out more.</p>
          </div>
        </div>

        {/* Requirements */}
        <div className={`dashboard-breakdown-tasks-row ${isExporting ? 'pdf-stack' : ''}`}>
          <div className="card" data-pdf-expand style={{ flex: 1, minWidth: 300 }}>
            <div className="requirements-header">
              <div className="title">Requirements</div>
            </div>
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
          </div>
        </div>
      </main>
    </div>
  );
};