package co.vividhata.accessibility_api.scan;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Timestamp;
import java.time.Instant;

@Repository
public class PostgreSqlScanRepository implements IScanRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int create(int webPageId, Instant timeScanned, String htmlContent) {
        String sql = "INSERT INTO ac.scan(web_page_id, time_scanned, html_content) VALUES (?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {

            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id"});
            ps.setInt(1, webPageId);
            ps.setTimestamp(2, Timestamp.from(timeScanned));
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
