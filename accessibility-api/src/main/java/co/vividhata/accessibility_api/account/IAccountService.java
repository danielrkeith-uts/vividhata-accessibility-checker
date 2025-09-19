package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;

public interface IAccountService {

    void createAccount(String email, String password, String firstName, String lastName) throws CreateAccountException;

}
