package co.vividhata.accessibility_api.web_page;

import co.vividhata.accessibility_api.model.Account;
import co.vividhata.accessibility_api.model.WebPage;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/web-page")
public class WebPageController {

    @Autowired
    IWebPageService webPageService;

    @GetMapping("/all")
    public ResponseEntity<List<WebPage>> getAll(@AuthenticationPrincipal Account account) {
        return ResponseEntity.ok(webPageService.getAllWebPages(account.id()));
    }

}
