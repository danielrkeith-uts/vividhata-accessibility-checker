package co.vividhata.accessibility_api.account.exceptions;

public class InvalidPasswordException extends CreateAccountException {

    public InvalidPasswordException() {
        super("Invalid password");
    }

}
