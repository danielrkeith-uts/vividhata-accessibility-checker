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
public class ContentMeaningfulSequenceChecker implements IIssueChecker {
    
    private static final IssueType ISSUE_TYPE = IssueType.CONTENT_MEANINGFUL_SEQUENCE_VIOLATION;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        
        NodeList allElements = document.getElementsByTagName("*");
        for (int i = 0; i < allElements.getLength(); i++) {
            Node elementNode = allElements.item(i);
            if (elementNode.getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) elementNode;
                if (hasProblematicPositioning(element)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(elementNode)));
                }
            }
        }
        
        return issues;
    }

    private boolean hasProblematicPositioning(Element element) {
        String style = element.getAttribute("style");
        String className = element.getAttribute("class");
        String id = element.getAttribute("id");
        
        if (hasProblematicCSSInStyle(style)) {
            return true;
        }
        
        if (hasProblematicCSSInClassName(className)) {
            return true;
        }
        
        if (hasProblematicCSSInId(id)) {
            return true;
        }
        
        return false;
    }
    

    private boolean hasProblematicCSSInStyle(String style) {
        if (style == null || style.trim().isEmpty()) {
            return false;
        }
        
        String lowerStyle = style.toLowerCase();
        
        if (lowerStyle.contains("position:absolute") || lowerStyle.contains("position: absolute")) {
            return true;
        }
        
        if (lowerStyle.contains("position:fixed") || lowerStyle.contains("position: fixed")) {
            return true;
        }
        
        if (lowerStyle.contains("float:left") || lowerStyle.contains("float: left") ||
            lowerStyle.contains("float:right") || lowerStyle.contains("float: right")) {
            return true;
        }
        
        if (lowerStyle.contains("margin-left:-") || lowerStyle.contains("margin-left: -") ||
            lowerStyle.contains("margin-right:-") || lowerStyle.contains("margin-right: -") ||
            lowerStyle.contains("margin-top:-") || lowerStyle.contains("margin-top: -") ||
            lowerStyle.contains("margin-bottom:-") || lowerStyle.contains("margin-bottom: -")) {
            return true;
        }
        
        if (lowerStyle.contains("transform:translate") || lowerStyle.contains("transform: translate")) {
            return true;
        }
        
        return false;
    }
    
    private boolean hasProblematicCSSInClassName(String className) {
        if (className == null || className.trim().isEmpty()) {
            return false;
        }
        
        String lowerClassName = className.toLowerCase();
        
        String[] problematicPatterns = {
            "absolute", "fixed", "floating", "overlay", "popup", "modal",
            "dropdown", "tooltip", "sticky", "positioned", "offset",
            "negative-margin", "pull-left", "pull-right", "float-left", "float-right"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerClassName.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }
    
    private boolean hasProblematicCSSInId(String id) {
        if (id == null || id.trim().isEmpty()) {
            return false;
        }
        
        String lowerId = id.toLowerCase();
        
        String[] problematicPatterns = {
            "absolute", "fixed", "floating", "overlay", "popup", "modal",
            "dropdown", "tooltip", "sticky", "positioned", "offset"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerId.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }
}
