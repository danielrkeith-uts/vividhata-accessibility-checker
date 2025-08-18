package co.vividhata.accessibility_api.services;

import org.jsoup.helper.W3CDom;
import org.jsoup.parser.HtmlTreeBuilder;
import org.jsoup.parser.Parser;
import org.springframework.stereotype.Service;

@Service
public class JSoupHtmlParseService implements IHtmlParseService {

    Parser jsoupParser = new Parser(new HtmlTreeBuilder());
    W3CDom w3CDom = new W3CDom();

    @Override
    public org.w3c.dom.Document parse(String html) {
        org.jsoup.nodes.Document jsoupDocument = jsoupParser.parseInput(html, "");
        return w3CDom.fromJsoup(jsoupDocument);
    }

}
