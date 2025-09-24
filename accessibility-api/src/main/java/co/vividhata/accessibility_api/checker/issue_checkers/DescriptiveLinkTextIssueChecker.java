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
import org.springframework.stereotype.Service;
import co.vividhata.accessibility_api.util.INodeParser;

@Service
public class DescriptiveLinkTextIssueChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.DESCRIPTIVE_LINK_TEXT;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check (Document document){
        List<Issue> issues = new ArrayList<>();
        NodeList linkNodes = document.getElementsByTagName("a");
        
        for (int i = 0; i < linkNodes.getLength(); i++){
            Node node = linkNodes.item(i);
            if (node.getNodeType() != Node.ELEMENT_NODE) continue;
            Element element = (Element) node;

            String text = element.getTextContent() == null ? "" : element.getTextContent().trim();
            String lower = text.toLowerCase();

            boolean isEmpty = text.isEmpty();
            boolean isVague = lower.equals("click here") || lower.equals("here") || lower.equals("read more") || lower.equals("more") || lower.equals("learn more");

            if (isEmpty || isVague){
                String id = element.getAttribute("id");
                String href = element.getAttribute("href");
                StringBuilder sb = new StringBuilder();
                sb.append("<a");
                if (id != null && !id.isEmpty()) sb.append(" id=\"").append(id).append("\"");
                if (href != null && !href.isEmpty()) sb.append(" href=\"").append(href).append("\"");
                sb.append('>').append(text).append("</a>");
                issues.add(new Issue(-1, -1, ISSUE_TYPE, sb.toString()));
            }
        }
        
        return issues;

    }
    
}
