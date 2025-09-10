package co.vividhata.accessibility_api.checker;

import co.vividhata.accessibility_api.model.Issue;
import org.w3c.dom.Document;

import java.util.List;

public interface ICheckerService {

    List<Issue> checkAll(Document document);

}
