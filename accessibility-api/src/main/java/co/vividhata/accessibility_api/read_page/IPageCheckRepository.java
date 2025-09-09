package co.vividhata.accessibility_api.read_page;

import java.time.Instant;

public interface IPageCheckRepository {

    void create(int webPageId, Instant timeRan, String htmlContent);

}
