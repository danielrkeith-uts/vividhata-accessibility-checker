package co.vividhata.accessibility_api.config;

import co.vividhata.accessibility_api.account.exceptions.CreateAccountException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(CreateAccountException.class)
    public ResponseEntity<?> handleCreateAccountException(CreateAccountException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(ex.getMessage());
    }

}
