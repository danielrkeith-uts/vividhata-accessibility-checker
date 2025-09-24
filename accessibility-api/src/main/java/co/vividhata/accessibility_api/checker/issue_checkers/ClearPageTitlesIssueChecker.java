package co.vividhata.accessibility_api.checker.issue_checkers;

import java.util.ArrayList;
import java.util.List;

import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;

public class ClearPageTitlesIssueChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.CLEAR_PAGE_TITLES;

    @Override
    public List<Issue> check (Document document){
        List<Issue> issues = new ArrayList<>();
        NodeList titleNodes = document.getElementsByTagName("title");

        if(titleNodes.getLength() == 0){
            issues.add(new Issue(-1, -1, ISSUE_TYPE, "<title> missing"));
            return issues;
        }

        Node titleNode = titleNodes.item(0);
        String text = titleNode.getTextContent() == null ? "" : titleNode.getTextContent().trim();
        if (text.isEmpty()) {
            issues.add(new Issue(-1, -1, ISSUE_TYPE, "<title></title>"));
        }
        return issues;
    }
    
}
