package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.Issue;

import java.time.Instant;
import java.util.List;

public interface IScanRepository {

    int create(int webPageId, Instant timeScanned, String htmlContent);

}
