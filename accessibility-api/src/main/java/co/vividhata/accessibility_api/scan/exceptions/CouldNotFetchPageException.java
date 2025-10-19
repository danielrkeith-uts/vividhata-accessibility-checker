package co.vividhata.accessibility_api.scan.exceptions;

import co.vividhata.accessibility_api.exceptions.BadGatewayException;

public class CouldNotFetchPageException extends BadGatewayException {
    public CouldNotFetchPageException() {
        super("Could not fetch page. Please try a different URL.");
    }
}
