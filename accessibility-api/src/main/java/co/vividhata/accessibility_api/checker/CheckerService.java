package co.vividhata.accessibility_api.checker;

import co.vividhata.accessibility_api.checker.issue_checkers.SampleIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import java.util.ArrayList;
import java.util.List;

@Service
public class CheckerService implements ICheckerService {

    private final List<IIssueChecker> checkers = List.of(
            new SampleIssueChecker(),
            new SampleIssueChecker()
    );

    @Override
    public List<Issue> checkAll(Document document) {
        List<Issue> issues = new ArrayList<>();

        for (IIssueChecker checker : checkers) {
            issues.addAll(checker.check(document));
        }

        return issues;
    }
}
