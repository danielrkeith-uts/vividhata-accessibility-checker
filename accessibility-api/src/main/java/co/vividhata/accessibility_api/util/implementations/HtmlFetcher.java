package co.vividhata.accessibility_api.util.implementations;

import co.vividhata.accessibility_api.util.IHtmlFetcher;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Scanner;

@Service
public class HtmlFetcher implements IHtmlFetcher {

    @Override
    public String fetchFrom(String url) throws URISyntaxException, IOException, IllegalArgumentException {
        Scanner sc;
        URL connection = new URI(url).toURL();
        sc = new Scanner(connection.openStream());


        StringBuilder sb = new StringBuilder();
        while (sc.hasNext()) {
            sb.append(sc.next());
        }

        return sb.toString();
    }

}
