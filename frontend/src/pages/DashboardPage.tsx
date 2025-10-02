import React, { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { OverviewCard } from "../components/dashboard/OverviewCard";
import { GaugeChart } from "../components/dashboard/GaugeChart";
import { BreakdownTable } from "../components/dashboard/BreakdownTable";
import { TaskList } from "../components/dashboard/TaskList";
import { UserDropDown } from "../components/common/UserDropDown";
import { PriorityChart } from "../components/dashboard/PriorityChart";
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

  // Transform scan data for components
  const totalIssues = scanData.issues.length;
  const complianceScore = Math.max(0, 100 - (totalIssues * 10)); // Simple calculation

  const overviewData = {
    xAxis: [1, 2, 3, 4, 5], // Mock historical data
    yAxis: [complianceScore, complianceScore + 5, complianceScore - 2, complianceScore + 3, complianceScore],
    improvement: 5 // Mock improvement
  };

  const gaugeData = {
    score: complianceScore,
    totalRequirements: totalIssues + 10,
    compliantCount: Math.floor(complianceScore / 10),
    atRiskCount: Math.floor(totalIssues * 0.3),
    nonCompliantCount: Math.floor(totalIssues * 0.7)
  };

  // Group issues by category
  const issuesByCategory: Record<string, number> = {};
  scanData.issues.forEach(issue => {
    const category = issue.issueType.split('_')[0] || 'Other';
    issuesByCategory[category] = (issuesByCategory[category] || 0) + 1;
  });

  // Transform category data to match expected interface
  const categoryData = Object.entries(issuesByCategory).reduce((acc, [category, count]) => {
    acc[category] = {
      score: Math.max(0, 100 - count * 10),
      totalRequirements: count + 5,
      compliantCount: Math.floor(count * 0.3),
      atRiskCount: Math.floor(count * 0.3),
      nonCompliantCount: Math.floor(count * 0.4)
    };
    return acc;
  }, {} as Record<string, { score: number; totalRequirements: number; compliantCount: number; atRiskCount: number; nonCompliantCount: number }>);

  // Transform priority data to match expected interface
  const priorityData = [
    { level: 'AAA', value: Math.max(0, complianceScore - 10), color: '#60a5fa' },
    { level: 'A', value: Math.max(0, complianceScore - 5), color: '#8b5cf6' },
    { level: 'AA', value: complianceScore, color: '#f97316' }
  ];

  // Transform requirements data to match expected interface
  const requirementsData = Object.entries(issuesByCategory).map(([category, count], index) => ({
    id: (index + 1).toString(),
    description: `Fix ${category.toLowerCase()} accessibility issues`,
    category,
    status: count > 2 ? 'Noncompliant' as const : count > 1 ? 'At Risk' as const : 'Compliant' as const,
    severity: count > 2 ? 3 : count > 1 ? 2 : 1
  }));

  // Transform tasks data to match expected interface
  const tasksData = scanData.issues.map((issue, index) => ({
    id: (index + 1).toString(),
    title: `Fix ${issue.issueType.replace(/_/g, ' ').toLowerCase()}`,
    description: `Address accessibility issue: ${issue.issueType}`,
    priority: (index % 3 === 0 ? 'High' : index % 3 === 1 ? 'Medium' : 'Low') as 'High' | 'Medium' | 'Low',
    status: 'To Do' as const,
    category: issue.issueType.split('_')[0] || 'Other',
    completed: false,
    dueDate: new Date(Date.now() + (index + 1) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
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
  
        {/* Overview, Priority, Gauge */}
        <div className={`dashboard-overview-row ${isExporting ? 'pdf-stack' : ''}`}>
          <OverviewCard
            accessibilityXAxis={overviewData.xAxis}
            accessibilityYAxis={overviewData.yAxis}
            improvement={overviewData.improvement}
          />
          <PriorityChart priorityData={priorityData} />
          <GaugeChart
            score={gaugeData.score}
            totalRequirements={gaugeData.totalRequirements}
            compliantCount={gaugeData.compliantCount}
            atRiskCount={gaugeData.atRiskCount}
            nonCompliantCount={gaugeData.nonCompliantCount}
            categoryData={categoryData}
          />
        </div>
  
        {/* Breakdown and Tasks */}
        <div className={`dashboard-breakdown-tasks-row ${isExporting ? 'pdf-stack' : ''}`}>
          <div className="breakdown-section">
            <BreakdownTable requirements={requirementsData} />
          </div>
          <div className="tasks-section">
            <TaskList tasks={tasksData} />
          </div>
        </div>
      </main>
    </div>
  );
};