package co.vividhata.accessibility_api.read_page;

import co.vividhata.accessibility_api.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("/api/read-page")
public class ReadPageController {

    @Autowired
    private IReadPageService readPageService;

    @PostMapping("/from-url")
    public ResponseEntity<String> readPageFromUrl(@RequestBody String url, @AuthenticationPrincipal Account account) {
        String html = readPageService.readPageFrom(url, account.id());

        return ResponseEntity.ok(html);
    }

}
