package co.vividhata.accessibility_api.account;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private IAccountService accountService;

    @PostMapping("/create")
    public void createAccount() {}

    @PostMapping("/delete")
    public void deleteAccount() {}

    @PostMapping("/login")
    public void login() {}

    @PostMapping("/logout")
    public void logout() {}

}
