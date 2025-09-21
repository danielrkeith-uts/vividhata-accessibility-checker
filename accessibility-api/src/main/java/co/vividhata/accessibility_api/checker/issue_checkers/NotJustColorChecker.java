package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

@Service
public class NotJustColorChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.NOT_JUST_COLOR;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();

        NodeList allElements = document.getElementsByTagName("*");
        for (int i = 0; i < allElements.getLength(); i++) {
            Node elementNode = allElements.item(i);
            if (elementNode.getNodeType() == Node.ELEMENT_NODE) {
                Element element = (Element) elementNode;
                if (reliesOnColorAlone(element)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(elementNode)));
                }
            }
        }

        return issues;
    }

    private boolean reliesOnColorAlone(Element element) {
        String textContent = getTextContent(element).trim();
        String style = element.getAttribute("style");
        String className = element.getAttribute("class");
        String id = element.getAttribute("id");

        if (!textContent.isEmpty() && hasMeaningfulText(textContent)) {
            return false;
        }

        if (hasAlternativeIndicators(element)) {
            return false;
        }

        if (hasColorOnlyIndicators(style, className, id)) {
            return true;
        }

        if (hasColorBasedPatterns(style, className, id)) {
            return true;
        }

        return false;
    }

    private boolean hasColorOnlyIndicators(String style, String className, String id) {
        String[] colorOnlyPatterns = {
            "red", "green", "blue", "yellow", "orange", "purple", "pink", "black", "white",
            "success", "error", "warning", "danger", "info", "primary", "secondary",
            "pass", "fail", "ok", "bad", "good", "positive", "negative", "active", "inactive"
        };

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            for (String pattern : colorOnlyPatterns) {
                if (lowerClassName.contains(pattern)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            for (String pattern : colorOnlyPatterns) {
                if (lowerId.contains(pattern)) {
                    return true;
                }
            }
        }

        if (style != null && !style.trim().isEmpty()) {
            String lowerStyle = style.toLowerCase();
            if (hasColorOnlyInStyle(lowerStyle)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasColorOnlyInStyle(String style) {
        Pattern colorPattern = Pattern.compile("color\\s*:\\s*([^;]+)");
        Pattern backgroundColorPattern = Pattern.compile("background-color\\s*:\\s*([^;]+)");
        Pattern borderColorPattern = Pattern.compile("border-color\\s*:\\s*([^;]+)");

        boolean hasColor = colorPattern.matcher(style).find();
        boolean hasBackgroundColor = backgroundColorPattern.matcher(style).find();
        boolean hasBorderColor = borderColorPattern.matcher(style).find();

        if ((hasColor || hasBackgroundColor || hasBorderColor) && !hasOtherVisualIndicators(style)) {
            return true;
        }

        return false;
    }

    private boolean hasOtherVisualIndicators(String style) {
        String[] visualIndicators = {
            "border", "border-style", "border-width", "outline", "text-decoration",
            "font-weight", "font-style", "text-transform", "background-image",
            "box-shadow", "text-shadow", "opacity", "visibility", "display"
        };

        String lowerStyle = style.toLowerCase();
        for (String indicator : visualIndicators) {
            if (lowerStyle.contains(indicator + ":")) {
                return true;
            }
        }

        return false;
    }

    private boolean hasColorBasedPatterns(String style, String className, String id) {
        String[] colorBasedPatterns = {
            "status", "state", "indicator", "flag", "marker", "badge", "label",
            "highlight", "emphasis", "alert", "notification", "message"
        };

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            for (String pattern : colorBasedPatterns) {
                if (lowerClassName.contains(pattern) && hasColorInClassName(lowerClassName)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            for (String pattern : colorBasedPatterns) {
                if (lowerId.contains(pattern) && hasColorInId(lowerId)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean hasColorInClassName(String className) {
        String[] colorWords = {
            "red", "green", "blue", "yellow", "orange", "purple", "pink", "black", "white",
            "success", "error", "warning", "danger", "info", "primary", "secondary"
        };

        for (String color : colorWords) {
            if (className.contains(color)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasColorInId(String id) {
        String[] colorWords = {
            "red", "green", "blue", "yellow", "orange", "purple", "pink", "black", "white",
            "success", "error", "warning", "danger", "info", "primary", "secondary"
        };

        for (String color : colorWords) {
            if (id.contains(color)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasAlternativeIndicators(Element element) {
        if (element.hasAttribute("aria-label") && !element.getAttribute("aria-label").trim().isEmpty()) {
            return true;
        }

        if (element.hasAttribute("aria-labelledby") && !element.getAttribute("aria-labelledby").trim().isEmpty()) {
            return true;
        }

        if (element.hasAttribute("title") && !element.getAttribute("title").trim().isEmpty()) {
            return true;
        }

        if (element.hasAttribute("alt") && !element.getAttribute("alt").trim().isEmpty()) {
            return true;
        }

        if (element.hasAttribute("data-status") || element.hasAttribute("data-state") || 
            element.hasAttribute("data-type") || element.hasAttribute("data-role")) {
            return true;
        }

        if (element.hasAttribute("role") && !element.getAttribute("role").trim().isEmpty()) {
            return true;
        }

        String style = element.getAttribute("style");
        if (style != null && !style.trim().isEmpty() && hasOtherVisualIndicators(style.toLowerCase())) {
            return true;
        }

        return false;
    }

    private boolean hasMeaningfulText(String text) {
        if (text == null || text.trim().isEmpty()) {
            return false;
        }
        
        String cleanText = text.replaceAll("\\s+", "").trim();
        
        return cleanText.length() >= 2;
    }

    private String getTextContent(Element element) {
        StringBuilder text = new StringBuilder();
        NodeList children = element.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.TEXT_NODE) {
                text.append(child.getTextContent());
            } else if (child.getNodeType() == Node.ELEMENT_NODE) {
                text.append(getTextContent((Element) child));
            }
        }
        return text.toString().trim();
    }
}
