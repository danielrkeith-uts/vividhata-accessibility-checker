package co.vividhata.accessibility_api.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public record Account(int id, String username, String password, String firstName, String lastName) {
    public static Account fromResultSet(ResultSet rs) throws SQLException {
        if (!rs.next()) return null;
        return new Account(
                rs.getInt("id"),
                rs.getString("username"),
                rs.getString("password"),
                rs.getString("first_name"),
                rs.getString("last_name")
        );
    }
}
