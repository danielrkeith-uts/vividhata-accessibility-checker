package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements IAccountService {

    private static final int SECONDS_IN_A_DAY = 24 * 60 * 60;

    @Autowired
    private IAccountRepository accountRepository;

    @Override
    public int createAccount(String username, String password, String first_name, String last_name) throws CreateAccountException {
        // TODO - check fields (e.g. valid password) and throw CreateAccountException derivatives

        return accountRepository.createAccount(username, password, first_name, last_name);
    }

    @Override
    public void login(int accountId, HttpServletResponse response) {
        Cookie accountCookie = new Cookie("account_id", String.valueOf(accountId));

        // Expires in three days
        accountCookie.setMaxAge(3 * SECONDS_IN_A_DAY);

        response.addCookie(accountCookie);
    }

}
