package co.vividhata.accessibility_api.issue;

import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;

import java.util.List;

public interface IIssueRepository {

    int create(int scanId, IssueType issueType, String htmlSnippet);

    List<Issue> getAll(int scanId);

}
