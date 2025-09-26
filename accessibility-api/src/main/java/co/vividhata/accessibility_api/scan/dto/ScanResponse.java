package co.vividhata.accessibility_api.scan.dto;

import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.Link;
import co.vividhata.accessibility_api.model.Scan;

import java.util.List;

public record ScanResponse(Scan scan, List<Issue> issues, List<Link> links) { }
