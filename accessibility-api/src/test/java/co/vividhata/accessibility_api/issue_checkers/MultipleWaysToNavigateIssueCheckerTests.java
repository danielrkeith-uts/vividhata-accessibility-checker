package co.vividhata.accessibility_api.issue_checkers;

import java.util.List;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;

import co.vividhata.accessibility_api.checker.issue_checkers.MultipleWaysToNavigateIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.util.IHtmlParser;

public class MultipleWaysToNavigateIssueCheckerTests {
    private static final String HTML_WITH_SEARCH = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Unit Test Fixture</title>
          </head>
          <body>
            <form role="search"><input type="search"/></form>
          </body>
        </html>""";
        
    private static final String HTML_NO_HELPERS = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Unit Test Fixture</title>
          </head>
          <body>
            <nav><a href="/a">A</a></nav>
          </body>
        </html>""";
        
    @Autowired private IHtmlParser htmlParser;
    @Autowired private MultipleWaysToNavigateIssueChecker issueChecker;

    @Test
    void testPassesWithAnyAlternativeOtherwiseFlags() {
        Document documentWithSearch = htmlParser.parse(HTML_WITH_SEARCH);
        List<Issue> noIssues = issueChecker.check(documentWithSearch);
        Assertions.assertEquals(0, noIssues.size());

        Document documentNoHelpers = htmlParser.parse(HTML_NO_HELPERS);
        List<Issue> issues = issueChecker.check(documentNoHelpers);
        Assertions.assertEquals(1, issues.size());
        Assertions.assertEquals("No skip link, search, or sitemap detected", issues.getFirst().htmlSnippet());
    }
}
