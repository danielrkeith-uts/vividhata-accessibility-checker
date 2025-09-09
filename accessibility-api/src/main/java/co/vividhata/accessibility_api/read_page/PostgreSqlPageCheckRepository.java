package co.vividhata.accessibility_api.read_page;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.sql.Timestamp;
import java.time.Instant;

@Service
public class PostgreSqlPageCheckRepository implements IPageCheckRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public void create(int webPageId, Instant timeRan, String htmlContent) {
        String sql = "INSERT INTO ac.page_check(web_page_id, time_ran, html_content) VALUES (?, ?, ?);";

        jdbcTemplate.update(sql, webPageId, Timestamp.from(timeRan), htmlContent);
    }
}
