package co.vividhata.accessibility_api.util;

import java.io.IOException;
import java.net.URISyntaxException;

public interface IHtmlFetcher {

    String fetchFrom(String url) throws URISyntaxException, IOException, IllegalArgumentException;

}
