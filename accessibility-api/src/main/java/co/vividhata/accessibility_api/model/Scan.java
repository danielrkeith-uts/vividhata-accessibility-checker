package co.vividhata.accessibility_api.model;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.time.Instant;
import java.util.List;

public record Scan(int id, int webPageId, Instant timeScanned, String htmlContent) {

    public static Scan fromRow(ResultSet rs, int ignoredRowNum) throws SQLException {
        return new Scan(
                rs.getInt("id"),
                rs.getInt("web_page_id"),
                rs.getTimestamp("time_scanned").toInstant(),
                rs.getString("html_content")
        );
    }

}
