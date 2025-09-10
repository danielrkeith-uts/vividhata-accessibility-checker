package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.Scan;

public interface IScanService {

    Scan scanFrom(String url, int accountId);

}
