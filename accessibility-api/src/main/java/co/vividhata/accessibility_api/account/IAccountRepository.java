package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.model.Account;

public interface IAccountRepository {

    void create(String email, String password, String first_name, String last_name);

    Account get(String email);

}
