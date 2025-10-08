package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.*;

import java.util.*;

@Service
public class HelpAvailableChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.HELP_NOT_AVAILABLE;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        String[] tagsToCheck = {"input", "textarea", "select"};

        for (String tag : tagsToCheck) {
            NodeList nodes = document.getElementsByTagName(tag);
            for (int i = 0; i < nodes.getLength(); i++) {
                Element element = (Element) nodes.item(i);

                if ("hidden".equalsIgnoreCase(element.getAttribute("type")) ||
                        "false".equalsIgnoreCase(element.getAttribute("aria-enabled"))) {
                    continue;
                }

                if (!hasHelp(element)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                }
            }
        }

        return issues;
    }

    private boolean hasHelp(Element element) {
        Document doc = element.getOwnerDocument();

        String ariaDesc = element.getAttribute("aria-describedby");
        if (!ariaDesc.isEmpty()) {
            Node describedNode = doc.getElementById(ariaDesc);
            if (describedNode != null && !describedNode.getTextContent().trim().isEmpty()) {
                return true;
            }
        }

        Node sibling = element.getNextSibling();
        while (sibling != null) {
            if (sibling.getNodeType() == Node.ELEMENT_NODE) {
                String tag = ((Element) sibling).getTagName().toLowerCase();
                if ((tag.equals("small") || tag.equals("span")) &&
                        !sibling.getTextContent().trim().isEmpty()) {
                    return true;
                }
            }
            sibling = sibling.getNextSibling();
        }

        String placeholder = element.getAttribute("placeholder");
        if (!placeholder.isEmpty()) {
            return true;
        }

        Node prev = element.getPreviousSibling();
        while (prev != null) {
            if (prev.getNodeType() == Node.ELEMENT_NODE) {
                String tag = ((Element) prev).getTagName().toLowerCase();
                if ((tag.equals("p") || tag.equals("div")) &&
                        !prev.getTextContent().trim().isEmpty()) {
                    return true;
                }
            }
            prev = prev.getPreviousSibling();
        }

        return element.hasAttribute("pattern");
    }
}
