package co.vividhata.accessibility_api.admin;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.HandlerInterceptor;

public class AdminAuthenticationInterceptor implements HandlerInterceptor {

    private final String adminPassword;

    public AdminAuthenticationInterceptor(String adminPassword) {
        this.adminPassword = adminPassword;
    }

    @Override
    public boolean preHandle(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull Object handler) {
        String adminAuthenticationHeader = request.getHeader("ADMIN-AUTHENTICATION");

        if (adminAuthenticationHeader == null || !adminAuthenticationHeader.equals(adminPassword)) {
            response.setStatus(401);
            return false;
        }
        return true;
    }

}