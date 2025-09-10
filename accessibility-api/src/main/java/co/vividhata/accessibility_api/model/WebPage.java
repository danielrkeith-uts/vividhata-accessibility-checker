package co.vividhata.accessibility_api.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public record WebPage(int id, int accountId, String url) {

    public static WebPage fromResultSet(ResultSet rs) throws SQLException {
        if (!rs.next()) return null;
        return new WebPage(
                rs.getInt("id"),
                rs.getInt("account_id"),
                rs.getString("url")
        );
    }

}
