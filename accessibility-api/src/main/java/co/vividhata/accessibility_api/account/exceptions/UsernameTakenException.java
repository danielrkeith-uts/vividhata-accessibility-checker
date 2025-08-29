package co.vividhata.accessibility_api.account.exceptions;

public class UsernameTakenException extends CreateAccountException {

    public UsernameTakenException() {
        super("An account already exists with that username");
    }

}
