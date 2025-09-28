package co.vividhata.accessibility_api;

import co.vividhata.accessibility_api.link.LinkService;
import co.vividhata.accessibility_api.util.IHtmlParser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;

import java.util.List;

@SpringBootTest
public class LinkServiceTests {

    private static final String HTML_THREE_LINKS = """
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Test Links</title>
</head>
<body>
  <h1>Test Links Page</h1>
  <ul>
    <li><a href="https://example.com">Example</a></li>
    <li><a href="https://google.com">Google</a></li>
    <li><a href="https://wikipedia.org">Wikipedia</a></li>
    <li><a href="">Nothing</a></li>
    <li><a></a></li>
  </ul>
</body>
</html>""";

    @Autowired
    private IHtmlParser htmlParser;

    private final LinkService linkService = new LinkService();

    @Test
    public void testFindLinks() {
        Document document = htmlParser.parse(HTML_THREE_LINKS);

        List<String> links = linkService.findLinks(document);

        Assertions.assertEquals(3, links.size());
    }

}
