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
        `Failed to scan URL: Make sure the URL is valid and the website allows scanning.`
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

  // Delete a web page
  async deleteWebPage(webPageId: number): Promise<void> {
    try {
      const result = await apiService.deleteWebPage(webPageId);
      return result;
    } catch (error) {
      console.error('ScanService: Error deleting web page:', error);
      
      // Don't treat 500 errors as successful - they indicate real server problems
      // Only treat 404 errors as "already deleted"
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.status === 404) {
            return; // Don't throw error, treat as successful
          }
        } catch {
          // If we can't parse the error, check if it contains 404
          if (error.message.includes('404')) {
            return; // Don't throw error, treat as successful
          }
        }
      }
      
      // For other errors, provide specific feedback
      let errorMessage = 'Unknown error';
      if (error instanceof Error) {
        try {
          const errorData = JSON.parse(error.message);
          if (errorData.status === 401) {
            errorMessage = 'Authentication error: Please log in again';
          } else if (errorData.status === 404) {
            errorMessage = 'Web page not found';
          } else {
            errorMessage = error.message;
          }
        } catch {
          errorMessage = error.message;
        }
      }
      
      throw new Error(`Failed to delete web page: ${errorMessage}`);
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
