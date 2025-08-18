package co.vividhata.accessibility_api.services;

import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

@Service
public interface IHtmlParseService {
    Document parse(String html);
}
