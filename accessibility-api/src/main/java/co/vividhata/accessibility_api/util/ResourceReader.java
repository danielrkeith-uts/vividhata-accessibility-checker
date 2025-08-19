package co.vividhata.accessibility_api.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.ResourceLoader;
import org.springframework.stereotype.Service;
import org.springframework.util.FileCopyUtils;

import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.Reader;

@Service
public class ResourceReader {

    @Autowired
    private ResourceLoader resourceLoader;

    public String getResourceAsString(String path) throws IOException {
        Resource resource = resourceLoader.getResource("classpath:" + path);

        InputStream inputStream;
        inputStream = resource.getInputStream();

        Reader reader = new InputStreamReader(inputStream);
        return FileCopyUtils.copyToString(reader);
    }

}