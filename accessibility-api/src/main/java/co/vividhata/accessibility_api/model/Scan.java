package co.vividhata.accessibility_api.model;

import java.time.Instant;
import java.util.List;

public record Scan(int id, int webPageId, Instant timeScanned, String htmlContent, List<Issue> issues) { }
