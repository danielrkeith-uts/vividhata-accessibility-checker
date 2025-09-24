package co.vividhata.accessibility_api.checker.issue_checkers;

import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;

public class MultipleWaysToNavigateIssueChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.MULTIPLE_WAYS_TO_NAVIGATE;

    @Override
    public List<Issue> check(Document document){
        List<Issue> issues = new ArrayList<>();

        boolean hasSkipLink = hasSkipLink(document);
        boolean hasSearch = hasSearch(document);
        boolean hasSitemap = hasSitemapLink(document);

        if (!(hasSkipLink || hasSearch || hasSitemap)) {
            issues.add(new Issue(-1, -1, ISSUE_TYPE, "No skip link, search, or sitemap detected"));
        }
        return issues;
    }

    private boolean hasSkipLink(Document document) {
        NodeList anchorNodes = document.getElementsByTagName("a");
        for (int i = 0; i < anchorNodes.getLength(); i++) {
            Node node = anchorNodes.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;
            Element element = (Element) node;
            String href = element.getAttribute("href");
            String text = (element.getTextContent() == null ? "" : element.getTextContent()).toLowerCase();
            if ((href != null && href.startsWith("#") &&
                 (href.toLowerCase().contains("main") || href.toLowerCase().contains("content") || href.toLowerCase().contains("skip")))
                || text.contains("skip")) {
                return true;
            }
        }
        return false;
    }

    private boolean hasSearch(Document document) {
        NodeList formNodes = document.getElementsByTagName("form");
        for (int i = 0; i < formNodes.getLength(); i++) {
            Node node = formNodes.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;
            Element element = (Element) node;
            if ("search".equalsIgnoreCase(element.getAttribute("role"))) return true;
        }
        NodeList inputNodes = document.getElementsByTagName("input");
        for (int i = 0; i < inputNodes.getLength(); i++) {
            Node node = inputNodes.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;
            Element element = (Element) node;
            if ("search".equalsIgnoreCase(element.getAttribute("type"))) return true;
        }
        return false;
    }

    private boolean hasSitemapLink(Document document) {
        NodeList anchorNodes = document.getElementsByTagName("a");
        for (int i = 0; i < anchorNodes.getLength(); i++) {
            Node node = anchorNodes.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;
            Element element = (Element) node;
            String href = element.getAttribute("href").toLowerCase();
            if (href.contains("sitemap")) return true;
        }
        return false;
    }
    
}
