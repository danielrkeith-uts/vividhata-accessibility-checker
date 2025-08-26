package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.account.dto.CreateAccountResponse;
import co.vividhata.accessibility_api.account.dto.LoginRequest;
import co.vividhata.accessibility_api.account.dto.CreateAccountRequest;
import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import co.vividhata.accessibility_api.account.exceptions.InvalidLoginCredentialsException;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/account")
public class AccountController {

    @Autowired
    private IAccountService accountService;

    @PostMapping("/create")
    public CreateAccountResponse createAccount(@RequestBody CreateAccountRequest createAccountRequest) throws CreateAccountException {
        int accountId = accountService.createAccount(createAccountRequest.username(), createAccountRequest.password(), createAccountRequest.firstName(), createAccountRequest.lastName());
        return new CreateAccountResponse(accountId);
    }

    @DeleteMapping("/delete/{accountId}")
    public void deleteAccount(@PathVariable int accountId) {
        accountService.deleteAccount(accountId);
    }

    @PostMapping("/login")
    public void login(HttpServletResponse response, @RequestBody LoginRequest loginRequest) throws InvalidLoginCredentialsException {
        accountService.login(loginRequest.username(), loginRequest.password(), response);
    }

    @PostMapping("/login/{accountId}")
    public void login(HttpServletResponse response, @PathVariable int accountId) {
        accountService.login(accountId, response);
    }

    @PostMapping("/logout")
    public void logout(HttpServletResponse response) {
        accountService.logout(response);
    }

}
