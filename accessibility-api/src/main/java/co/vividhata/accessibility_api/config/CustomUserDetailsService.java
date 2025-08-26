package co.vividhata.accessibility_api.config;

import co.vividhata.accessibility_api.account.IAccountRepository;
import co.vividhata.accessibility_api.model.Account;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private IAccountRepository accountRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Account account = accountRepository.get(username);

        if (account == null) {
            throw new UsernameNotFoundException("Account not found");
        }

        return User.withUsername(account.username())
                .password(account.password())
                .authorities("USER")
                .build();
    }

}
