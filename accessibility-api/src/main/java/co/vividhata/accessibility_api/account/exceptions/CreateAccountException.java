package co.vividhata.accessibility_api.account.exceptions;

public class CreateAccountException extends RuntimeException {
    public CreateAccountException(String message) {
        super("Could not create account; " + message);
    }
}
