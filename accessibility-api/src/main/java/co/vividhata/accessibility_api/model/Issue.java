package co.vividhata.accessibility_api.model;

public record Issue(int id, int scanId, IssueType issueType, String htmlSnippet) {

    public Issue withId(int id) {
        return new Issue(id, scanId, issueType, htmlSnippet);
    }

    public Issue withScanId(int scanId) {
        return new Issue(id, scanId, issueType, htmlSnippet);
    }

}
