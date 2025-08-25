package co.vividhata.accessibility_api.account;

public interface IAccountService {

    void createAccount(String username, String password, String first_name, String last_name);

    void login(int accountId);

}
