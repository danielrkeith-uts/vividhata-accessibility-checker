package co.vividhata.accessibility_api.issue_checkers;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.springframework.boot.test.context.SpringBootTest;

import co.vividhata.accessibility_api.checker.issue_checkers.DescriptiveLinkTextIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.util.IHtmlParser;

@SpringBootTest
public class DescriptiveLinkTextIssueCheckerTests {
    private static final String HTML_VAGUE_AND_EMPTY = """
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
</head>
<body>
    <a id="vague" href="/x">Click here</a>
    <a id="empty" href="/y"></a>
    <a id="ok" href="/p">View pricing</a>
</body>
</html>""";

    @Autowired private IHtmlParser htmlParser;
    @Autowired private DescriptiveLinkTextIssueChecker issueChecker;

    @Test
    void testVagueAndEmptyOnly() {
        Document document = htmlParser.parse(HTML_VAGUE_AND_EMPTY);
        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        Assertions.assertEquals("<a id=\"vague\" href=\"/x\">Click here</a>", issues.getFirst().htmlSnippet());
        Assertions.assertEquals("<a id=\"empty\" href=\"/y\"></a>", issues.get(1).htmlSnippet());
    }
}
