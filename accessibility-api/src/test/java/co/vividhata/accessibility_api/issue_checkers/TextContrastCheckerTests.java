package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.TextContrastChecker;
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
public class TextContrastCheckerTests {

    @Autowired
    private TextContrastChecker issueChecker;
    
    @Autowired
    private IHtmlParser htmlParser;

    @Test
    void testLowContrastInStyle() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Low Contrast in Style</title>
          </head>
          <body>
            <p style="color: gray; background-color: lightgray;">Low contrast text</p>
            <p style="color: yellow; background-color: white;">Low contrast text</p>
            <p style="color: lightblue; background-color: white;">Low contrast text</p>
            <p style="color: pink; background-color: white;">Low contrast text</p>
            <p style="color: black; background-color: white;">Good contrast text</p>
            <p style="color: white; background-color: black;">Good contrast text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_CONTRAST_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testLowContrastInClassName() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Low Contrast in Class Name</title>
          </head>
          <body>
            <p class="text-gray bg-lightgray">Low contrast text</p>
            <p class="text-yellow bg-white">Low contrast text</p>
            <p class="text-lightblue bg-white">Low contrast text</p>
            <p class="text-pink bg-white">Low contrast text</p>
            <p class="text-black bg-white">Good contrast text</p>
            <p class="text-white bg-black">Good contrast text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_CONTRAST_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testLowContrastInId() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Low Contrast in ID</title>
          </head>
          <body>
            <p id="text-gray-bg-lightgray">Low contrast text</p>
            <p id="text-yellow-bg-white">Low contrast text</p>
            <p id="text-lightblue-bg-white">Low contrast text</p>
            <p id="text-pink-bg-white">Low contrast text</p>
            <p id="text-black-bg-white">Good contrast text</p>
            <p id="text-white-bg-black">Good contrast text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(3, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_CONTRAST_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testGoodContrast() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Good Contrast</title>
          </head>
          <body>
            <p style="color: black; background-color: white;">Good contrast text</p>
            <p style="color: white; background-color: black;">Good contrast text</p>
            <p style="color: darkblue; background-color: white;">Good contrast text</p>
            <p style="color: darkred; background-color: white;">Good contrast text</p>
            <p style="color: white; background-color: darkblue;">Good contrast text</p>
            <p style="color: white; background-color: darkred;">Good contrast text</p>
            <p class="text-black bg-white">Good contrast text</p>
            <p class="text-white bg-black">Good contrast text</p>
            <p class="text-darkblue bg-white">Good contrast text</p>
            <p class="text-darkred bg-white">Good contrast text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testMixedContrastViolations() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Mixed Contrast Violations</title>
          </head>
          <body>
            <p style="color: gray; background-color: lightgray;">Low contrast text</p>
            <p style="color: black; background-color: white;">Good contrast text</p>
            <p class="text-yellow bg-white">Low contrast text</p>
            <p class="text-white bg-black">Good contrast text</p>
            <p id="text-lightblue-bg-white">Low contrast text</p>
            <p id="text-darkblue-bg-white">Good contrast text</p>
            <div style="color: pink; background-color: white;">Low contrast text</div>
            <div style="color: darkred; background-color: white;">Good contrast text</div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_CONTRAST_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testNoTextContent() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>No Text Content</title>
          </head>
          <body>
            <div style="color: gray; background-color: lightgray;"></div>
            <div class="text-yellow bg-white"></div>
            <div id="text-lightblue-bg-white"></div>
            <img src="image.jpg" alt="Image">
            <br>
            <hr>
            <input type="text">
            <button>Button</button>
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

    @Test
    void testComplexColorPatterns() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Complex Color Patterns</title>
          </head>
          <body>
            <p class="text-red bg-white">Good contrast text</p>
            <p class="text-green bg-white">Good contrast text</p>
            <p class="text-blue bg-white">Good contrast text</p>
            <p class="text-yellow bg-white">Low contrast text</p>
            <p class="text-orange bg-white">Low contrast text</p>
            <p class="text-purple bg-white">Good contrast text</p>
            <p class="text-pink bg-white">Low contrast text</p>
            <p class="text-black bg-white">Good contrast text</p>
            <p class="text-white bg-black">Good contrast text</p>
            <p class="text-gray bg-white">Low contrast text</p>
            <p class="color-red bg-white">Good contrast text</p>
            <p class="color-yellow bg-white">Low contrast text</p>
            <p class="red-text bg-white">Good contrast text</p>
            <p class="yellow-text bg-white">Low contrast text</p>
            <p class="bg-red text-white">Good contrast text</p>
            <p class="bg-yellow text-white">Low contrast text</p>
            <p class="background-red text-white">Good contrast text</p>
            <p class="background-yellow text-white">Low contrast text</p>
            <p class="red-bg text-white">Good contrast text</p>
            <p class="yellow-bg text-white">Low contrast text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(15, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_CONTRAST_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testHexColorValues() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Hex Color Values</title>
          </head>
          <body>
            <p style="color: #000000; background-color: #ffffff;">Good contrast text</p>
            <p style="color: #ffffff; background-color: #000000;">Good contrast text</p>
            <p style="color: #ff0000; background-color: #ffffff;">Good contrast text</p>
            <p style="color: #ffff00; background-color: #ffffff;">Low contrast text</p>
            <p style="color: #ffa500; background-color: #ffffff;">Low contrast text</p>
            <p style="color: #ffc0cb; background-color: #ffffff;">Low contrast text</p>
            <p style="color: #808080; background-color: #ffffff;">Low contrast text</p>
            <p style="color: #0000ff; background-color: #ffffff;">Good contrast text</p>
            <p style="color: #008000; background-color: #ffffff;">Good contrast text</p>
            <p style="color: #800080; background-color: #ffffff;">Good contrast text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_CONTRAST_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testShortHexColorValues() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Short Hex Color Values</title>
          </head>
          <body>
            <p style="color: #000; background-color: #fff;">Good contrast text</p>
            <p style="color: #fff; background-color: #000;">Good contrast text</p>
            <p style="color: #f00; background-color: #fff;">Good contrast text</p>
            <p style="color: #ff0; background-color: #fff;">Low contrast text</p>
            <p style="color: #fa0; background-color: #fff;">Low contrast text</p>
            <p style="color: #fcc; background-color: #fff;">Low contrast text</p>
            <p style="color: #888; background-color: #fff;">Low contrast text</p>
            <p style="color: #00f; background-color: #fff;">Good contrast text</p>
            <p style="color: #080; background-color: #fff;">Good contrast text</p>
            <p style="color: #808; background-color: #fff;">Good contrast text</p>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(5, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_CONTRAST_VIOLATION, issue.issueType());
        }
    }

    @Test
    void testNestedTextElements() {
        String html = """
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="utf-8"/>
            <title>Nested Text Elements</title>
          </head>
          <body>
            <div style="color: gray; background-color: lightgray;">
              <p>Low contrast text in paragraph</p>
              <span>Low contrast text in span</span>
              <div>Low contrast text in div</div>
            </div>
            <div style="color: black; background-color: white;">
              <p>Good contrast text in paragraph</p>
              <span>Good contrast text in span</span>
              <div>Good contrast text in div</div>
            </div>
            <div class="text-yellow bg-white">
              <p>Low contrast text in paragraph</p>
              <span>Low contrast text in span</span>
              <div>Low contrast text in div</div>
            </div>
            <div class="text-black bg-white">
              <p>Good contrast text in paragraph</p>
              <span>Good contrast text in span</span>
              <div>Good contrast text in div</div>
            </div>
          </body>
        </html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(1, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.TEXT_CONTRAST_VIOLATION, issue.issueType());
        }
    }
}
