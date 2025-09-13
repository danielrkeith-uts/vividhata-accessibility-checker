package co.vividhata.accessibility_api.scan;

import java.time.Instant;

public interface IScanRepository {

    int create(int webPageId, Instant timeScanned, String htmlContent);

}
