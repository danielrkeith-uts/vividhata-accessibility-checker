package co.vividhata.accessibility_api.model;

import java.time.Instant;

public record PageCheck(int pageCheckId, int webPageId, Instant timeChecked, String htmlContent) { }
