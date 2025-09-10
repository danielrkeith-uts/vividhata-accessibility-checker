package co.vividhata.accessibility_api.read_page;

import java.time.Instant;

public interface IPageCheckRepository {

    int create(int webPageId, Instant timeChecked, String htmlContent);

}
