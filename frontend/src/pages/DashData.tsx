// Sample data - this will come from backend
export const overviewData = {
    yAxis: [65, 68, 72, 70, 75, 78, 72, 76, 80, 82, 79, 85, 88, 90, 87, 89, 92, 88, 91, 94, 96, 93, 95, 97, 98, 96, 97, 99, 98, 100],
    ranking: "You're in the top 20% of sites scanned this month",
    improvement: 25,
    xAxis: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]
  };

export const gaugeData = {
    score: 72,
    totalRequirements: 95,
    compliantCount: 26,
    atRiskCount: 35,
    nonCompliantCount: 35
  };

 export const categoryData = {
    Perceivable: { score: 85, totalRequirements: 40, compliantCount: 30, atRiskCount: 5, nonCompliantCount: 5 },
    Operable: { score: 70, totalRequirements: 35, compliantCount: 20, atRiskCount: 10, nonCompliantCount: 5 },
    Understandable: { score: 75, totalRequirements: 38, compliantCount: 25, atRiskCount: 8, nonCompliantCount: 5 },
    Robust: { score: 90, totalRequirements: 30, compliantCount: 28, atRiskCount: 1, nonCompliantCount: 1 },
  };

 export const requirementsData = [
    {
      id: '1',
      description: 'All non-text content has meaningful alt text',
      category: 'Perceivable',
      status: 'Compliant' as const,
      severity: 100
    },
    {
      id: '2',
      description: 'No keyboard traps',
      category: 'Operable',
      status: 'At Risk' as const,
      severity: 35
    },
    {
      id: '3',
      description: 'Language of page is defined',
      category: 'Understandable',
      status: 'Noncompliant' as const,
      severity: 68
    },
    {
      id: '4',
      description: 'HTML is valid and semantic',
      category: 'Robust',
      status: 'Compliant' as const,
      severity: 100
    },
    {
      id: '5',
      description: 'Elements have proper ARIA roles and states',
      category: 'Robust',
      status: 'At Risk' as const,
      severity: 50
    }
  ];

  export const tasksData = [
    {
      id: '1',
      description: 'Add meaningful alt text to all non-text content',
      category: 'Perceivable',
      status: 'Completed' as const,
      priority: 'High' as const,
      completed: true
    },
    {
      id: '2',
      description: 'Breadcrumb navigation available',
      category: 'Operable',
      status: 'To Do' as const,
      priority: 'Medium' as const,
      completed: false
    },
    {
      id: '3',
      description: 'Touch targets large enough (44x44px)',
      category: 'Operable',
      status: 'To Do' as const,
      priority: 'High' as const,
      completed: false
    },
    {
      id: '4',
      description: 'Appropriate input fields used',
      category: 'Robust',
      status: 'In Progress' as const,
      priority: 'Medium' as const,
      completed: false
    },
    {
      id: '5',
      description: 'Acronyms and jargon explained or avoided',
      category: 'Understandable',
      status: 'Completed' as const,
      priority: 'Low' as const,
      completed: true
    }
  ];

  export const priorityData = [
    { level: 'AAA', value: 74.75, color: '#60a5fa' },
    { level: 'A', value: 65.68, color: '#8b5cf6' },
    { level: 'AA', value: 68.63, color: '#f97316' }
  ];

 