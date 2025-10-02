import React, { useState } from "react";
import "./BreakdownTable.css";
import { Select as CustomSelect } from "../common/Select";
interface Requirement {
  id: string;
  description: string;
  category: string;
  status: "Compliant" | "At Risk" | "Noncompliant";
  severity: number;
}

interface BreakdownTableProps {
  requirements: Requirement[];
}

export const BreakdownTable: React.FC<BreakdownTableProps> = ({
  requirements,
}) => {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedSeverity, setSelectedSeverity] = useState("All");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Compliant":
        return "#10b981";
      case "At Risk":
        return "#f59e0b";
      case "Noncompliant":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  const getStatusIcon = (status: string) => {
    return "●";
  };

  const getSeverityLabel = (severity: number) => {
    if (severity >= 70) return "High";
    if (severity >= 40) return "Medium";
    return "Low";
  };

  const filteredRequirements = requirements.filter((req) => {
    const categoryMatch =
      selectedCategory === "All" || req.category === selectedCategory;
    const statusMatch =
      selectedStatus === "All" || req.status === selectedStatus;
    const severityLabel = getSeverityLabel(req.severity);
    const severityMatch =
      selectedSeverity === "All" || severityLabel === selectedSeverity;
    return categoryMatch && statusMatch && severityMatch;
  });

  const categories = ["Perceivable", "Operable", "Understandable", "Robust"];

  return (
    <div className="breakdown-table">
      <div className="table-header">
        <h3>Breakdown</h3>
        <div className="table-filters">
          {/* Category Filter */}
          <CustomSelect
            value={selectedCategory}
            onChange={(val) => setSelectedCategory(val)}
            placeholder="Category"
            options={[
              { value: "All", label: "Category" },
              { value: "Perceivable", label: "Perceivable" },
              { value: "Operable", label: "Operable" },
              { value: "Understandable", label: "Understandable" },
              { value: "Robust", label: "Robust" },
            ]}
            size="small"
            className="custom-filter"
          />

          {/* Status Filter */}
          <CustomSelect
            value={selectedStatus}
            placeholder="Status"
            onChange={(val) => setSelectedStatus(val)}
            options={[
              { value: "All", label: "Status" },
              { value: "Compliant", label: "Compliant" },
              { value: "At Risk", label: "At Risk" },
              { value: "Noncompliant", label: "Noncompliant" },
            ]}
            size="small"
            className="custom-filter"
          />

          {/* Severity Filter */}
          <CustomSelect
            value={selectedSeverity}
            placeholder="Severity"
            onChange={(val) => setSelectedSeverity(val)}
            options={[
              { value: "All", label: "Severity" },
              { value: "High", label: "High" },
              { value: "Medium", label: "Medium" },
              { value: "Low", label: "Low" },
            ]}
            size="small"
            className="custom-filter"
          />
        </div>
      </div>

      <div className="table-container" data-pdf-expand>
        <table className="breakdown-table-content">
          <thead>
            <tr>
              <th>Requirement</th>
              <th>Category</th>
              <th>Status</th>
              <th>Severity</th>
            </tr>
          </thead>
          <tbody>
            {filteredRequirements.map((requirement) => (
              <tr key={requirement.id}>
                <td className="requirement-description">
                  {requirement.description}
                </td>
                <td className="requirement-category">{requirement.category}</td>
                <td className="requirement-status">
                  <span
                    className="status-indicator"
                    style={{
                      color: getStatusColor(requirement.status),
                      marginRight: "6px",
                    }}
                  >
                    {getStatusIcon(requirement.status)}
                  </span>
                  {requirement.status}
                </td>
                <td className="requirement-severity">
                  <div className="severity-bar">
                    <div
                      className="severity-fill"
                      style={{
                        width: `${requirement.severity}%`,
                        backgroundColor: getStatusColor(requirement.status),
                      }}
                    ></div>
                  </div>
                  <span className="severity-text">{requirement.severity}%</span>
                </td>
              </tr>
            ))}
            {filteredRequirements.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  style={{ textAlign: "center", padding: "1rem" }}
                >
                  No requirements match the selected filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
