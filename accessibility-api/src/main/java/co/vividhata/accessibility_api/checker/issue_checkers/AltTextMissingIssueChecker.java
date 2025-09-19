package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;

@Service
public class AltTextMissingIssueChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.ALT_TEXT_MISSING;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();

        NodeList imageNodeList = document.getElementsByTagName("img");

        for (int i = 0; i < imageNodeList.getLength(); i++) {
            Node imageNode = imageNodeList.item(i);
            NamedNodeMap imageAttributes = imageNode.getAttributes();
            Node altTextAttribute = imageAttributes.getNamedItem("alt");

            if (altTextAttribute == null) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(imageNode)));
            }
        }

        return issues;
    }

}
