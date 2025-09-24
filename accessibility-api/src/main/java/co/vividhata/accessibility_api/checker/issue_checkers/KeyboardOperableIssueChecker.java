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

            boolean hasMouseOnly = element.hasAttribute("onclick") || element.hasAttribute("onmousedown") || element.hasAttribute("onmouseup");
            if (hasMouseOnly) continue;

            boolean hasKeyboardOnly = element.hasAttribute("onkeydown") || element.hasAttribute("onkeyup");
            if (hasKeyboardOnly) continue;
            
            if (hasMouseOnly && !hasKeyboardOnly) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
            }
        
        }

        return issues;
    }
}
