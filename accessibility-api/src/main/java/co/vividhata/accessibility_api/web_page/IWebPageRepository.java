package co.vividhata.accessibility_api.web_page;

import co.vividhata.accessibility_api.model.WebPage;

import java.util.List;

public interface IWebPageRepository {

    int create(int accountId, String url);

    WebPage get(int accountId, String url);

    WebPage get(int webPageId);

    List<WebPage> getAll(int accountId);

    void delete(int webPageId);

}
