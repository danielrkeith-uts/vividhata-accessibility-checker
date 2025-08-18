package co.vividhata.accessibility_api.services;

import org.w3c.dom.Document;

public interface IHtmlParseService {
    Document parse(String html);
}
