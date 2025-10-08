package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.List;
import java.util.ArrayList;

@Service
public class ErrorSuggestionChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.ERROR_SUGGESTION_NOT_PROVIDED;
    
    @Autowired
    private INodeParser nodeParser;
   
    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        
        String[] tagstoCheck = {"input", "textarea", "select"};
        for (String tag : tagstoCheck) {
            checkInputErrors(document, tag, issues);
        }
        
        return issues;
    }

    private void checkInputErrors(Document document, String tagName, List<Issue> issues) {
        NodeList nodes = document.getElementsByTagName(tagName);
        for (int i = 0; i < nodes.getLength(); i++) {
            Element element = (Element) nodes.item(i);

            boolean isRequired = "true".equalsIgnoreCase(element.getAttribute("aria-required"));
            boolean hasPattern = element.hasAttribute("pattern");
            boolean hasMin = element.hasAttribute("min");
            boolean hasMax = element.hasAttribute("max");

            if (isRequired || hasPattern || hasMin || hasMax) {
                boolean hasErrorMessage = false;

                String errorId = element.getAttribute("aria-describedby");
                if (errorId != null && !errorId.isEmpty()) {
                    Node describedNode = document.getElementById(errorId);
                    hasErrorMessage = describedNode != null && !describedNode.getTextContent().trim().isEmpty();
                }
                
                if (!hasErrorMessage) {
                    Node next = element.getNextSibling();
                    while (next != null) {
                        if (next.getNodeType() == Node.ELEMENT_NODE) {
                            Element nextElement = (Element) next;
                            String text = nextElement.getTextContent().trim();
                            if (!text.isEmpty() && nextElement.getTagName().matches("span|div|p")) {
                                hasErrorMessage = true;
                                break;
                            }
                        }
                        next = next.getNextSibling();
                    }
                }

                if (!hasErrorMessage) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                }
            }
        }
    }
}