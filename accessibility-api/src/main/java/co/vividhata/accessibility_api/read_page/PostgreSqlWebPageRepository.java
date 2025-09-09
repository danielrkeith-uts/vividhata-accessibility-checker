package co.vividhata.accessibility_api.read_page;

import co.vividhata.accessibility_api.model.WebPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

@Service
public class PostgreSqlWebPageRepository implements IWebPageRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public void create(int accountId, String url) {
        String sql = "INSERT INTO ac.web_page(account_id, url) VALUES (?, ?);";

        jdbcTemplate.update(sql, accountId, url);
    }

    public WebPage get(int accountId, String url) {
        String sql = "SELECT * FROM ac.web_page WHERE account_id = ? AND url = ?;";

        return jdbcTemplate.query(sql, WebPage::fromResultSet, accountId, url);
    }

}
