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
public class VisibleFocusChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.FOCUS_NOT_VISIBLE;
    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        String[] FocusTags = {"a", "button", "input", "textarea", "select"};
        for (String tag : FocusTags) {
            NodeList nodeList = document.getElementsByTagName(tag);

            for (int i = 0; i < nodeList.getLength(); i++) {
                Element element = (Element) nodeList.item(i);
                String style = element.getAttribute("style");
                String classAttr = element.getAttribute("class");

                if (style.contains("outline:none") || style.contains("display:none") || style.contains("visibility:hidden") || classAttr.toLowerCase().contains("no-focus")) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                }
            }
        }
        return issues;
    }
}
