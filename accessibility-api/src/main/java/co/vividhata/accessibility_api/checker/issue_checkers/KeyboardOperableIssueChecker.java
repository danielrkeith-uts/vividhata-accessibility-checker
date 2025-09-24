package co.vividhata.accessibility_api.checker.issue_checkers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.springframework.stereotype.Service;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;

@Service
public class KeyboardOperableIssueChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.KEYBOARD_OPERABLE;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        NodeList all = document.getElementsByTagName("*");

        for (int i = 0; i < all.getLength(); i++) {
            Node node = all.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;
            Element element = (Element) node;

            boolean hasMouseHandlers = element.hasAttribute("onclick") || element.hasAttribute("onmousedown") || element.hasAttribute("onmouseup");
            boolean hasKeyboardHandlers = element.hasAttribute("onkeydown") || element.hasAttribute("onkeyup");

            if (hasMouseHandlers && !hasKeyboardHandlers) {
                String id = element.getAttribute("id");
                String onclick = element.getAttribute("onclick");
                StringBuilder sb = new StringBuilder();
                sb.append("<div");
                if (id != null && !id.isEmpty()) sb.append(" id=\"").append(id).append("\"");
                if (onclick != null && !onclick.isEmpty()) sb.append(" onclick=\"").append(onclick).append("\"");
                sb.append("></div>");
                issues.add(new Issue(-1, -1, ISSUE_TYPE, sb.toString()));
            }
        
        }

        return issues;
    }
}
