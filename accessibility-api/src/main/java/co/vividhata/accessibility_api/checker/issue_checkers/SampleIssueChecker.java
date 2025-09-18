package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import java.util.List;

@Service
public class SampleIssueChecker implements IIssueChecker {

    @Override
    public List<Issue> check(Document document) {
        return List.of(new Issue(-1, -1, IssueType.SAMPLE_ISSUE, "<sample>snippet</sample>"));
    }

}
