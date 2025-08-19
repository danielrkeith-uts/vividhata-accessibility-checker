package co.vividhata.accessibility_api.admin.db_management;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

// TODO - Secure controller with admin header in request
@RestController
@RequestMapping("/api/admin/db")
public class DbManagementController {

    @Autowired
    private IDbManagementService dbManagementService;

    @PostMapping("/rebuild-schema")
    public void rebuildSchema() {
        dbManagementService.rebuildSchema();
    }

}