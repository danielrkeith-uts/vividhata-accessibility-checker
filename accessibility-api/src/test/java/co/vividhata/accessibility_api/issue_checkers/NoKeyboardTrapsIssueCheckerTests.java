package co.vividhata.accessibility_api.issue_checkers;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;

import co.vividhata.accessibility_api.checker.issue_checkers.NoKeyboardTrapsIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.util.IHtmlParser;

@SpringBootTest
public class NoKeyboardTrapsIssueCheckerTests {
    private static final String HTML_TRAPS = """
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
</head>
<body>
    <div id="trap" onkeydown="event.preventDefault()"></div>
    <div id="ok" onkeydown="if(event.key==='Tab'){ /* allow */ }"></div>
    <input id="loop" onfocus="this.focus()"/>
</body>
</html>""";

    @Autowired private IHtmlParser htmlParser;
    @Autowired private NoKeyboardTrapsIssueChecker issueChecker;

    @Test
    void testPreventDefaultWithoutTabEscapeAndFocusLoop() {
        Document document = htmlParser.parse(HTML_TRAPS);
        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        Assertions.assertEquals("<div id=\"trap\" onkeydown=\"event.preventDefault()\"></div>", issues.getFirst().htmlSnippet());
        Assertions.assertEquals("<input id=\"loop\" onfocus=\"this.focus()\"/>", issues.get(1).htmlSnippet());
    }
}
