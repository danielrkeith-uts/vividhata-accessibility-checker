package co.vividhata.accessibility_api.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public record Link(int id, int scanId, String link) {
    public static Link fromRow(ResultSet rs, int ignoredRowNum) throws SQLException {
        return new Link(
                rs.getInt("id"),
                rs.getInt("scan_id"),
                rs.getString("link")
        );
    }
}
