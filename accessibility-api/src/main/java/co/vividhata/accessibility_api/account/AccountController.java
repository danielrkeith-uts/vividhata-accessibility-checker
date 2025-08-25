package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.dto.CreateAccountRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private IAccountService accountService;

    @PostMapping("/create")
    public void createAccount(@RequestBody CreateAccountRequest accountRequest) {
        accountService.createAccount(accountRequest.username(), accountRequest.password(), accountRequest.firstName(), accountRequest.lastName());
    }

    @PostMapping("/delete")
    public void deleteAccount() { }

    @PostMapping("/login")
    public void login() { }

    @PostMapping("/logout")
    public void logout() { }

}
