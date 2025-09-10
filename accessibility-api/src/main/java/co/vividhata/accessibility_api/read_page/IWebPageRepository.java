package co.vividhata.accessibility_api.read_page;

import co.vividhata.accessibility_api.model.WebPage;

public interface IWebPageRepository {

    int create(int accountId, String url);

    WebPage get(int accountId, String url);

}
