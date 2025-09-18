package co.vividhata.accessibility_api.checker;

import co.vividhata.accessibility_api.model.Issue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import java.util.ArrayList;
import java.util.List;

@Service
public class CheckerService implements ICheckerService {

    @Autowired
    private List<IIssueChecker> issueCheckers;

    @Override
    public List<Issue> checkAll(Document document) {
        List<Issue> issues = new ArrayList<>();

        for (IIssueChecker issueChecker : issueCheckers) {
            issues.addAll(issueChecker.check(document));
        }

        return issues;
    }
}
