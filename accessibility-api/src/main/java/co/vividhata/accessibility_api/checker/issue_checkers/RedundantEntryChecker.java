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
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class RedundantEntryChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.REDUNDANT_ENTRY;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        String[] tagsToCheck = {"input", "textarea", "select"};
        Map<String, String> previous = new HashMap<>();

        for (String tag : tagsToCheck) {
            NodeList nodeList = document.getElementsByTagName(tag);

            for (int i = 0; i < nodeList.getLength(); i++) {
                Element element = (Element) nodeList.item(i);
                String name = element.getAttribute("name");
                String type = element.getAttribute("type");
                String value = element.getAttribute("value").trim();
                
                if ("password".equalsIgnoreCase(type) || element.hasAttribute("data-security")) {
                    continue; 
                }

                if (name.isEmpty()) {
                    continue;
                }

                if (previous.containsKey(name)) {
                    boolean hasAutoFill = !value.isEmpty();
                    boolean hasOptions = tag.equals("select") && element.getElementsByTagName("option").getLength() > 0;

                    if (!hasAutoFill && !hasOptions) {
                        issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));                   
                    }
                } else {
                    if (!value.isEmpty()) {
                        previous.put(name, value);
                    }
                }
            }
        }

        return issues;
    }
}