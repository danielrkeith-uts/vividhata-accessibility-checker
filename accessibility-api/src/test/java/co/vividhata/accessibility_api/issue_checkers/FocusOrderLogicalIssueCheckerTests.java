package co.vividhata.accessibility_api.issue_checkers;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;

import co.vividhata.accessibility_api.checker.issue_checkers.FocusOrderLogicalIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.util.IHtmlParser;

public class FocusOrderLogicalIssueCheckerTests {
    private static final String HTML_POSITIVE_TABINDEX = """
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
</head>
<body>
    <a id="bad" href="#" tabindex="3">X</a>
    <button id="ok" tabindex="0">Ok</button>
</body>
</html>""";

    @Autowired private IHtmlParser htmlParser;
    @Autowired private FocusOrderLogicalIssueChecker issueChecker;

    @Test
    void testPositiveTabindexFlagged() {
        Document document = htmlParser.parse(HTML_POSITIVE_TABINDEX);
        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(1, issues.size());
        Assertions.assertEquals("<a id=\"bad\" href=\"#\" tabindex=\"3\">X</a>", issues.getFirst().htmlSnippet());
    }
}
