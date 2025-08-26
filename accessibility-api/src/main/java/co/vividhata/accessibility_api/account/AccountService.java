package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AccountService implements IAccountService {

    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private IAccountRepository accountRepository;

    @Override
    public void createAccount(String username, String password, String firstName, String lastName) throws CreateAccountException {
        // TODO - check fields (e.g. valid password, account doesn't exist) and throw CreateAccountException derivatives

        String hashedPassword = passwordEncoder.encode(password);

        accountRepository.create(username, hashedPassword, firstName, lastName);
    }

}
