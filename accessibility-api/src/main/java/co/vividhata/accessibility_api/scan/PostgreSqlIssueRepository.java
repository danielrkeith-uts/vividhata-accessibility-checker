package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.IssueType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Service;

import java.sql.PreparedStatement;

@Service
public class PostgreSqlIssueRepository implements IIssueRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int create(int scanId, IssueType issueType, String htmlSnippet) {
        String sql = "INSERT INTO ac.issue(scan_id, issue_type, html_snippet) VALUES (?, ?, ?);";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {

            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id"});

            ps.setInt(1, scanId);
            ps.setString(2, issueType.name());
            ps.setString(3, htmlSnippet);

            return ps;

        }, keyHolder);

        Number id = keyHolder.getKey();
        if (id == null) {
            return -1;
        }
        return id.intValue();
    }
}
