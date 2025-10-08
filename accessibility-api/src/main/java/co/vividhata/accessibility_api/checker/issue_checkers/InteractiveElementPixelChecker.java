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

import java.util.List;
import java.util.ArrayList;

@Service
public class InteractiveElementPixelChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.ELEMENT_TOO_SMALL;
    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        
        NodeList allNodes = document.getElementsByTagName("*");

        for (int i = 0; i < allNodes.getLength(); i++) {
            Element element = (Element) allNodes.item(i);

            if (isInteractive(element) && isTooSmall(element)) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
            }
        }

        return issues;
    }

    private boolean isInteractive(Element element) {
        String[] interactiveTags = {"a", "button", "input", "textarea", "select", "img", "div", "span"};
        String tagName = element.getTagName().toLowerCase();

        for (String tag : interactiveTags) {
            if (tag.equals(tagName)) {
                return true;
            }
        }

        String role = element.getAttribute("role");
        if (role.equals("button") || role.equals("link") || role.equals("menuitem") || role.equals("tab")) {
            return true;
        }

        String[] events = {"onclick", "onkeypress", "onkeydown", "onkeyup", "onmouseover", "onfocus", "onmousedown", "onmouseup"};
        for (String event : events) {
            if (element.hasAttribute(event)) {
                return true;
            }
        }

        String tabindex = element.getAttribute("tabindex");
        if (!tabindex.isEmpty()) {
            try {
                if (Integer.parseInt(tabindex) >= 0) {
                    return true;
                }
            } catch (NumberFormatException ignored) {}
        }
        return false;
    }

    private boolean isTooSmall(Element element) {
        String style = element.getAttribute("style");
        int width = 0;
        int height = 0;

        if (!style.isEmpty()) {
            String[] styles = style.split(";");

            for (String s : styles) {
                s = s.trim().toLowerCase();
                if (s.startsWith("width:")) width = parsePixelValue(s);
                if (s.startsWith("height:")) height = parsePixelValue(s);
            }
        }

        if (element.hasAttribute("width")) {
            try {
                width = Integer.parseInt(element.getAttribute("width").replace("px", "").trim());
            } catch (Exception _) {}
        }

        if (element.hasAttribute("height")) {
            try {
                height = Integer.parseInt(element.getAttribute("height").replace("px", "").trim());
            } catch (Exception _) {}
        }

        return width < 24 || height < 24;
    }

    private int parsePixelValue(String style) {
        try {
            String value = style.split(":")[1].trim();
            if (value.endsWith("px")) {
                value = value.replace("px", "").trim();
            }
            return Integer.parseInt(value);
        } catch (Exception e) {
            return 0;
        }
    }
}