package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class PostgreSqlAccountRepository implements IAccountRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void create(String username, String password, String firstName, String lastName) {
        String sql = "INSERT INTO ac.account(username, password, first_name, last_name) VALUES (?, ?, ?, ?);";

        jdbcTemplate.update(sql, username, password, firstName, lastName);
    }

    @Override
    public Account get(String username) {
        String sql = "SELECT * FROM ac.account WHERE username = ?;";

        return jdbcTemplate.query(sql, Account::fromResultSet, username);
    }

}
