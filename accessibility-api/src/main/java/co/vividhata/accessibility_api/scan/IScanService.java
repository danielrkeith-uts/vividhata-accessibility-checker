package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.Scan;

import java.util.List;

public interface IScanService {

    Scan scanFrom(String url, int accountId);

    int getOwner(int scanId);

    List<Scan> getScans(int webPageId);

}
