package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import co.vividhata.accessibility_api.account.exceptions.InvalidLoginCredentialsException;
import jakarta.servlet.http.HttpServletResponse;

public interface IAccountService {

    int createAccount(String username, String password, String first_name, String last_name) throws CreateAccountException;

    void login(int accountId, HttpServletResponse response);

    void login(String username, String password, HttpServletResponse response) throws InvalidLoginCredentialsException;

    void logout(HttpServletResponse response);

    void deleteAccount(int accountId);

}
