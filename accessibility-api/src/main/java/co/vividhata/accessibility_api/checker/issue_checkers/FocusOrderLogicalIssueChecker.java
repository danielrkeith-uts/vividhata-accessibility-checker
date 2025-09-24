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

public class FocusOrderLogicalIssueChecker implements IIssueChecker{
    
    private static final IssueType ISSUE_TYPE = IssueType.FOCUS_ORDER_LOGICAL;

    @Autowired
    private INodeParser nodeParser;

    @Override 
    public List<Issue> check (Document document){
        List<Issue> issues = new ArrayList<>();
        NodeList allNodes = document.getElementsByTagName("*");

        for (int i=0; i < allNodes.getLength(); i++){
            Node node = allNodes.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;
            Element element = (Element) node;

            if (element.hasAttribute("tabindex")) {
                try {
                    int tabindex = Integer.parseInt(element.getAttribute("tabindex").trim());
                    if (tabindex > 0) {
                        issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                    }
                } catch (NumberFormatException ignored) { }
            }
        }

        return issues;
    }
    
}
