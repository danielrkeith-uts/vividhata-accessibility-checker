import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { OverviewCard } from "../components/dashboard/OverviewCard";
import { GaugeChart } from "../components/dashboard/GaugeChart";
import { BreakdownTable } from "../components/dashboard/BreakdownTable";
import { TaskList } from "../components/dashboard/TaskList";
import { UserDropDown } from "../components/common/UserDropDown";
import { PriorityChart } from "../components/dashboard/PriorityChart";
import { Scan } from "../services/api/apiService";
import "./DashboardPage.css";
import { Button } from "../components/common/Button";
import { useParams, Navigate } from "react-router-dom";

export const DashboardPage: React.FC = () => {
  const { siteId } = useParams<{ siteId: string }>();
  const { user, userSites } = useAuth();
  const [scanData, setScanData] = useState<Scan | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        if (!siteId) {
          setError('No site ID provided');
          return;
        }
        
        const webPageId = parseInt(siteId);
        if (isNaN(webPageId)) {
          setError('Invalid site ID');
          return;
        }
        
        // For now, we'll use mock data since we only have the scan endpoint
        // In a real implementation, you'd store scan data and retrieve it here
        const mockScanData: Scan = {
          id: webPageId,
          webPageId: webPageId,
          timeScanned: new Date().toISOString(),
          htmlContent: "",
          issues: [
            { id: 1, scanId: webPageId, issueType: "SAMPLE_ISSUE_1", htmlSnippet: "<sample>snippet</sample>" },
            { id: 2, scanId: webPageId, issueType: "SAMPLE_ISSUE_2", htmlSnippet: "<sample>snippet</sample>" }
          ]
        };
        setScanData(mockScanData);
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

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <h1 className="dashboard-title">Dashboard for {currentSite.name}</h1>
          <div className="dashboard-user-info">
          <UserDropDown />
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-row">
          <div className="dashboard-url-bar">
            <span className="dashboard-url-value">{websiteUrl}</span>
          </div>
          <div className="dashboard-rescan-button-container">
            <Button onClick={() => console.log("Rescan clicked")} variant="secondary">
              Rescan
            </Button>
            <Button onClick={() => console.log("Export to PDF clicked")} variant="outline">
              Export to PDF
            </Button>
          </div>
        </div>

        {/* Wrap OverviewCards, PriorityChart and GaugeChart */}
        <div className="dashboard-overview-row">
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

        {/* Breakdown and Tasks Row */}
        <div className="dashboard-breakdown-tasks-row">
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