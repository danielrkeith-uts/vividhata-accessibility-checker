package co.vividhata.accessibility_api.web_page;

import co.vividhata.accessibility_api.model.WebPage;

import java.util.List;

public interface IWebPageService {

    List<WebPage> getAllWebPages(int accountId);

}
