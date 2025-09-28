package co.vividhata.accessibility_api.link;

import co.vividhata.accessibility_api.model.Link;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;

@Service
public class LinkService implements ILinkService {

    @Autowired
    private ILinkRepository linkRepository;

    @Override
    public List<Link> getLinks(int scanId) {
        return linkRepository.getAll(scanId);
    }

    @Override
    public void findLinksAndSaveToScan(Document document, int scanId) {
        List<String> links = findLinks(document);

        for (String link : links) {
            linkRepository.create(scanId, link);
        }
    }

    public List<String> findLinks(Document document) {
        List<String> links = new ArrayList<>();

        NodeList anchorNodeList = document.getElementsByTagName("a");

        for (int i = 0; i < anchorNodeList.getLength(); i++) {
            Node anchorNode = anchorNodeList.item(i);
            NamedNodeMap anchorAttributes = anchorNode.getAttributes();
            Node hrefAttribute = anchorAttributes.getNamedItem("href");

            if (hrefAttribute != null) {
                String hrefTextContent = hrefAttribute.getTextContent();
                if (!hrefTextContent.isEmpty()) {
                    links.add(hrefTextContent);
                }
            }
        }

        return links;
    }
}
