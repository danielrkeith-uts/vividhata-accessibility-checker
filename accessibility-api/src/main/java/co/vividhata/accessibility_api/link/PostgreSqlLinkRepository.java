package co.vividhata.accessibility_api.link;

import co.vividhata.accessibility_api.model.Link;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.util.List;

@Repository
public class PostgreSqlLinkRepository implements ILinkRepository {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Override
    public int create(int scanId, String link) {
        String sql = "INSERT INTO ac.link(scan_id, link) VALUES (?, ?)";

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(con -> {

            PreparedStatement ps = con.prepareStatement(sql, new String[]{"id"});

            ps.setInt(1, scanId);
            ps.setString(2, link);

            return ps;

        }, keyHolder);

        Number id = keyHolder.getKey();
        if (id == null) {
            return -1;
        }
        return id.intValue();
    }

    @Override
    public List<Link> getAll(int scanId) {
        String sql = "SELECT * FROM ac.link WHERE scan_id = ?";

        return jdbcTemplate.query(sql, Link::fromRow, scanId);
    }
}
