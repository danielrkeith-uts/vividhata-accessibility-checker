package co.vividhata.accessibility_api.issue_checkers;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;

import co.vividhata.accessibility_api.checker.issue_checkers.ClearPageTitlesIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.util.IHtmlParser;

@SpringBootTest
public class ClearPageTitlesIssueCheckerTests {
    private static final String HTML_EMPTY_TITLE = """
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>   </title>
</head>
<body></body>
</html>""";

    @Autowired private IHtmlParser htmlParser;
    @Autowired private ClearPageTitlesIssueChecker issueChecker;

    @Test
    void testMissingOrEmptyTitleOnly() {
        Document document = htmlParser.parse(HTML_EMPTY_TITLE);
        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(1, issues.size());
        Assertions.assertEquals("<title></title>", issues.getFirst().htmlSnippet());
    }
}
