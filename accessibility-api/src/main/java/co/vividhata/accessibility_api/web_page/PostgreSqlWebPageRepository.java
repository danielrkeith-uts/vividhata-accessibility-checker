package co.vividhata.accessibility_api.web_page;

import co.vividhata.accessibility_api.model.WebPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;

@Repository
public class PostgreSqlWebPageRepository implements IWebPageRepository {

    @Autowired
    JdbcTemplate jdbcTemplate;

    @Override
    public int create(int accountId, String url) {
        String sql = "INSERT INTO ac.web_page(account_id, url) VALUES (?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {

            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id"});
            ps.setInt(1, accountId);
            ps.setString(2, url);
            return ps;

        }, keyHolder);

        Number id = keyHolder.getKey();
        if (id == null) {
            return -1;
        }
        return id.intValue();
    }

    @Override
    public WebPage get(int accountId, String url) {
        String sql = "SELECT * FROM ac.web_page WHERE account_id = ? AND url = ?;";

        return jdbcTemplate.query(sql, WebPage::fromResultSet, accountId, url);
    }

    @Override
    public WebPage get(int webPageId) {
        String sql = "SELECT * FROM ac.web_page WHERE id = ?;";

        return jdbcTemplate.query(sql, WebPage::fromResultSet, webPageId);
    }

    @Override
    public List<WebPage> getAll(int accountId) {
        String sql = "SELECT * FROM ac.web_page WHERE account_id = ?;";

        return jdbcTemplate.query(sql, (rs, _) -> WebPage.fromRow(rs), accountId);
    }

    @Override
    public void delete(int webPageId) {
        String sql = "DELETE FROM ac.web_page WHERE id = ?;";

        jdbcTemplate.update(sql, webPageId);
    }

}
