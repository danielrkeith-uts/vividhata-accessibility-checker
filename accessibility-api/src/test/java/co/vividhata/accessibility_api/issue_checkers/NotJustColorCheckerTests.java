package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.NotJustColorChecker;
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
public class NotJustColorCheckerTests {

    @Autowired
    private NotJustColorChecker issueChecker;
    
    @Autowired
    private IHtmlParser htmlParser;

    @Test
    void testColorOnlyIndicatorsInClassName() {
        String html = """
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
            <div class="pass"></div>
            <div class="fail"></div>
            <div class="good"></div>
            <div class="bad"></div>
            <div class="positive"></div>
            <div class="negative"></div>
            <div class="active"></div>
            <div class="inactive"></div>
            <div class="normal-style">Normal element</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(17, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.NOT_JUST_COLOR, issue.issueType());
        }
    }

    @Test
    void testColorOnlyIndicatorsInId() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Color Only ID Indicators</title>
          </head>
          <body>
            <div id="red"></div>
            <div id="green"></div>
            <div id="success"></div>
            <div id="error"></div>
            <div id="warning"></div>
            <div id="danger"></div>
            <div id="info"></div>
            <div id="primary"></div>
            <div id="secondary"></div>
            <div id="normal-element">Normal element</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(9, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.NOT_JUST_COLOR, issue.issueType());
        }
    }

    @Test
    void testColorOnlyInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Color Only in Style</title>
          </head>
          <body>
            <div style="color: red;"></div>
            <div style="background-color: green;"></div>
            <div style="border-color: blue;"></div>
            <div style="color: red; background-color: yellow;"></div>
            <div style="color: red; border: 1px solid black;"></div>
            <div style="color: red; font-weight: bold;"></div>
            <div style="color: red; text-decoration: underline;"></div>
            <div style="background-color: green; border: 2px solid;"></div>
            <div style="normal-style: value;">Normal element</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(4, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.NOT_JUST_COLOR, issue.issueType());
        }
    }

    @Test
    void testElementsWithAlternativeIndicators() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Elements with Alternative Indicators</title>
          </head>
          <body>
            <div class="red" aria-label="Error status"></div>
            <div class="green" aria-labelledby="success-label"></div>
            <div class="success" title="Success indicator"></div>
            <div class="error" alt="Error message"></div>
            <div class="warning" data-status="warning"></div>
            <div class="danger" data-state="danger"></div>
            <div class="info" data-type="info"></div>
            <div class="primary" data-role="primary"></div>
            <div class="secondary" role="secondary"></div>
            <div class="red" style="border: 1px solid;"></div>
            <div class="green" style="font-weight: bold;"></div>
            <div class="success" style="text-decoration: underline;"></div>
            <div class="error" style="background-image: url('icon.png');"></div>
            <div class="warning" style="box-shadow: 0 0 5px;"></div>
            <div class="danger" style="text-shadow: 1px 1px;"></div>
            <div class="info" style="outline: 2px solid;"></div>
            <div class="primary" style="opacity: 0.8;"></div>
            <div class="secondary" style="visibility: visible;"></div>
            <div class="red">Error message</div>
            <div class="green">Success message</div>
            <div class="success">Operation successful</div>
            <div class="error">Operation failed</div>
            <div class="warning">Warning message</div>
            <div class="danger">Danger alert</div>
            <div class="info">Information</div>
            <div class="primary">Primary action</div>
            <div class="secondary">Secondary action</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testMixedColorViolations() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Mixed Color Violations</title>
          </head>
          <body>
            <div class="red"></div>
            <div class="green" aria-label="Success"></div>
            <div class="success"></div>
            <div class="error" title="Error message"></div>
            <div class="warning"></div>
            <div class="danger" style="border: 1px solid;"></div>
            <div class="info"></div>
            <div class="primary">Primary action</div>
            <div class="secondary"></div>
            <div class="status-red"></div>
            <div class="state-green" data-status="active"></div>
            <div class="indicator-blue"></div>
            <div class="flag-yellow" role="flag"></div>
            <div class="marker-orange"></div>
            <div class="badge-success">Success</div>
            <div class="label-error"></div>
            <div class="highlight-warning"></div>
            <div class="emphasis-danger" style="font-weight: bold;"></div>
            <div class="alert-info"></div>
            <div class="notification-primary"></div>
            <div class="message-secondary"></div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(13, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.NOT_JUST_COLOR, issue.issueType());
        }
    }

    @Test
    void testNoColorViolations() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>No Color Violations</title>
          </head>
          <body>
            <div class="normal-style">Normal element</div>
            <div class="container">Container element</div>
            <div class="wrapper">Wrapper element</div>
            <div class="content">Content element</div>
            <div class="header">Header element</div>
            <div class="footer">Footer element</div>
            <div class="sidebar">Sidebar element</div>
            <div class="main">Main content</div>
            <div class="navigation">Navigation</div>
            <div class="menu">Menu</div>
            <div class="button">Button</div>
            <div class="link">Link</div>
            <div class="form">Form</div>
            <div class="input">Input</div>
            <div class="label">Label</div>
            <div class="text">Text content</div>
            <div class="title">Title</div>
            <div class="subtitle">Subtitle</div>
            <div class="description">Description</div>
            <div class="caption">Caption</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
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
}
