package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.SemanticHtmlChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.IHtmlParser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;

import java.util.List;

@SpringBootTest
public class SemanticHtmlCheckerTests {

    private static final String HTML_WITH_NON_SEMANTIC_DIVS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Non-Semantic HTML</title>
  </head>
  <body>
    <div class="header">Header Content</div>
    <div id="navigation">Navigation Menu</div>
    <div class="main-content">Main Content</div>
    <div id="footer">Footer Content</div>
    <div class="sidebar">Sidebar Content</div>
  </body>
</html>""";

    private static final String HTML_WITH_NON_SEMANTIC_SPANS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Non-Semantic Spans</title>
  </head>
  <body>
    <span class="button">Click Me</span>
    <span id="link">Go to Page</span>
    <span class="emphasis">Important Text</span>
    <span id="strong">Bold Text</span>
  </body>
</html>""";

    private static final String HTML_WITH_PROPER_SEMANTIC_ELEMENTS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Semantic HTML</title>
  </head>
  <body>
    <header>Header Content</header>
    <nav>Navigation Menu</nav>
    <main>Main Content</main>
    <footer>Footer Content</footer>
    <aside>Sidebar Content</aside>
    <button>Click Me</button>
    <a href="#">Go to Page</a>
    <em>Important Text</em>
    <strong>Bold Text</strong>
  </body>
</html>""";

    private static final String HTML_WITH_ROLE_ATTRIBUTES = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>HTML with Roles</title>
  </head>
  <body>
    <div class="header" role="banner">Header Content</div>
    <div id="navigation" role="navigation">Navigation Menu</div>
    <span class="button" role="button">Click Me</span>
    <span id="link" role="link">Go to Page</span>
  </body>
</html>""";

    private static final String HTML_MIXED_SEMANTIC_AND_NON_SEMANTIC = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Mixed HTML</title>
  </head>
  <body>
    <header>Proper Header</header>
    <div class="nav">Should be nav</div>
    <main>Proper Main</main>
    <div id="footer">Should be footer</div>
    <button>Proper Button</button>
    <span class="btn">Should be button</span>
  </body>
</html>""";

    private static final String HTML_WITH_ARTICLE_AND_SECTION_PATTERNS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Article and Section Patterns</title>
  </head>
  <body>
    <div class="article">Article Content</div>
    <div id="post">Blog Post</div>
    <div class="section">Section Content</div>
    <div id="chapter">Chapter Content</div>
  </body>
</html>""";

    @Autowired
    private IHtmlParser htmlParser;
    @Autowired
    private SemanticHtmlChecker issueChecker;

    @Test
    void testNonSemanticDivs() {
        Document document = htmlParser.parse(HTML_WITH_NON_SEMANTIC_DIVS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.SEMANTIC_HTML_MISSING, issue.issueType());
            Assertions.assertEquals(-1, issue.id());
            Assertions.assertEquals(-1, issue.scanId());
        }
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("header"));
        Assertions.assertTrue(htmlSnippets.contains("navigation"));
        Assertions.assertTrue(htmlSnippets.contains("main-content"));
        Assertions.assertTrue(htmlSnippets.contains("footer"));
        Assertions.assertTrue(htmlSnippets.contains("sidebar"));
    }

    @Test
    void testNonSemanticSpans() {
        Document document = htmlParser.parse(HTML_WITH_NON_SEMANTIC_SPANS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(4, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.SEMANTIC_HTML_MISSING, issue.issueType());
        }
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("button"));
        Assertions.assertTrue(htmlSnippets.contains("link"));
        Assertions.assertTrue(htmlSnippets.contains("emphasis"));
        Assertions.assertTrue(htmlSnippets.contains("strong"));
    }

    @Test
    void testProperSemanticElements() {
        Document document = htmlParser.parse(HTML_WITH_PROPER_SEMANTIC_ELEMENTS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testElementsWithRoleAttributes() {
        Document document = htmlParser.parse(HTML_WITH_ROLE_ATTRIBUTES);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testMixedSemanticAndNonSemantic() {
        Document document = htmlParser.parse(HTML_MIXED_SEMANTIC_AND_NON_SEMANTIC);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("nav"));
        Assertions.assertTrue(htmlSnippets.contains("footer"));
        Assertions.assertTrue(htmlSnippets.contains("btn"));
    }

    @Test
    void testArticleAndSectionPatterns() {
        Document document = htmlParser.parse(HTML_WITH_ARTICLE_AND_SECTION_PATTERNS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(4, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("article"));
        Assertions.assertTrue(htmlSnippets.contains("post"));
        Assertions.assertTrue(htmlSnippets.contains("section"));
        Assertions.assertTrue(htmlSnippets.contains("chapter"));
    }

    @Test
    void testEmptyDocument() {
        Document document = htmlParser.parse("<!doctype html><html><body></body></html>");

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testDocumentWithNoDivsOrSpans() {
        String html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>No Divs or Spans</title>
  </head>
  <body>
    <h1>Heading</h1>
    <p>Paragraph content</p>
    <ul>
      <li>List item</li>
    </ul>
  </body>
</html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }
}
