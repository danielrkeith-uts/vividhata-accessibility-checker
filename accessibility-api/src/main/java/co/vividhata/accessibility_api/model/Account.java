package co.vividhata.accessibility_api.model;

import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Collection;
import java.util.List;

public record Account(int id, String username, String password, String firstName, String lastName) implements UserDetails {

    private static final Collection<? extends GrantedAuthority> authorities = List.of(new SimpleGrantedAuthority("ROLE_USER"));

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public String getPassword() {
        return password;
    }

    public static Account fromResultSet(ResultSet rs) throws SQLException {
        if (!rs.next()) return null;
        return fromRow(rs, rs.getRow());
    }

    public static Account fromRow(ResultSet rs, int ignoredRowNum) throws SQLException {
        return new Account(
                rs.getInt("id"),
                rs.getString("username"),
                rs.getString("password"),
                rs.getString("first_name"),
                rs.getString("last_name")
        );
    }

}
