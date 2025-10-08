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
public class ValidHTMLChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.INVALID_HTML;
    
    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        String[] tagsToCheck = {"div", "span", "p", "section", "article", "aside", "header", "footer", "main"};
        for (String tag : tagsToCheck) {
            NodeList nodeList = document.getElementsByTagName(tag);

            for (int i = 0; i < nodeList.getLength(); i++) {
                Element element = (Element) nodeList.item(i);
                if (shouldBeSemantic(element)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                }
            }
        }
        return issues;
    }
    
    private boolean shouldBeSemantic(Element element) {
        String tagName = element.getTagName().toLowerCase();
        String role = element.getAttribute("role").toLowerCase();
        String className = element.getAttribute("class").toLowerCase();
        String id = element.getAttribute("id").toLowerCase();

        if (!role.isEmpty()) return false;

        if ("div".equals(tagName) || "span".equals(tagName) || "p".equals(tagName) ||
                "section".equals(tagName) || "article".equals(tagName) || "aside".equals(tagName) ||
                "header".equals(tagName) || "footer".equals(tagName) || "main".equals(tagName)) {

            String[] Keywords = {
                    "nav", "menu", "header", "banner", "footer", "main", "content",
                    "article", "post", "section", "chapter", "sidebar", "aside"
            };

            for (String keyword : Keywords) {
                if (className.contains(keyword) || id.contains(keyword)) {
                    return true;
                }
            }
        }
        return false;
    }
}