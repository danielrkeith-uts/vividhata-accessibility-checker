package co.vividhata.accessibility_api.issue_checkers;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;

import co.vividhata.accessibility_api.checker.issue_checkers.TimeLimitsIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.util.IHtmlParser;

@SpringBootTest
public class TimeLimitsIssueCheckerTests {
    private static final String HTML_META_REFRESH = """
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
    <meta http-equiv="refresh" content="5;url=/timeout"/>
</head>
<body></body>
</html>""";

    @Autowired private IHtmlParser htmlParser;
    @Autowired private TimeLimitsIssueChecker issueChecker;

    @Test
    void testMetaRefreshFlagged() {
        Document document = htmlParser.parse(HTML_META_REFRESH);
        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(1, issues.size());
        Assertions.assertEquals("<meta http-equiv=\"refresh\" content=\"5;url=/timeout\"/>", issues.getFirst().htmlSnippet());
    }
}
