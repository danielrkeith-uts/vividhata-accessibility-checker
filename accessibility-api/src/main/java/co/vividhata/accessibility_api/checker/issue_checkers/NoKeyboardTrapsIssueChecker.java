package co.vividhata.accessibility_api.checker.issue_checkers;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.stereotype.Service;

@Service
public class NoKeyboardTrapsIssueChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.NO_KEYBOARD_TRAPS;

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

            for (String attributeName : new String[]{"onkeydown", "onkeypress"}) {
                if (element.hasAttribute(attributeName)) {
                    String handlerValue = element.getAttribute(attributeName).toLowerCase();
                    boolean blocks = handlerValue.contains("preventdefault()");
                    boolean handlesTabOrEscape = handlerValue.contains("tab") || handlerValue.contains("escape") || handlerValue.contains("esc");
                    if (blocks && !handlesTabOrEscape) {
                        issues.add(new Issue(-1, -1, ISSUE_TYPE, formatDivWithAttr(element, attributeName)));
                        break;
                    }
                }
            }

            if (element.hasAttribute("onfocus")) {
                String handlerValue = element.getAttribute("onfocus").toLowerCase();
                if (handlerValue.contains("focus()")) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, formatSelfClosing("input", element, "id", "onfocus")));
                }
            }

            
        }
        
        return issues;
    }

    private String formatDivWithAttr(Element element, String attrName) {
        String id = element.getAttribute("id");
        String attr = element.getAttribute(attrName);
        StringBuilder sb = new StringBuilder();
        sb.append("<div");
        if (id != null && !id.isEmpty()) sb.append(" id=\"").append(id).append("\"");
        sb.append(' ').append(attrName).append("=\"").append(attr).append("\"");
        sb.append("></div>");
        return sb.toString();
    }

    private String formatSelfClosing(String tag, Element element, String... orderedAttrs) {
        StringBuilder sb = new StringBuilder();
        sb.append('<').append(tag);
        for (String name : orderedAttrs) {
            if (element.hasAttribute(name)) {
                sb.append(' ').append(name).append("=\"")
                  .append(element.getAttribute(name)).append("\"");
            }
        }
        sb.append("/>");
        return sb.toString();
    }
}
