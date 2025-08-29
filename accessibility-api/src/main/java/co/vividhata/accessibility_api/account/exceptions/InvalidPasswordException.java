package co.vividhata.accessibility_api.account.exceptions;

public class InvalidPasswordException extends CreateAccountException {

    public InvalidPasswordException() {
        super("Password must be at least 8 characters long and contain a letter, number, and special character");
    }

}
