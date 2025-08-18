package co.vividhata.accessibility_api.services;

import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;
import org.w3c.dom.Node;

@SpringBootTest
public class JSoupHtmlParseServiceTests {

    private static final String HTML_A = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Unit Test Fixture</title>
  </head>
  <body>
    <h1 id="title">Hello, Test!</h1>
    <button id="btn">Click Me</button>
  </body>
</html>""";

    private final JSoupHtmlParseService htmlParseService = new JSoupHtmlParseService();

    @Test
    void testParseAndGetHeading() {
        Document document = htmlParseService.parse(HTML_A);
        Node heading = document.getElementsByTagName("h1").item(0);
        Assertions.assertEquals("Hello, Test!", heading.getTextContent());
    }

}
