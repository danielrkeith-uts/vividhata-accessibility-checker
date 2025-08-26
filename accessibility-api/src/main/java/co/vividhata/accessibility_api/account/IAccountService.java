package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import jakarta.servlet.http.HttpServletResponse;

public interface IAccountService {

    int createAccount(String username, String password, String first_name, String last_name) throws CreateAccountException;

    void login(int accountId, HttpServletResponse response);

}
