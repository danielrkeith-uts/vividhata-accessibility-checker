package co.vividhata.accessibility_api.web_page;

import co.vividhata.accessibility_api.model.Account;
import co.vividhata.accessibility_api.model.WebPage;
import co.vividhata.accessibility_api.scan.IScanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
public class WebPageController {

    @Autowired
    private IWebPageService webPageService;
    @Autowired
    private IScanService scanService;

    @GetMapping("/web-pages")
    public ResponseEntity<List<WebPage>> getAll(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(webPageService.getAllWebPages(account.id()));
    }

    @GetMapping("/web-page/{webPageId}/scans")
    public ResponseEntity<?> getScans(@PathVariable int webPageId, @AuthenticationPrincipal Account account) {
        if (webPageService.getOwner(webPageId) != account.id()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Scan does not belong to current user");
        }

        return ResponseEntity.ok(scanService.getScans(webPageId));
    }

    @DeleteMapping("/web-page/{webPageId}")
    public ResponseEntity<?> deletePage(@PathVariable int webPageId, @AuthenticationPrincipal Account account) {
        if (webPageService.getOwner(webPageId) != account.id()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Web page does not belong to current user");
        }

        webPageService.deleteWebPage(webPageId);
        return ResponseEntity.ok().build();
    }

}
