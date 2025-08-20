package co.vividhata.accessibility_api.util;

import org.springframework.stereotype.Service;

import java.nio.charset.StandardCharsets;

// TODO - implement secure encryption
@Service
public class Encrypter implements IEncrypter {

    @Override
    public byte[] encrypt(String data) {
        return data.getBytes(StandardCharsets.UTF_8);
    }

    @Override
    public String decrypt(byte[] data) {
        return new String(data, StandardCharsets.UTF_8);
    }

}
