package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.TextResizeChecker;
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
public class TextResizeCheckerTests {

    @Autowired
    private TextResizeChecker issueChecker;
    
    @Autowired
    private IHtmlParser htmlParser;

    @Test
    void testFixedFontSizeInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Fixed Font Size in Style</title>
          </head>
          <body>
            <p style="font-size: 14px;">Fixed font size text</p>
            <p style="font-size: 12pt;">Fixed font size text</p>
            <p style="font-size: 1.2em;">Relative font size text</p>
            <p style="font-size: 100%;">Relative font size text</p>
            <p style="font-size: 1rem;">Relative font size text</p>
            <p style="font-size: 16px;">Fixed font size text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testFixedFontSizeInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Fixed Font Size in Class Name</title>
          </head>
          <body>
            <p class="text-xs">Fixed font size text</p>
            <p class="text-sm">Fixed font size text</p>
            <p class="text-lg">Fixed font size text</p>
            <p class="text-xl">Fixed font size text</p>
            <p class="text-2xl">Fixed font size text</p>
            <p class="font-base">Fixed font size text</p>
            <p class="size-lg">Fixed font size text</p>
            <p class="responsive-text">Responsive text</p>
            <p class="fluid-text">Fluid text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(7, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testFixedFontSizeInId() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Fixed Font Size in ID</title>
          </head>
          <body>
            <p id="text-xs">Fixed font size text</p>
            <p id="text-sm">Fixed font size text</p>
            <p id="text-lg">Fixed font size text</p>
            <p id="text-xl">Fixed font size text</p>
            <p id="text-2xl">Fixed font size text</p>
            <p id="font-base">Fixed font size text</p>
            <p id="size-lg">Fixed font size text</p>
            <p id="responsive-text">Responsive text</p>
            <p id="fluid-text">Fluid text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(7, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testFixedDimensionsInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Fixed Dimensions in Style</title>
          </head>
          <body>
            <div style="width: 300px; height: 200px;">Fixed dimensions</div>
            <div style="width: 100%; height: auto;">Responsive dimensions</div>
            <div style="width: 50vw; height: 50vh;">Viewport dimensions</div>
            <div style="width: 400px;">Fixed width</div>
            <div style="height: 300px;">Fixed height</div>
            <div style="max-width: 500px;">Max width constraint</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(4, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testFixedDimensionsInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Fixed Dimensions in Class Name</title>
          </head>
          <body>
            <div class="w-64 h-48">Fixed dimensions</div>
            <div class="width-300 height-200">Fixed dimensions</div>
            <div class="size-400">Fixed size</div>
            <div class="fixed-300">Fixed dimensions</div>
            <div class="static-200">Fixed dimensions</div>
            <div class="responsive">Responsive dimensions</div>
            <div class="fluid">Fluid dimensions</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testOverflowHiddenInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Overflow Hidden in Style</title>
          </head>
          <body>
            <div style="overflow: hidden;">Hidden overflow</div>
            <div style="overflow:hidden;">Hidden overflow</div>
            <div style="overflow: auto;">Auto overflow</div>
            <div style="overflow: visible;">Visible overflow</div>
            <div style="overflow: scroll;">Scroll overflow</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testOverflowHiddenInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Overflow Hidden in Class Name</title>
          </head>
          <body>
            <div class="overflow-hidden">Hidden overflow</div>
            <div class="overflowhidden">Hidden overflow</div>
            <div class="hidden">Hidden overflow</div>
            <div class="clip">Clipped overflow</div>
            <div class="truncate">Truncated overflow</div>
            <div class="overflow-auto">Auto overflow</div>
            <div class="overflow-visible">Visible overflow</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(7, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testWhiteSpaceNoWrapInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>White Space No Wrap in Style</title>
          </head>
          <body>
            <div style="white-space: nowrap;">No wrap text</div>
            <div style="white-space:nowrap;">No wrap text</div>
            <div style="white-space: normal;">Normal text</div>
            <div style="white-space: pre;">Pre text</div>
            <div style="white-space: pre-wrap;">Pre wrap text</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testWhiteSpaceNoWrapInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>White Space No Wrap in Class Name</title>
          </head>
          <body>
            <div class="whitespace-nowrap">No wrap text</div>
            <div class="whitespacenowrap">No wrap text</div>
            <div class="nowrap">No wrap text</div>
            <div class="no-wrap">No wrap text</div>
            <div class="text-nowrap">No wrap text</div>
            <div class="whitespace-normal">Normal text</div>
            <div class="whitespace-pre">Pre text</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testFixedPositioningInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Fixed Positioning in Style</title>
          </head>
          <body>
            <div style="position: fixed;">Fixed position</div>
            <div style="position:fixed;">Fixed position</div>
            <div style="position: absolute;">Absolute position</div>
            <div style="position: relative;">Relative position</div>
            <div style="position: static;">Static position</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testFixedPositioningInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Fixed Positioning in Class Name</title>
          </head>
          <body>
            <div class="fixed">Fixed position</div>
            <div class="position-fixed">Fixed position</div>
            <div class="pos-fixed">Fixed position</div>
            <div class="sticky">Sticky position</div>
            <div class="position-sticky">Sticky position</div>
            <div class="pos-sticky">Sticky position</div>
            <div class="absolute">Absolute position</div>
            <div class="relative">Relative position</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(6, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testAbsolutePositioningWithFixedDimensions() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Absolute Positioning with Fixed Dimensions</title>
          </head>
          <body>
            <div style="position: absolute; width: 300px; height: 200px;">Absolute with fixed dimensions</div>
            <div style="position: absolute; width: 100%;">Absolute with responsive width</div>
            <div class="absolute w-64 h-48">Absolute with fixed dimensions</div>
            <div class="position-absolute width-300">Absolute with fixed width</div>
            <div class="pos-absolute size-400">Absolute with fixed size</div>
            <div class="absolute responsive">Absolute with responsive dimensions</div>
            <div class="relative w-64">Relative with fixed width</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testNoViolations() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>No Violations</title>
          </head>
          <body>
            <p style="font-size: 1.2em;">Relative font size text</p>
            <p style="font-size: 100%;">Relative font size text</p>
            <p style="font-size: 1rem;">Relative font size text</p>
            <div style="width: 100%; height: auto;">Responsive dimensions</div>
            <div style="width: 50vw; height: 50vh;">Viewport dimensions</div>
            <div style="overflow: auto;">Auto overflow</div>
            <div style="white-space: normal;">Normal text</div>
            <div style="position: relative;">Relative position</div>
            <div class="responsive">Responsive text</div>
            <div class="fluid">Fluid text</div>
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
            <p style="font-size: 14px;">Fixed font size text</p>
            <p style="font-size: 1.2em;">Relative font size text</p>
            <div style="width: 300px; height: 200px;">Fixed dimensions</div>
            <div style="width: 100%;">Responsive dimensions</div>
            <div style="overflow: hidden;">Hidden overflow</div>
            <div style="overflow: auto;">Auto overflow</div>
            <div style="white-space: nowrap;">No wrap text</div>
            <div style="white-space: normal;">Normal text</div>
            <div style="position: fixed;">Fixed position</div>
            <div style="position: relative;">Relative position</div>
            <div class="text-xs">Fixed font size text</div>
            <div class="responsive">Responsive text</div>
            <div class="overflow-hidden">Hidden overflow</div>
            <div class="whitespace-nowrap">No wrap text</div>
            <div class="fixed">Fixed position</div>
            <div class="absolute w-64">Absolute with fixed width</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(10, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
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
    void testComplexViolations() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Complex Violations</title>
          </head>
          <body>
            <div style="font-size: 16px; width: 400px; overflow: hidden; white-space: nowrap; position: fixed;">Complex violation</div>
            <div class="text-lg w-64 overflow-hidden whitespace-nowrap fixed">Complex violation</div>
            <div id="text-xl width-300 overflowhidden nowrap position-fixed">Complex violation</div>
            <div style="font-size: 1.2em; width: 100%; overflow: auto; white-space: normal; position: relative;">No violations</div>
            <div class="responsive fluid overflow-auto whitespace-normal relative">No violations</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(4, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_RESIZE_VIOLATION, issue.issueType());
        }
    }
}
