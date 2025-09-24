package co.vividhata.accessibility_api.issue_checkers;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;

import co.vividhata.accessibility_api.checker.issue_checkers.KeyboardOperableIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.util.IHtmlParser;

@SpringBootTest
public class KeyboardOperableIssueCheckerTests {
    
    private static final String HTML_MOUSE_NO_KEYBOARD = """
<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
</head>
<body>
    <div id="bad" onclick="doIt()"></div>
    <div id="ok1" onclick="doIt()" onkeydown="doIt()"></div>
    <span id="ok2" onmouseup="x()" onkeyup="y()"></span>
    <a id="ok3" href="#" onclick="x()" onkeydown="y()"></a>
</body>
</html>""";

    @Autowired private IHtmlParser htmlParser;
    @Autowired private KeyboardOperableIssueChecker issueChecker;

    @Test
    void testMouseHandlersWithoutKeyboardHandlers() {
        Document document = htmlParser.parse(HTML_MOUSE_NO_KEYBOARD);
        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(1, issues.size());
        Assertions.assertEquals("<div id=\"bad\" onclick=\"doIt()\"></div>", issues.getFirst().htmlSnippet());
    }

}
