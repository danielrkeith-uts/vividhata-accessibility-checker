package co.vividhata.accessibility_api.admin.db_management;

import co.vividhata.accessibility_api.util.IResourceReader;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.io.IOException;

@Service
public class PostgreSqlDbManagementService implements IDbManagementService {

    @Autowired
    private JdbcTemplate jdbcTemplate;
    @Autowired
    private IResourceReader resourceReader;

    @Override
    public void rebuildSchema() {
        String rebuildSchemaSql;
        try {
            rebuildSchemaSql = resourceReader.getResourceAsString("postgresql/rebuild_schema.sql");
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        jdbcTemplate.execute(rebuildSchemaSql);
    }
}