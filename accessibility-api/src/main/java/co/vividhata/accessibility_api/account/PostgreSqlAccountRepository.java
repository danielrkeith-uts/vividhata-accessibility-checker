package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class PostgreSqlAccountRepository implements IAccountRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void create(String email, String password, String firstName, String lastName) {
        String sql = "INSERT INTO ac.account(email, password, first_name, last_name) VALUES (?, ?, ?, ?);";

        jdbcTemplate.update(sql, email, password, firstName, lastName);
    }

    @Override
    public Account get(String email) {
        String sql = "SELECT * FROM ac.account WHERE email = ?;";

        return jdbcTemplate.query(sql, Account::fromResultSet, email);
    }

}
