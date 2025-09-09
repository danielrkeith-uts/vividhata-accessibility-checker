package co.vividhata.accessibility_api.read_page.exceptions;

import co.vividhata.accessibility_api.exceptions.BadRequestException;

public class InvalidUrlException extends BadRequestException {
    public InvalidUrlException() {
        super("Invalid Url");
    }
}
