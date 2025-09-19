package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.AltTextMissingIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.util.IHtmlParser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;

import java.util.List;

@SpringBootTest
public class AltTextMissingIssueCheckerTests {

    private static final String HTML_THREE_MISSING_ALT_TEXTS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
  </head>
  <body>
    <h1 id="title">Hello, Test!</h1>
    <button id="btn">Click Me</button>
    <img src="img_1.jpg" alt="image 1"/>
    <img src="img_2.jpg"/>
    <img src="img_3.jpg" alt="image 3"/>
    <img src="img_4.jpg"/>
    <img src="img_5.jpg"/>
  </body>
</html>""";

    @Autowired
    private IHtmlParser htmlParser;
    @Autowired
    private AltTextMissingIssueChecker issueChecker;

    @Test
    void testThreeMissingAltTexts() {
        Document document = htmlParser.parse(HTML_THREE_MISSING_ALT_TEXTS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        Assertions.assertEquals("<img src=\"img_2.jpg\"/>", issues.getFirst().htmlSnippet());
        Assertions.assertEquals("<img src=\"img_4.jpg\"/>", issues.get(1).htmlSnippet());
        Assertions.assertEquals("<img src=\"img_5.jpg\"/>", issues.get(2).htmlSnippet());

    }

}
