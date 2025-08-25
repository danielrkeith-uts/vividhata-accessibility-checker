package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements IAccountService {

    @Autowired
    private IAccountRepository accountRepository;

    @Override
    public void createAccount(String username, String password, String first_name, String last_name) throws CreateAccountException {
        // TODO - check fields (e.g. valid password) and throw CreateAccountException derivatives

        int accountId = accountRepository.createAccount(username, password, first_name, last_name);

        login(accountId);
    }

    @Override
    public void login(int accountId) {
        // TODO - stub
        System.out.println("Login account " + accountId);
    }

}
