package co.vividhata.accessibility_api.account;

import co.vividhata.accessibility_api.model.Account;

public interface IAccountRepository {

    int create(String username, String password, String first_name, String last_name);

    Account get(String username, String password);

    boolean delete(int id);

}
