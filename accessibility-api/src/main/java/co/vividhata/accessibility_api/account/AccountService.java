package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import co.vividhata.accessibility_api.account.exceptions.InvalidPasswordException;
import co.vividhata.accessibility_api.account.exceptions.UsernameTakenException;
import co.vividhata.accessibility_api.util.Validator;
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
        if (accountRepository.get(username) != null) {
            throw new UsernameTakenException();
        }

        if (!Validator.isPasswordValid(password)) {
            throw new InvalidPasswordException();
        }

        String hashedPassword = passwordEncoder.encode(password);

        accountRepository.create(username, hashedPassword, firstName, lastName);
    }

}
