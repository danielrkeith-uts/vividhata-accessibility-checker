package co.vividhata.accessibility_api.issue;

import co.vividhata.accessibility_api.model.Issue;

import java.util.List;

public interface IIssueService {

    List<Issue> getIssues(int scanId);

}
