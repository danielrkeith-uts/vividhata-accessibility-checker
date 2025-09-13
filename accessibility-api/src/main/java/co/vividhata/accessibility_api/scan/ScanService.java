package co.vividhata.accessibility_api.scan;

import co.vividhata.accessibility_api.checker.ICheckerService;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.Scan;
import co.vividhata.accessibility_api.model.WebPage;
import co.vividhata.accessibility_api.scan.exceptions.CouldNotFetchPageException;
import co.vividhata.accessibility_api.scan.exceptions.InvalidUrlException;
import co.vividhata.accessibility_api.util.IHtmlFetcher;
import co.vividhata.accessibility_api.util.IHtmlParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;

import java.io.IOException;
import java.net.URISyntaxException;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Service
public class ScanService implements IScanService {

    @Autowired
    private IHtmlFetcher htmlFetcher;
    @Autowired
    private IHtmlParser htmlParser;
    @Autowired
    private ICheckerService checkerService;
    @Autowired
    private IWebPageRepository webPageRepository;
    @Autowired
    private IScanRepository scanRepository;
    @Autowired
    private IIssueRepository issueRepository;

    @Override
    public Scan scanFrom(String url, int accountId) {
        String html = readPageFrom(url);

        WebPage webPage = webPageRepository.get(accountId, url);
        int webPageId = webPage == null ? webPageRepository.create(accountId, url) : webPage.id();

        Document document = htmlParser.parse(html);

        List<Issue> issues = checkerService.checkAll(document);

        Instant timeScanned = Instant.now();

        int scanId = scanRepository.create(webPageId, timeScanned, html);

        List<Issue> issuesWithIds = new ArrayList<>();
        for (Issue issue : issues) {
            int issueId = issueRepository.create(scanId, issue.issueType(), issue.htmlSnippet());
            issuesWithIds.add(issue.withId(issueId).withScanId(scanId));
        }

        return new Scan(scanId, webPageId, timeScanned, html, issuesWithIds);
    }


    private String readPageFrom(String url) {
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
