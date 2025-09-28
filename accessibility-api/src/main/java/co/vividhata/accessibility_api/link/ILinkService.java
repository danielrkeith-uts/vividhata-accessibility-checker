package co.vividhata.accessibility_api.link;

import co.vividhata.accessibility_api.model.Link;
import org.w3c.dom.Document;

import java.util.List;

public interface ILinkService {

    List<Link> getLinks(int scanId);

    void findLinksAndSaveToScan(Document document, int scanId);

}
