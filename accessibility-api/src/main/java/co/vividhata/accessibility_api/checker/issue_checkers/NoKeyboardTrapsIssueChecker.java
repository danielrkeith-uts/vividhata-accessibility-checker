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

            // 1) Blocks Tab/Escape flow: preventDefault without handling Tab/Escape
            for (String attributeName : new String[]{"onkeydown", "onkeypress"}) {
                if (element.hasAttribute(attributeName)) {
                    String handlerValue = element.getAttribute(attributeName).toLowerCase();
                    boolean blocks = handlerValue.contains("preventdefault()");
                    boolean handlesTabOrEscape = handlerValue.contains("tab") || handlerValue.contains("escape") || handlerValue.contains("esc");
                    if (blocks && !handlesTabOrEscape) {
                        issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                        break;
                    }
                }
            }

            // 2) Forced focus loop suspect: onfocus calling focus()
            if (element.hasAttribute("onfocus")) {
                String handlerValue = element.getAttribute("onfocus").toLowerCase();
                if (handlerValue.contains("focus()")) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                }
            }

            
        }
        
        return issues;
    }
}
