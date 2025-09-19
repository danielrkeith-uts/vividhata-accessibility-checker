package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.Account;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.Scan;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;


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

    @GetMapping("/{scanId}/issues")
    public ResponseEntity<?> getIssues(@PathVariable int scanId, @AuthenticationPrincipal Account account) {
        if (scanService.getOwner(scanId) != account.id()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Scan does not belong to current user");
        }

        return ResponseEntity.ok(scanService.getIssues(scanId));
    }

}
