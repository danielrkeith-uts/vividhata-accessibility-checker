package co.vividhata.accessibility_api.web_page;

import co.vividhata.accessibility_api.model.WebPage;
import co.vividhata.accessibility_api.web_page.exceptions.WebPageDoesNotExistException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class WebPageService implements IWebPageService {

    @Autowired
    IWebPageRepository webPageRepository;

    @Override
    public List<WebPage> getAllWebPages(int accountId) {
        return webPageRepository.getAll(accountId);
    }

    @Override
    public int getOwner(int webPageId) {
        WebPage webPage = webPageRepository.get(webPageId);

        if (webPage == null) {
            throw new WebPageDoesNotExistException();
        }

        return webPage.accountId();
    }

    @Override
    public void deleteWebPage(int webPageId) {
        webPageRepository.delete(webPageId);
    }
}
