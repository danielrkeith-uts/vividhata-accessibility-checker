package co.vividhata.accessibility_api.read_page.exceptions;

import co.vividhata.accessibility_api.exceptions.BadGatewayException;

public class CouldNotFetchPageException extends BadGatewayException {
    public CouldNotFetchPageException() {
        super("Could not fetch page");
    }
}
