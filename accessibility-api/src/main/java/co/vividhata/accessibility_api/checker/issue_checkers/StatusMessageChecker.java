package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;

@Service
public class StatusMessageChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.STATUS_MESSAGE_MISSING;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        NodeList nodeList = document.getElementsByTagName("*");

        for (int i = 0; i < nodeList.getLength(); i++) {
            Element element = (Element) nodeList.item(i);
            String role = element.getAttribute("role");
            String ariaLive = element.getAttribute("aria-live");
            String style = element.getAttribute("style");
            String ariaHidden = element.getAttribute("aria-hidden");
            String textContent = element.getTextContent();

            if (textContent != null && !textContent.replaceAll("\\s+", "").isEmpty() && !("status".equalsIgnoreCase(role) || "alert".equalsIgnoreCase(role) || "polite".equalsIgnoreCase(ariaLive) || "assertive".equalsIgnoreCase(ariaLive)) && !(style.contains("display:none") || style.contains("visibility:hidden") || "true".equalsIgnoreCase(ariaHidden))) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
            }
        }
        return issues;
    }
}