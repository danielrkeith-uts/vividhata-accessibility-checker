package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.LineHeightSpacingChecker;
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
public class LineHeightSpacingCheckerTests {

    @Autowired
    private LineHeightSpacingChecker issueChecker;
    
    @Autowired
    private IHtmlParser htmlParser;

    @Test
    void testLineHeightViolationsInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Line Height Violations</title>
          </head>
          <body>
            <p style="line-height: 1.2;">Text with tight line height</p>
            <p style="line-height: 1.0;">Text with very tight line height</p>
            <p style="line-height: 20px;">Text with tight line height in pixels</p>
            <p style="line-height: 1.0em;">Text with tight line height in em</p>
            <p style="line-height: 1.5;">Good line height</p>
            <p style="line-height: normal;">Normal line height</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(4, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
            Assertions.assertTrue(issue.htmlSnippet().contains("line-height"));
        }
    }

    @Test
    void testLineHeightViolationsInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Line Height Class Violations</title>
          </head>
          <body>
            <p class="line-height-1">Text with tight line height class</p>
            <p class="line-height-1-2">Text with tight line height class</p>
            <p class="tight">Text with tight class</p>
            <p class="compact">Text with compact class</p>
            <p class="condensed">Text with condensed class</p>
            <p class="good-spacing">Text with good spacing</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testLetterSpacingViolationsInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Letter Spacing Violations</title>
          </head>
          <body>
            <p style="letter-spacing: 0.05em;">Text with tight letter spacing</p>
            <p style="letter-spacing: 1px;">Text with tight letter spacing in pixels</p>
            <p style="letter-spacing: 0.1em;">Text with tight letter spacing in em</p>
            <p style="letter-spacing: 0.15em;">Good letter spacing</p>
            <p style="letter-spacing: normal;">Normal letter spacing</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
            Assertions.assertTrue(issue.htmlSnippet().contains("letter-spacing"));
        }
    }

    @Test
    void testLetterSpacingViolationsInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Letter Spacing Class Violations</title>
          </head>
          <body>
            <p class="letter-spacing-tight">Text with tight letter spacing class</p>
            <p class="letter-spacing-compact">Text with compact letter spacing class</p>
            <p class="tight-spacing">Text with tight spacing class</p>
            <p class="good-spacing">Text with good spacing</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testWordSpacingViolationsInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Word Spacing Violations</title>
          </head>
          <body>
            <p style="word-spacing: 0.1em;">Text with tight word spacing</p>
            <p style="word-spacing: 2px;">Text with tight word spacing in pixels</p>
            <p style="word-spacing: 0.15em;">Text with tight word spacing in em</p>
            <p style="word-spacing: 0.2em;">Good word spacing</p>
            <p style="word-spacing: normal;">Normal word spacing</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
            Assertions.assertTrue(issue.htmlSnippet().contains("word-spacing"));
        }
    }

    @Test
    void testWordSpacingViolationsInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Word Spacing Class Violations</title>
          </head>
          <body>
            <p class="word-spacing-tight">Text with tight word spacing class</p>
            <p class="word-spacing-compact">Text with compact word spacing class</p>
            <p class="tight-words">Text with tight words class</p>
            <p class="good-spacing">Text with good spacing</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testParagraphSpacingViolationsInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Paragraph Spacing Violations</title>
          </head>
          <body>
            <p style="margin-bottom: 0;">Text with no bottom margin</p>
            <p style="margin-bottom: 0px;">Text with zero bottom margin</p>
            <p style="margin-bottom: 1px;">Text with very small bottom margin</p>
            <p style="margin-bottom: 0.1em;">Text with small bottom margin in em</p>
            <p style="margin-bottom: 2em;">Good bottom margin</p>
            <p style="margin: 0;">Text with no margin</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
            Assertions.assertTrue(issue.htmlSnippet().contains("margin"));
        }
    }

    @Test
    void testParagraphSpacingViolationsInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Paragraph Spacing Class Violations</title>
          </head>
          <body>
            <p class="no-margin">Text with no margin class</p>
            <p class="zero-margin">Text with zero margin class</p>
            <p class="tight-margin">Text with tight margin class</p>
            <p class="margin-0">Text with margin-0 class</p>
            <p class="good-spacing">Text with good spacing</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(4, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testGoodSpacingNoViolations() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Good Spacing</title>
          </head>
          <body>
            <p style="line-height: 1.5;">Text with good line height</p>
            <p style="line-height: 2.0;">Text with excellent line height</p>
            <p style="letter-spacing: 0.15em;">Text with good letter spacing</p>
            <p style="word-spacing: 0.2em;">Text with good word spacing</p>
            <p style="margin-bottom: 2em;">Text with good margin</p>
            <p class="good-spacing">Text with good spacing class</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testMixedViolations() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Mixed Violations</title>
          </head>
          <body>
            <p style="line-height: 1.2; letter-spacing: 0.05em;">Multiple violations</p>
            <p class="tight compact">Multiple class violations</p>
            <p style="line-height: 1.5;">Good line height</p>
            <p class="no-margin">No margin violation</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testEmptyDocument() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Empty Document</title>
          </head>
          <body>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testComplexCSSValues() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Complex CSS Values</title>
          </head>
          <body>
            <p style="line-height: 1.2em; margin: 10px 0 0 0;">Complex line height</p>
            <p style="letter-spacing: 0.05rem; word-spacing: 0.1em;">Complex spacing</p>
            <p style="line-height: calc(1em + 0.2em);">Calculated line height</p>
            <p style="line-height: 1.5; margin-bottom: 1.5em;">Good values</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.LINE_HEIGHT_SPACING_VIOLATION, issue.issueType());
        }
    }
}
