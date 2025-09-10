package co.vividhata.accessibility_api.read_page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Instant;

@Service
public class PostgreSqlPageCheckRepository implements IPageCheckRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int create(int webPageId, Instant timeChecked, String htmlContent) {
        String sql = "INSERT INTO ac.page_check(web_page_id, time_checked, html_content) VALUES (?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {

            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id"});
            ps.setInt(1, webPageId);
            ps.setTimestamp(2, Timestamp.from(timeChecked));
            ps.setString(3, htmlContent);
            return ps;

        }, keyHolder);

        Number id = keyHolder.getKey();
        if (id == null) {
            return -1;
        }
        return id.intValue();
    }
}
