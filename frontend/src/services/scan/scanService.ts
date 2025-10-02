// Scan service for handling accessibility scans
import { apiService, Scan, WebPage, Issue, Link } from '../api/apiService';

export interface ScanResult {
  scan: Scan;  
  siteId: string;
  url: string;
  links?: Link[];
}

class ScanService {
  async scanUrl(url: string): Promise<ScanResult> {
    try {
      const resp = await apiService.scanFromUrl(url); // { scan, issues, links }

      const mergedScan: Scan = {
        ...resp.scan,
        issues: resp.issues ?? [],
      };

      // siteId fallback
      const siteId = (resp.scan.webPageId ?? resp.scan.id).toString();

      return {
        scan: mergedScan,
        siteId,
        url,
        links: resp.links,
      };
    } catch (error) {
      console.error('Error scanning URL:', error);
      throw new Error(
        `Failed to scan URL: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get all web pages for the current user
  async getWebPages(): Promise<WebPage[]> {
    try {
      return await apiService.getWebPages();
    } catch (error) {
      console.error('Error fetching web pages:', error);
      throw new Error(
        `Failed to fetch web pages: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get scans for a specific web page
  async getWebPageScans(webPageId: number): Promise<Scan[]> {
    try {
      return await apiService.getWebPageScans(webPageId);
    } catch (error) {
      console.error('Error fetching web page scans:', error);
      throw new Error(
        `Failed to fetch scans: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get issues for a specific scan
  async getScanIssues(scanId: number): Promise<Issue[]> {
    try {
      return await apiService.getScanIssues(scanId);
    } catch (error) {
      console.error('Error fetching scan issues:', error);
      throw new Error(
        `Failed to fetch scan issues: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Get links for a specific scan
  async getScanLinks(scanId: number): Promise<Link[]> {
    try {
      return await apiService.getScanLinks(scanId);
    } catch (error) {
      console.error('Error fetching scan links:', error);
      throw new Error(
        `Failed to fetch scan links: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // format scan results for display
  formatScanResults(scan: Scan) {
    const totalIssues = scan.issues.length;
    const criticalIssues = scan.issues.filter(issue => 
      issue.issueType.toLowerCase().includes('critical') || 
      issue.issueType.toLowerCase().includes('error')
    ).length;
    const warnings = scan.issues.filter(issue => 
      issue.issueType.toLowerCase().includes('warning')
    ).length;
    const info = scan.issues.filter(issue => 
      issue.issueType.toLowerCase().includes('info') ||
      issue.issueType.toLowerCase().includes('suggestion')
    ).length;

    return {
      totalIssues,
      criticalIssues,
      warnings,
      info,
      issues: scan.issues,
      scanTime: new Date(scan.timeScanned),
    };
  }
}

export const scanService = new ScanService();
