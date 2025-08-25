package co.vividhata.accessibility_api.account;

public interface IAccountRepository {

    int createAccount(String username, String password, String first_name, String last_name);

}
