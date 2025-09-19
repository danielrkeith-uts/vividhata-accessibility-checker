package co.vividhata.accessibility_api.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public record Issue(int id, int scanId, IssueType issueType, String htmlSnippet) {

    public Issue withId(int id) {
        return new Issue(id, scanId, issueType, htmlSnippet);
    }

    public Issue withScanId(int scanId) {
        return new Issue(id, scanId, issueType, htmlSnippet);
    }

    public static Issue fromRow(ResultSet rs, int ignoredRowNum) throws SQLException {
        return new Issue(
                rs.getInt("id"),
                rs.getInt("scan_id"),
                IssueType.valueOf(rs.getString("issue_type")),
                rs.getString("html_snippet")
        );
    }

}
