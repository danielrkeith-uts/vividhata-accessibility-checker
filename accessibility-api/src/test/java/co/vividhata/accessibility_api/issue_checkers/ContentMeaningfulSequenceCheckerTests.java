package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.ContentMeaningfulSequenceChecker;
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
public class ContentMeaningfulSequenceCheckerTests {

    private static final String HTML_WITH_ABSOLUTE_POSITIONING = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Absolute Positioning</title>
  </head>
  <body>
    <div style="position: absolute; top: 10px; left: 10px;">Absolute positioned content</div>
    <div style="position:absolute; top: 20px; left: 20px;">Another absolute positioned content</div>
    <p>Regular content</p>
  </body>
</html>""";

    private static final String HTML_WITH_FIXED_POSITIONING = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Fixed Positioning</title>
  </head>
  <body>
    <div style="position: fixed; top: 0; right: 0;">Fixed positioned content</div>
    <div style="position:fixed; bottom: 0; left: 0;">Another fixed positioned content</div>
    <p>Regular content</p>
  </body>
</html>""";

    private static final String HTML_WITH_FLOAT_POSITIONING = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Float Positioning</title>
  </head>
  <body>
    <div style="float: left;">Left floated content</div>
    <div style="float:right;">Right floated content</div>
    <div style="float: left; width: 50%;">Half width floated content</div>
    <p>Regular content</p>
  </body>
</html>""";

    private static final String HTML_WITH_NEGATIVE_MARGINS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Negative Margins</title>
  </head>
  <body>
    <div style="margin-left: -10px;">Negative left margin</div>
    <div style="margin-right: -20px;">Negative right margin</div>
    <div style="margin-top: -5px;">Negative top margin</div>
    <div style="margin-bottom: -15px;">Negative bottom margin</div>
    <p>Regular content</p>
  </body>
</html>""";

    private static final String HTML_WITH_TRANSFORM_POSITIONING = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Transform Positioning</title>
  </head>
  <body>
    <div style="transform: translate(10px, 20px);">Transformed content</div>
    <div style="transform:translate(-5px, -10px);">Another transformed content</div>
    <p>Regular content</p>
  </body>
</html>""";

    private static final String HTML_WITH_PROBLEMATIC_CLASSES = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Problematic Classes</title>
  </head>
  <body>
    <div class="absolute">Absolute class</div>
    <div class="fixed">Fixed class</div>
    <div class="floating">Floating class</div>
    <div class="overlay">Overlay class</div>
    <div class="popup">Popup class</div>
    <div class="modal">Modal class</div>
    <div class="dropdown">Dropdown class</div>
    <div class="tooltip">Tooltip class</div>
    <div class="sticky">Sticky class</div>
    <div class="positioned">Positioned class</div>
    <div class="offset">Offset class</div>
    <div class="negative-margin">Negative margin class</div>
    <div class="pull-left">Pull left class</div>
    <div class="pull-right">Pull right class</div>
    <div class="float-left">Float left class</div>
    <div class="float-right">Float right class</div>
    <p>Regular content</p>
  </body>
</html>""";

    private static final String HTML_WITH_PROBLEMATIC_IDS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Problematic IDs</title>
  </head>
  <body>
    <div id="absolute">Absolute ID</div>
    <div id="fixed">Fixed ID</div>
    <div id="floating">Floating ID</div>
    <div id="overlay">Overlay ID</div>
    <div id="popup">Popup ID</div>
    <div id="modal">Modal ID</div>
    <div id="dropdown">Dropdown ID</div>
    <div id="tooltip">Tooltip ID</div>
    <div id="sticky">Sticky ID</div>
    <div id="positioned">Positioned ID</div>
    <div id="offset">Offset ID</div>
    <p>Regular content</p>
  </body>
</html>""";

    private static final String HTML_WITH_GOOD_POSITIONING = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Good Positioning</title>
  </head>
  <body>
    <div style="position: relative;">Relative positioned content</div>
    <div style="position: static;">Static positioned content</div>
    <div style="margin: 10px;">Regular margin</div>
    <div style="padding: 20px;">Regular padding</div>
    <div class="content">Regular content class</div>
    <div id="main">Regular main ID</div>
    <p>Regular content</p>
  </body>
</html>""";

    private static final String HTML_MIXED_POSITIONING = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Mixed Positioning</title>
  </head>
  <body>
    <div style="position: relative;">Good relative positioning</div>
    <div style="position: absolute; top: 10px;">Bad absolute positioning</div>
    <div class="content">Good content class</div>
    <div class="floating">Bad floating class</div>
    <div id="main">Good main ID</div>
    <div id="popup">Bad popup ID</div>
    <p>Regular content</p>
  </body>
</html>""";

    @Autowired
    private IHtmlParser htmlParser;
    @Autowired
    private ContentMeaningfulSequenceChecker issueChecker;

    @Test
    void testAbsolutePositioning() {
        Document document = htmlParser.parse(HTML_WITH_ABSOLUTE_POSITIONING);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.CONTENT_MEANINGFUL_SEQUENCE_VIOLATION, issue.issueType());
            Assertions.assertEquals(-1, issue.id());
            Assertions.assertEquals(-1, issue.scanId());
        }
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("position: absolute"));
        Assertions.assertTrue(htmlSnippets.contains("position:absolute"));
    }

    @Test
    void testFixedPositioning() {
        Document document = htmlParser.parse(HTML_WITH_FIXED_POSITIONING);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("position: fixed"));
        Assertions.assertTrue(htmlSnippets.contains("position:fixed"));
    }

    @Test
    void testFloatPositioning() {
        Document document = htmlParser.parse(HTML_WITH_FLOAT_POSITIONING);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("float: left"));
        Assertions.assertTrue(htmlSnippets.contains("float:right"));
    }

    @Test
    void testNegativeMargins() {
        Document document = htmlParser.parse(HTML_WITH_NEGATIVE_MARGINS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(4, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("margin-left: -10px"));
        Assertions.assertTrue(htmlSnippets.contains("margin-right: -20px"));
        Assertions.assertTrue(htmlSnippets.contains("margin-top: -5px"));
        Assertions.assertTrue(htmlSnippets.contains("margin-bottom: -15px"));
    }

    @Test
    void testTransformPositioning() {
        Document document = htmlParser.parse(HTML_WITH_TRANSFORM_POSITIONING);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("transform: translate"));
        Assertions.assertTrue(htmlSnippets.contains("transform:translate"));
    }

    @Test
    void testProblematicClasses() {
        Document document = htmlParser.parse(HTML_WITH_PROBLEMATIC_CLASSES);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(16, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("absolute"));
        Assertions.assertTrue(htmlSnippets.contains("fixed"));
        Assertions.assertTrue(htmlSnippets.contains("floating"));
        Assertions.assertTrue(htmlSnippets.contains("overlay"));
        Assertions.assertTrue(htmlSnippets.contains("popup"));
    }

    @Test
    void testProblematicIds() {
        Document document = htmlParser.parse(HTML_WITH_PROBLEMATIC_IDS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(11, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("absolute"));
        Assertions.assertTrue(htmlSnippets.contains("fixed"));
        Assertions.assertTrue(htmlSnippets.contains("floating"));
        Assertions.assertTrue(htmlSnippets.contains("overlay"));
        Assertions.assertTrue(htmlSnippets.contains("popup"));
    }

    @Test
    void testGoodPositioning() {
        Document document = htmlParser.parse(HTML_WITH_GOOD_POSITIONING);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testMixedPositioning() {
        Document document = htmlParser.parse(HTML_MIXED_POSITIONING);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("position: absolute"));
        Assertions.assertTrue(htmlSnippets.contains("floating"));
        Assertions.assertTrue(htmlSnippets.contains("popup"));
    }

    @Test
    void testEmptyDocument() {
        Document document = htmlParser.parse("<!doctype html><html><body></body></html>");

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testDocumentWithNoPositioning() {
        String html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>No Positioning</title>
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
