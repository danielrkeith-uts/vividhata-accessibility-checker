package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ConsistentComponentsChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.COMPONENTS_NOT_CONSISTENT;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();

        issues.addAll(checkTextComponents(document, "button"));
        issues.addAll(checkTextComponents(document, "a"));
        issues.addAll(checkInputComponents(document, "input"));
        issues.addAll(checkInputComponents(document, "textarea"));
        issues.addAll(checkInputComponents(document, "select"));
        issues.addAll(checkImageComponents(document));
        issues.addAll(checkRoleComponents(document));

        return issues;
    }

    // Check <button> and <a> elements
    private List<Issue> checkTextComponents(Document document, String tagName) {
        List<Issue> issues = new ArrayList<>();
        NodeList nodes = document.getElementsByTagName(tagName);
        Map<String, String> seen = new HashMap<>();

        for (int i = 0; i < nodes.getLength(); i++) {
            Element element = (Element) nodes.item(i);

            // Use id, name, href, onclick, or text as a key
            String key = element.getAttribute("id");
            if (key.isEmpty()) key = element.getAttribute("name");
            if (key.isEmpty() && "a".equals(tagName)) key = element.getAttribute("href");
            if (key.isEmpty() && "button".equals(tagName)) key = element.getAttribute("onclick");
            if (key.isEmpty()) key = element.getTextContent().trim();

            String label = element.getTextContent().trim();
            if (label.isEmpty()) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE,
                        "Missing label for " + tagName + " element " + nodeParser.nodeToHtml(element)));
                continue;
            }

            if (!key.isEmpty()) {
                if (seen.containsKey(key) && !seen.get(key).equalsIgnoreCase(label)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE,
                            "Inconsistent labeling for " + tagName + " with key '" + key + "': '" +
                                    seen.get(key) + "' vs '" + label + "' " +
                                    nodeParser.nodeToHtml(element)));
                } else {
                    seen.put(key, label);
                }
            }
        }
        return issues;
    }

    // Check <input>, <textarea>, <select>
    private List<Issue> checkInputComponents(Document document, String tagName) {
        List<Issue> issues = new ArrayList<>();
        NodeList nodes = document.getElementsByTagName(tagName);
        Map<String, String> seen = new HashMap<>();

        for (int i = 0; i < nodes.getLength(); i++) {
            Element element = (Element) nodes.item(i);
            String id = element.getAttribute("id");
            String type = element.getAttribute("type");
            String key = !id.isEmpty() ? id : tagName + "-" + type;

            String label = getLabel(element);
            if (label == null || label.isEmpty()) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE,
                        "Missing label for " + tagName + " element " + nodeParser.nodeToHtml(element)));
                continue;
            }

            if (seen.containsKey(key) && !seen.get(key).equalsIgnoreCase(label)) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE,
                        "Inconsistent labeling for " + tagName + " type '" + type + "': '" +
                                seen.get(key) + "' vs '" + label + "' " +
                                nodeParser.nodeToHtml(element)));
            } else {
                seen.put(key, label);
            }
        }

        return issues;
    }

    private String getLabel(Element element) {
        Document doc = element.getOwnerDocument();
        String id = element.getAttribute("id");
        if (!id.isEmpty()) {
            NodeList labels = doc.getElementsByTagName("label");
            for (int i = 0; i < labels.getLength(); i++) {
                Element label = (Element) labels.item(i);
                if (id.equals(label.getAttribute("for"))) return label.getTextContent().trim();
            }
        }
        String placeholder = element.getAttribute("placeholder");
        return !placeholder.isEmpty() ? placeholder : null;
    }

    // Check <img> alt consistency
    private List<Issue> checkImageComponents(Document document) {
        List<Issue> issues = new ArrayList<>();
        NodeList images = document.getElementsByTagName("img");
        Map<String, String> seen = new HashMap<>();

        for (int i = 0; i < images.getLength(); i++) {
            Element img = (Element) images.item(i);
            String src = img.getAttribute("src");
            String alt = img.getAttribute("alt");

            if (alt.isEmpty()) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE,
                        "Missing alt text for image " + nodeParser.nodeToHtml(img)));
                continue;
            }

            if (!src.isEmpty()) {
                if (seen.containsKey(src) && !seen.get(src).equalsIgnoreCase(alt)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE,
                            "Inconsistent alt text for image '" + src + "': '" +
                                    seen.get(src) + "' vs '" + alt + "' " +
                                    nodeParser.nodeToHtml(img)));
                } else {
                    seen.put(src, alt);
                }
            }
        }
        return issues;
    }

    // Check role-based components
    private List<Issue> checkRoleComponents(Document document) {
        List<Issue> issues = new ArrayList<>();
        NodeList allNodes = document.getElementsByTagName("*");
        Map<String, String> seenRoles = new HashMap<>();

        for (int i = 0; i < allNodes.getLength(); i++) {
            Element element = (Element) allNodes.item(i);
            String role = element.getAttribute("role");
            if (!role.isEmpty()) {
                String label = element.getTextContent().trim();
                if (label.isEmpty()) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE,
                            "Missing label for role '" + role + "' " + nodeParser.nodeToHtml(element)));
                    continue;
                }
                if (seenRoles.containsKey(role) && !seenRoles.get(role).equalsIgnoreCase(label)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE,
                            "Inconsistent label for role '" + role + "': '" +
                                    seenRoles.get(role) + "' vs '" + label + "' " +
                                    nodeParser.nodeToHtml(element)));
                } else {
                    seenRoles.put(role, label);
                }
            }
        }
        return issues;
    }
}