package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.Account;
import co.vividhata.accessibility_api.model.Scan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/scan")
public class ScanController {

    @Autowired
    private IScanService scanService;

    @PostMapping("/from-url")
    public ResponseEntity<Scan> readPageFromUrl(@RequestBody String url, @AuthenticationPrincipal Account account) {
        Scan scan = scanService.scanFrom(url, account.id());

        return ResponseEntity.ok(scan);
    }

}
