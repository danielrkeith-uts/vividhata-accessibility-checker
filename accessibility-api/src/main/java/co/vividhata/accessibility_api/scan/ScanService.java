package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.model.WebPage;
import co.vividhata.accessibility_api.scan.exceptions.CouldNotFetchPageException;
import co.vividhata.accessibility_api.scan.exceptions.InvalidUrlException;
import co.vividhata.accessibility_api.util.IHtmlFetcher;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;

@Service
public class ScanService implements IScanService {

    @Autowired
    private IHtmlFetcher htmlFetcher;
    @Autowired
    private IWebPageRepository webPageRepository;
    @Autowired
    private IScanRepository pageCheckRepository;

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

        int webPageId = webPage == null ? webPageRepository.create(accountId, url) : webPage.id();

        pageCheckRepository.create(webPageId, Instant.now(), html);

        return html;
    }

}
