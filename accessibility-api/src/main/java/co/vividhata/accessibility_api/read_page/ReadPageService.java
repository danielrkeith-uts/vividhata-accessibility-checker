package co.vividhata.accessibility_api.read_page;

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

    @Override
    public String readPageFrom(String url) {
        String html;
        try {
            html = htmlFetcher.fetchFrom(url);
        } catch (URISyntaxException | IllegalArgumentException _) {
            throw new InvalidUrlException();
        } catch (IOException _) {
            throw new CouldNotFetchPageException();
        }

        return html;
    }

}
