package co.vividhata.accessibility_api.web_page.exceptions;

import co.vividhata.accessibility_api.exceptions.BadRequestException;

public class WebPageDoesNotExistException extends BadRequestException {
    public WebPageDoesNotExistException() {
        super("No web page exists with that ID");
    }
}
