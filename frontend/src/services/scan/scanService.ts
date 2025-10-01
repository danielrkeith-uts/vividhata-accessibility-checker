// Scan service for handling accessibility scans
import { apiService, Scan } from '../api/apiService';

export interface ScanResult {
  scan: Scan;  
  siteId: string;
  url: string;
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
      };
    } catch (error) {
      console.error('Error scanning URL:', error);
      throw new Error(
        `Failed to scan URL: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  // Helper method to format scan results for display
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
