package co.vividhata.accessibility_api.account.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value=HttpStatus.UNAUTHORIZED, reason="Incorrect username and/or password")
public class InvalidLoginCredentialsException extends RuntimeException { }
