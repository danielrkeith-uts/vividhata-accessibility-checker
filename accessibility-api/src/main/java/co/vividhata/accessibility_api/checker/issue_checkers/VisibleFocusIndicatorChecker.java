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
public class VisibleFocusIndicatorChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.FOCUS_INDICATOR_HIDDEN;
    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        NodeList allNodes = document.getElementsByTagName("*");
        for (int i = 0; i < allNodes.getLength(); i++) {
            Element element = (Element) allNodes.item(i);
            if (isFocus(element) && hidesFocus(element)) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
            }
        }
        return issues;
    }
    private boolean isFocus(Element element) {
        String[] interactiveTags = {"a", "button", "input", "select", "textarea", "img", "div", "span"};
        String tagName = element.getTagName().toLowerCase();
        for (String tag : interactiveTags) {
            if (tag.equals(tagName)) {
                return true;
            }
        }
        
        String role = element.getAttribute("role");
        if (role.equals("button") || role.equals("link") || role.equals("checkbox") || role.equals("radio") || role.equals("menuitem") || role.equals("tab")) {
            return true;
        }

        String tabindex = element.getAttribute("tabindex");
        return !tabindex.isEmpty() && Integer.parseInt(tabindex) >= 0;
    }

    private boolean hidesFocus(Element element) {
        String style = element.getAttribute("style");
        if (style.isEmpty()) {
            return false;
        }
        style = style.toLowerCase().replaceAll("\\s+", "");
        return style.contains("outline:none") || style.contains("display:none") || style.contains("visibility:hidden") || style.contains("opacity:0");
    }

}
