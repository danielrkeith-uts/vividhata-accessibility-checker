package co.vividhata.accessibility_api.issue;

import co.vividhata.accessibility_api.model.Issue;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class IssueService implements IIssueService {

    @Autowired
    private IIssueRepository issueRepository;

    @Override
    public List<Issue> getIssues(int scanId) {
        return issueRepository.getAll(scanId);
    }
}
