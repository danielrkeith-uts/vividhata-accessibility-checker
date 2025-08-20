package co.vividhata.accessibility_api.util;

public interface IEncrypter {

    byte[] encrypt(String data);
    String decrypt(byte[] data);

}
