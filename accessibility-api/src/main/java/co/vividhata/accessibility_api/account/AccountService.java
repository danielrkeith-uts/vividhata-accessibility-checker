package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import co.vividhata.accessibility_api.account.exceptions.InvalidLoginCredentialsException;
import co.vividhata.accessibility_api.model.Account;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements IAccountService {

    private static final String ACCOUNT_COOKIE_NAME = "account_id";
    private static final int SECONDS_IN_A_DAY = 24 * 60 * 60;

    @Autowired
    private IAccountRepository accountRepository;

    @Override
    public int createAccount(String username, String password, String first_name, String last_name) throws CreateAccountException {
        // TODO - check fields (e.g. valid password, account doesn't exist) and throw CreateAccountException derivatives

        return accountRepository.create(username, password, first_name, last_name);
    }

    @Override
    public void login(int accountId, HttpServletResponse response) {
        Cookie accountCookie = new Cookie(ACCOUNT_COOKIE_NAME, String.valueOf(accountId));

        accountCookie.setPath("/");
        accountCookie.setMaxAge(3 * SECONDS_IN_A_DAY);

        response.addCookie(accountCookie);
    }

    @Override
    public void login(String username, String password, HttpServletResponse response) throws InvalidLoginCredentialsException {
        Account account = accountRepository.get(username, password);
        if (account == null) {
            throw new InvalidLoginCredentialsException();
        }

        login(account.id(), response);
    }

    @Override
    public void logout(HttpServletResponse response) {
        Cookie accountCookie = new Cookie(ACCOUNT_COOKIE_NAME, null);

        accountCookie.setPath("/");
        accountCookie.setMaxAge(0);

        response.addCookie(accountCookie);
    }

    @Override
    public void deleteAccount(int accountId) {
        accountRepository.delete(accountId);
    }

}
