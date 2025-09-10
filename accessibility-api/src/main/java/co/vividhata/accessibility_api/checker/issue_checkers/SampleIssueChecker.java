package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import org.w3c.dom.Document;

import java.util.List;
import java.util.Random;

public class SampleIssueChecker implements IIssueChecker {

    private final Random random = new Random();

    @Override
    public List<Issue> check(Document document) {

        IssueType issueType = switch (random.nextInt(3)) {
            case 0 -> IssueType.SAMPLE_ISSUE_1;
            case 1 -> IssueType.SAMPLE_ISSUE_2;
            case 2 -> IssueType.SAMPLE_ISSUE_3;
            default -> null;
        };

        return List.of(new Issue(-1, -1, issueType, "<sample>snippet</sample>"));
    }

}
