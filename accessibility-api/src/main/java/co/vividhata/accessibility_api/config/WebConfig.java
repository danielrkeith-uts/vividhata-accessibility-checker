package co.vividhata.accessibility_api.config;

import co.vividhata.accessibility_api.admin.AdminAuthenticationInterceptor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Value("${AC_ADMIN_PASSWORD}")
    private String adminPassword;

    @Override
    public void addInterceptors(@NonNull InterceptorRegistry registry) {
        registry.addInterceptor(new AdminAuthenticationInterceptor(adminPassword))
                .addPathPatterns("/api/admin/**");
    }

}
