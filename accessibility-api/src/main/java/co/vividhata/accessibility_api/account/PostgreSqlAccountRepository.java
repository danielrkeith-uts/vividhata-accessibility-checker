package co.vividhata.accessibility_api.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.Statement;

@Service
public class PostgreSqlAccountRepository implements IAccountRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int createAccount(String username, String password, String firstName, String lastName) {
        String sql = "INSERT INTO ac.account(username, password, first_name, last_name) VALUES (?, ?, ?, ?) RETURNING id";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS);
            ps.setString(1, username);
            ps.setString(2, password);
            ps.setString(3, firstName);
            ps.setString(4, lastName);
            return ps;
        }, keyHolder);

        Number id = keyHolder.getKey();
        return id == null ? -1 : (int) id;
    }

}
