package co.vividhata.accessibility_api.exceptions;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.util.Map;

@ControllerAdvice
public class HttpExceptionHandler {

    private Map<String, String> bodyFrom(Exception ex) {
        return Map.of(
                "error", ex.getClass().getSimpleName(),
                "message", ex.getMessage()
        );
    }

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<?> handleBadRequestException(BadRequestException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_REQUEST)
                .body(bodyFrom(ex));
    }

    @ExceptionHandler(BadGatewayException.class)
    public ResponseEntity<?> handleBadGatewayException(BadGatewayException ex) {
        return ResponseEntity
                .status(HttpStatus.BAD_GATEWAY)
                .body(bodyFrom(ex));
    }

}
