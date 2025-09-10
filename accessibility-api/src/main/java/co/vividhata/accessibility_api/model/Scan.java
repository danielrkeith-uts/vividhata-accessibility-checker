package co.vividhata.accessibility_api.model;

import java.time.Instant;

public record Scan(int pageCheckId, int webPageId, Instant timeScanned, String htmlContent) { }
