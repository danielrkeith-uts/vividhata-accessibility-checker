package co.vividhata.accessibility_api.util;

import java.io.IOException;

public interface IResourceReader {

    String getResourceAsString(String path) throws IOException;

}
