# Implementing Issue Checkers

For each WCAG rule, a new Issue Checker should be created.

All issue checkers should be located inside 
`src/main/java/co/vividhata/accessibility_api/checker/issue_checkers`

## Template
```java
@Service
package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import java.util.List;

public class SampleIssueChecker implements IIssueChecker {

    @Override
    public List<Issue> check(Document document) {
        // Your logic goes here
    }

}
```

Each Issue Checker must implement the `IIssueChecker` interface.
This means it must contain one public method `check`, which accepts
a `Document` as a parameter, and returns a `List` of `Issue`s.

### `Document`
The document is a parsed version of the website that is being scanned.
Documentation on the `Document` class can be found [here](https://docs.oracle.com/javase/8/docs/api/org/w3c/dom/Document.html).

### `Issue`
Issue is a record defined in `src/main/java/co/vividhata/accessibility_api/model`.
It contains data members `id`, `scanId`, `issueType`, and `htmlSnippet`.

`id` and `scanId` can be set to `-1`, since they are not relevant at this stage.

`issueType` is an enum defined in `src/main/java/co/vividhata/accessibility_api/model`.
For each issue checker, add the WCAG issue type to the enum and use that.

`htmlSnippet` is a `String` containing the HTML that is causing the issue.

## Testing the checker
Please write a unit test for the checker inside
`src/test/java/co/vividhata/accessibility_api/issue_checkers`
to ensure it functions as expected.

All the checkers are triggered when the `scan/from-url` endpoint is hit.
Details for that endpoint are in the `README.md`.
