package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.Scan;

import java.time.Instant;

public interface IScanRepository {

    int create(int webPageId, Instant timeScanned, String htmlContent);

    int getOwner(int scanId);

    List<Scan> getAll(int webPageId);

}
