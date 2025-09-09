package co.vividhata.accessibility_api.read_page;

import co.vividhata.accessibility_api.model.WebPage;
import co.vividhata.accessibility_api.read_page.exceptions.CouldNotFetchPageException;
import co.vividhata.accessibility_api.read_page.exceptions.InvalidUrlException;
import co.vividhata.accessibility_api.util.IHtmlFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;

@Service
public class ReadPageService implements IReadPageService {

    @Autowired
    private IHtmlFetcher htmlFetcher;
    @Autowired
    private IWebPageRepository webPageRepository;

    @Override
    public String readPageFrom(String url, int accountId) {
        String html;
        try {
            html = htmlFetcher.fetchFrom(url);
        } catch (URISyntaxException | IllegalArgumentException _) {
            throw new InvalidUrlException();
        } catch (IOException _) {
            throw new CouldNotFetchPageException();
        }

        WebPage webPage = webPageRepository.get(accountId, url);

        if (webPage == null) {
            webPageRepository.create(accountId, url);
            webPage = webPageRepository.get(accountId, url);
        }

        return html;
    }

}
