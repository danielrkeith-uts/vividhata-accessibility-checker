package co.vividhata.accessibility_api.account.exceptions;

import co.vividhata.accessibility_api.exceptions.BadRequestException;

public class CreateAccountException extends BadRequestException {

    public CreateAccountException(String message) {
        super(message);
    }

}
