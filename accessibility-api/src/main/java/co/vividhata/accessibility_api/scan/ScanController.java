package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.issue.IIssueService;
import co.vividhata.accessibility_api.link.ILinkService;
import co.vividhata.accessibility_api.model.Account;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.Link;
import co.vividhata.accessibility_api.model.Scan;
import co.vividhata.accessibility_api.scan.dto.ScanResponse;
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
    @Autowired
    private IIssueService issueService;
    @Autowired
    private ILinkService linkService;

    @PostMapping("/from-url")
    public ResponseEntity<ScanResponse> readPageFromUrl(@RequestBody String url, @AuthenticationPrincipal Account account) {
        Scan scan = scanService.scanFrom(url, account.id());
        List<Issue> issues = issueService.getIssues(scan.id());
        List<Link> links = linkService.getLinks(scan.id());

        return ResponseEntity.ok(new ScanResponse(scan, issues, links));
    }

    @GetMapping("/{scanId}/issues")
    public ResponseEntity<?> getIssues(@PathVariable int scanId, @AuthenticationPrincipal Account account) {
        if (scanService.getOwner(scanId) != account.id()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Scan does not belong to current user");
        }

        return ResponseEntity.ok(issueService.getIssues(scanId));
    }

    @GetMapping("/{scanId}/links")
    public ResponseEntity<?> getLinks(@PathVariable int scanId, @AuthenticationPrincipal Account account) {
        if (scanService.getOwner(scanId) != account.id()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Scan does not belong to current user");
        }

        return ResponseEntity.ok(linkService.getLinks(scanId));
    }

}
