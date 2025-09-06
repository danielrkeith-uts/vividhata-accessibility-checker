// User and Authentication Types
export interface User {
  id: string;
  username: string;
  firstName: string;
  lastName: string;
  email?: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  ocupation: '' | 'Developer' | 'Designer' | 'Manager' | 'QA' | 'Other';
  purpose: '' | 'Personal' | 'Business' | 'Education' | 'Other';
}

// Website and Scan Types
export interface Website {
  id: string;
  url: string;
  name: string;
  lastScanned?: Date;
  accessibilityScore?: number;
  totalViolations?: number;
}

export interface ScanRequest {
  url: string;
  scanOptions?: ScanOptions;
}

export interface ScanOptions {
  includeImages: boolean;
  includeVideos: boolean;
  includeForms: boolean;
  includeNavigation: boolean;
  includeSemantics: boolean;
  includeARIA: boolean;
  includeKeyboard: boolean;
  includeContrast: boolean;
  includeTextResize: boolean;
}

// Accessibility Violation Types
export interface AccessibilityViolation {
  id: string;
  type: ViolationType;
  severity: ViolationSeverity;
  description: string;
  wcagGuideline: string;
  element: string;
  location: string;
  suggestion: string;
  lineNumber?: number;
  columnNumber?: number;
}

export enum ViolationType {
  IMAGE_ALT_TEXT = 'IMAGE_ALT_TEXT',
  VIDEO_CAPTIONS = 'VIDEO_CAPTIONS',
  VIDEO_TRANSCRIPTS = 'VIDEO_TRANSCRIPTS',
  SEMANTIC_HTML = 'SEMANTIC_HTML',
  COLOR_CONTRAST = 'COLOR_CONTRAST',
  TEXT_RESIZE = 'TEXT_RESIZE',
  KEYBOARD_NAVIGATION = 'KEYBOARD_NAVIGATION',
  FOCUS_INDICATORS = 'FOCUS_INDICATORS',
  FORM_LABELS = 'FORM_LABELS',
  ARIA_ROLES = 'ARIA_ROLES',
  LANGUAGE_ATTRIBUTES = 'LANGUAGE_ATTRIBUTES',
  NAVIGATION_CONSISTENCY = 'NAVIGATION_CONSISTENCY',
  TIME_LIMITS = 'TIME_LIMITS',
  DRAG_AND_DROP = 'DRAG_AND_DROP',
  INTERACTIVE_ELEMENT_SIZE = 'INTERACTIVE_ELEMENT_SIZE'
}

export enum ViolationSeverity {
  CRITICAL = 'CRITICAL',
  HIGH = 'HIGH',
  MEDIUM = 'MEDIUM',
  LOW = 'LOW'
}

// Scan Results Types
export interface ScanResult {
  id: string;
  websiteId: string;
  scanDate: Date;
  status: ScanStatus;
  accessibilityScore: number;
  violations: AccessibilityViolation[];
  summary: ScanSummary;
  scanTime: number; // in milliseconds
}

export enum ScanStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED'
}

export interface ScanSummary {
  totalViolations: number;
  criticalViolations: number;
  highViolations: number;
  mediumViolations: number;
  lowViolations: number;
  passedChecks: number;
  totalChecks: number;
}

// Report Types
export interface AccessibilityReport {
  scanResult: ScanResult;
  website: Website;
  generatedDate: Date;
  recommendations: string[];
  complianceLevel: ComplianceLevel;
}

export enum ComplianceLevel {
  A = 'A',
  AA = 'AA',
  AAA = 'AAA',
  NON_COMPLIANT = 'NON_COMPLIANT'
}

// API Response Types
export interface ApiResponse<T> {
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
