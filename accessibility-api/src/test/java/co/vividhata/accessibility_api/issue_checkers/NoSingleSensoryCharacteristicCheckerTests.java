package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.NoSingleSensoryCharacteristicChecker;
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
public class NoSingleSensoryCharacteristicCheckerTests {

    private static final String HTML_WITH_COLOR_ONLY_INDICATORS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Color Only Indicators</title>
  </head>
  <body>
    <div class="red"></div>
    <div class="green"></div>
    <div class="success"></div>
    <div class="error"></div>
    <div class="warning"></div>
    <div class="danger"></div>
    <div class="info"></div>
    <div class="primary"></div>
    <div class="secondary"></div>
    <div style="color: blue;"></div>
    <div style="background-color: yellow;"></div>
  </body>
</html>""";

    private static final String HTML_WITH_POSITION_ONLY_INDICATORS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Position Only Indicators</title>
  </head>
  <body>
    <div class="left"></div>
    <div class="right"></div>
    <div class="top"></div>
    <div class="bottom"></div>
    <div class="center"></div>
    <div class="middle"></div>
    <div class="first"></div>
    <div class="last"></div>
    <div class="above"></div>
    <div class="below"></div>
  </body>
</html>""";

    private static final String HTML_WITH_SHAPE_ONLY_INDICATORS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Shape Only Indicators</title>
  </head>
  <body>
    <div class="circle"></div>
    <div class="square"></div>
    <div class="triangle"></div>
    <div class="diamond"></div>
    <div class="arrow"></div>
    <div class="star"></div>
    <div class="heart"></div>
    <div class="round"></div>
    <div class="oval"></div>
  </body>
</html>""";

    private static final String HTML_WITH_SIZE_ONLY_INDICATORS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Size Only Indicators</title>
  </head>
  <body>
    <div class="small"></div>
    <div class="large"></div>
    <div class="big"></div>
    <div class="tiny"></div>
    <div class="huge"></div>
    <div class="mini"></div>
    <div class="maxi"></div>
    <div class="compact"></div>
    <div class="expanded"></div>
  </body>
</html>""";

    private static final String HTML_WITH_AUDIO_NO_ALTERNATIVES = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Audio No Alternatives</title>
  </head>
  <body>
    <audio src="sound1.mp3" controls></audio>
    <audio src="sound2.wav" controls></audio>
    <audio src="sound3.ogg" controls></audio>
  </body>
</html>""";

    private static final String HTML_WITH_GOOD_ALTERNATIVES = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Good Alternatives</title>
  </head>
  <body>
    <div class="red" aria-label="Error message">Red indicator</div>
    <div class="green" title="Success status">Green indicator</div>
    <div class="success">Success: Operation completed</div>
    <div class="error">Error: Please try again</div>
    <div class="left">Left navigation menu</div>
    <div class="right">Right sidebar content</div>
    <div class="circle" aria-label="Status indicator">Circle indicator</div>
    <div class="square">Square: Click to expand</div>
    <div class="small">Small: Compact view</div>
    <div class="large">Large: Detailed view</div>
    <audio src="sound1.mp3" controls aria-label="Notification sound"></audio>
    <audio src="sound2.wav" controls title="Alert sound"></audio>
  </body>
</html>""";

    private static final String HTML_WITH_MIXED_INDICATORS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Mixed Indicators</title>
  </head>
  <body>
    <div class="red"></div>
    <div class="green" aria-label="Success status"></div>
    <div class="left"></div>
    <div class="right" title="Right sidebar"></div>
    <div class="circle"></div>
    <div class="square">Square with text content</div>
    <div class="small"></div>
    <div class="large">Large with text content</div>
    <audio src="sound1.mp3" controls></audio>
    <audio src="sound2.wav" controls aria-label="Notification"></audio>
  </body>
</html>""";

    private static final String HTML_WITH_MEANINGFUL_TEXT = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Meaningful Text</title>
  </head>
  <body>
    <div class="red">Error: Please check your input</div>
    <div class="green">Success: Data saved successfully</div>
    <div class="left">Navigation menu on the left side</div>
    <div class="right">Additional information on the right</div>
    <div class="circle">Status: Online</div>
    <div class="square">Action: Click to proceed</div>
    <div class="small">View: Compact mode</div>
    <div class="large">View: Detailed mode</div>
  </body>
</html>""";

    private static final String HTML_WITH_NO_SENSORY_ISSUES = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>No Sensory Issues</title>
  </head>
  <body>
    <h1>Page Title</h1>
    <p>This is a paragraph with meaningful content.</p>
    <button>Click Me</button>
    <a href="#">Link to page</a>
    <img src="image.jpg" alt="Descriptive image"/>
    <div>Regular content div</div>
  </body>
</html>""";

    @Autowired
    private IHtmlParser htmlParser;
    @Autowired
    private NoSingleSensoryCharacteristicChecker issueChecker;

    @Test
    void testColorOnlyIndicators() {
        Document document = htmlParser.parse(HTML_WITH_COLOR_ONLY_INDICATORS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(11, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.NO_SINGLE_SENSORY_CHARACTERISTIC, issue.issueType());
            Assertions.assertEquals(-1, issue.id());
            Assertions.assertEquals(-1, issue.scanId());
        }
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("red"));
        Assertions.assertTrue(htmlSnippets.contains("green"));
        Assertions.assertTrue(htmlSnippets.contains("success"));
        Assertions.assertTrue(htmlSnippets.contains("error"));
        Assertions.assertTrue(htmlSnippets.contains("warning"));
    }

    @Test
    void testPositionOnlyIndicators() {
        Document document = htmlParser.parse(HTML_WITH_POSITION_ONLY_INDICATORS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(10, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("left"));
        Assertions.assertTrue(htmlSnippets.contains("right"));
        Assertions.assertTrue(htmlSnippets.contains("top"));
        Assertions.assertTrue(htmlSnippets.contains("bottom"));
        Assertions.assertTrue(htmlSnippets.contains("center"));
    }

    @Test
    void testShapeOnlyIndicators() {
        Document document = htmlParser.parse(HTML_WITH_SHAPE_ONLY_INDICATORS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(9, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("circle"));
        Assertions.assertTrue(htmlSnippets.contains("square"));
        Assertions.assertTrue(htmlSnippets.contains("triangle"));
        Assertions.assertTrue(htmlSnippets.contains("diamond"));
        Assertions.assertTrue(htmlSnippets.contains("arrow"));
    }

    @Test
    void testSizeOnlyIndicators() {
        Document document = htmlParser.parse(HTML_WITH_SIZE_ONLY_INDICATORS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(9, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("small"));
        Assertions.assertTrue(htmlSnippets.contains("large"));
        Assertions.assertTrue(htmlSnippets.contains("big"));
        Assertions.assertTrue(htmlSnippets.contains("tiny"));
        Assertions.assertTrue(htmlSnippets.contains("huge"));
    }

    @Test
    void testAudioNoAlternatives() {
        Document document = htmlParser.parse(HTML_WITH_AUDIO_NO_ALTERNATIVES);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("sound1.mp3"));
        Assertions.assertTrue(htmlSnippets.contains("sound2.wav"));
        Assertions.assertTrue(htmlSnippets.contains("sound3.ogg"));
    }

    @Test
    void testGoodAlternatives() {
        Document document = htmlParser.parse(HTML_WITH_GOOD_ALTERNATIVES);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testMixedIndicators() {
        Document document = htmlParser.parse(HTML_WITH_MIXED_INDICATORS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        String htmlSnippets = issues.stream()
            .map(Issue::htmlSnippet)
            .reduce("", String::concat);
        
        Assertions.assertTrue(htmlSnippets.contains("red"));
        Assertions.assertTrue(htmlSnippets.contains("left"));
        Assertions.assertTrue(htmlSnippets.contains("circle"));
        Assertions.assertTrue(htmlSnippets.contains("small"));
        Assertions.assertTrue(htmlSnippets.contains("sound1.mp3"));
    }

    @Test
    void testMeaningfulText() {
        Document document = htmlParser.parse(HTML_WITH_MEANINGFUL_TEXT);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testNoSensoryIssues() {
        Document document = htmlParser.parse(HTML_WITH_NO_SENSORY_ISSUES);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testEmptyDocument() {
        Document document = htmlParser.parse("<!doctype html><html><body></body></html>");

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }
}
