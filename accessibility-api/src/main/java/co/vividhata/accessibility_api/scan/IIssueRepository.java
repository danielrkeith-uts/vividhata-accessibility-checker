package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.IssueType;

public interface IIssueRepository {

    int create(int scanId, IssueType issueType, String htmlSnippet);

}
