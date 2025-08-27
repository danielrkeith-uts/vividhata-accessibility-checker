package co.vividhata.accessibility_api.util;

import java.util.regex.Pattern;

public class Validator {

    public static final int MINIMUM_PASSWORD_LENGTH = 8;

    public static boolean isPasswordValid(String password) {
        Pattern letter = Pattern.compile("[a-zA-z]");
        Pattern digit = Pattern.compile("[0-9]");
        Pattern special = Pattern.compile ("[^a-zA-Z0-9]");

        return letter.matcher(password).find()
                && digit.matcher(password).find()
                && special.matcher(password).find()
                && password.length() >= MINIMUM_PASSWORD_LENGTH;
    }
}
