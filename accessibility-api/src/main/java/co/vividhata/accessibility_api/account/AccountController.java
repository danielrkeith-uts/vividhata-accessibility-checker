package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.dto.RegisterAccountRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private IAccountService accountService;

    @PostMapping("/register")
    public void register(HttpServletResponse response, @RequestBody RegisterAccountRequest accountRequest) {
        int accountId = accountService.createAccount(accountRequest.username(), accountRequest.password(), accountRequest.firstName(), accountRequest.lastName());

        accountService.login(accountId, response);
    }

    @DeleteMapping("/delete")
    public void deleteAccount() { }

    @PostMapping("/login")
    public void login() { }

    @PostMapping("/logout")
    public void logout() { }

}
