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

import java.util.ArrayList;
import java.util.List;

@Service
public class SemanticHtmlChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.SEMANTIC_HTML_MISSING;


    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        
        String[] nonSemanticElements = {
            "div", "span", "p" 
        };
        
        for (String tagName : nonSemanticElements) {
            NodeList elementNodeList = document.getElementsByTagName(tagName);
            for (int i = 0; i < elementNodeList.getLength(); i++) {
                Node elementNode = elementNodeList.item(i);
                if (shouldBeSemantic(elementNode)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(elementNode)));
                }
            }
        }
        
        return issues;
    }


    private boolean shouldBeSemantic(Node elementNode) {
        if (elementNode.getNodeType() != Node.ELEMENT_NODE) {
            return false;
        }
        
        Element element = (Element) elementNode;
        String tagName = element.getTagName().toLowerCase();
        String className = element.getAttribute("class").toLowerCase();
        String id = element.getAttribute("id").toLowerCase();
        String role = element.getAttribute("role").toLowerCase();
        
        if (!role.isEmpty()) {
            return false;
        }
        
        if ("div".equals(tagName)) {
            return isDivThatShouldBeSemantic(element, className, id);
        }
        
        if ("span".equals(tagName)) {
            return isSpanThatShouldBeSemantic(element, className, id);
        }
        
        return false;
    }
    

    private boolean isDivThatShouldBeSemantic(Element element, String className, String id) {
        if (className.contains("nav") || className.contains("menu") || 
            id.contains("nav") || id.contains("menu")) {
            return true;
        }
        
        if (className.contains("header") || className.contains("banner") ||
            id.contains("header") || id.contains("banner")) {
            return true;
        }
        
        if (className.contains("footer") || id.contains("footer")) {
            return true;
        }
        
        if (className.contains("main") || className.contains("content") ||
            id.contains("main") || id.contains("content")) {
            return true;
        }
        
        if (className.contains("article") || className.contains("post") ||
            id.contains("article") || id.contains("post")) {
            return true;
        }
        
        if (className.contains("section") || className.contains("chapter") ||
            id.contains("section") || id.contains("chapter")) {
            return true;
        }
        
        if (className.contains("sidebar") || className.contains("aside") ||
            id.contains("sidebar") || id.contains("aside")) {
            return true;
        }
        
        return false;
    }
    

    private boolean isSpanThatShouldBeSemantic(Element element, String className, String id) {
        if (className.contains("button") || className.contains("btn") ||
            id.contains("button") || id.contains("btn")) {
            return true;
        }
        
        if (className.contains("link") || className.contains("anchor") ||
            id.contains("link") || id.contains("anchor")) {
            return true;
        }
        
        if (className.contains("emphasis") || className.contains("highlight") ||
            id.contains("emphasis") || id.contains("highlight")) {
            return true;
        }
        
        if (className.contains("strong") || className.contains("bold") ||
            id.contains("strong") || id.contains("bold")) {
            return true;
        }
        
        return false;
    }

}