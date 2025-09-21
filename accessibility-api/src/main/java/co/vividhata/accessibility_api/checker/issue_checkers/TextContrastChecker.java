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
import java.util.regex.Matcher;
import java.util.regex.Pattern;

@Service
public class TextContrastChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.TEXT_CONTRAST_VIOLATION;
    private static final double MINIMUM_CONTRAST_RATIO = 4.5;

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
                if (hasTextContent(element) && hasContrastViolation(element)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(elementNode)));
                }
            }
        }

        return issues;
    }

    private boolean hasTextContent(Element element) {
        String textContent = getTextContent(element).trim();
        return !textContent.isEmpty() && textContent.length() >= 2;
    }

    private boolean hasContrastViolation(Element element) {
        String style = element.getAttribute("style");
        String className = element.getAttribute("class");
        String id = element.getAttribute("id");

        String textColor = getTextColor(style, className, id);
        String backgroundColor = getBackgroundColor(style, className, id);

        if (textColor == null || backgroundColor == null) {
            return false;
        }

        double contrastRatio = calculateContrastRatio(textColor, backgroundColor);
        
        return contrastRatio < MINIMUM_CONTRAST_RATIO;
    }

    private String getTextColor(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            String color = extractColorFromStyle(style, "color");
            if (color != null) {
                return color;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            String color = extractColorFromClassName(className);
            if (color != null) {
                return color;
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String color = extractColorFromId(id);
            if (color != null) {
                return color;
            }
        }

        return "black";
    }

    private String getBackgroundColor(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            String color = extractColorFromStyle(style, "background-color");
            if (color != null) {
                return color;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            String color = extractBackgroundColorFromClassName(className);
            if (color != null) {
                return color;
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String color = extractBackgroundColorFromId(id);
            if (color != null) {
                return color;
            }
        }

        return "white";
    }

    private String extractColorFromStyle(String style, String property) {
        String lowerStyle = style.toLowerCase();
        Pattern pattern = Pattern.compile(property + "\\s*:\\s*([^;]+)");
        Matcher matcher = pattern.matcher(lowerStyle);
        
        if (matcher.find()) {
            String colorValue = matcher.group(1).trim();
            return normalizeColorValue(colorValue);
        }
        
        return null;
    }

    private String extractColorFromClassName(String className) {
        String lowerClassName = className.toLowerCase();
        
        String[] colorPatterns = {
            "text-red", "text-green", "text-blue", "text-yellow", "text-orange", "text-purple", "text-pink", "text-black", "text-white", "text-gray", "text-grey",
            "color-red", "color-green", "color-blue", "color-yellow", "color-orange", "color-purple", "color-pink", "color-black", "color-white", "color-gray", "color-grey",
            "red-text", "green-text", "blue-text", "yellow-text", "orange-text", "purple-text", "pink-text", "black-text", "white-text", "gray-text", "grey-text"
        };
        
        for (String pattern : colorPatterns) {
            if (lowerClassName.contains(pattern)) {
                return extractColorFromPattern(pattern);
            }
        }
        
        return null;
    }

    private String extractColorFromId(String id) {
        String lowerId = id.toLowerCase();
        
        String[] colorPatterns = {
            "text-red", "text-green", "text-blue", "text-yellow", "text-orange", "text-purple", "text-pink", "text-black", "text-white", "text-gray", "text-grey",
            "color-red", "color-green", "color-blue", "color-yellow", "color-orange", "color-purple", "color-pink", "color-black", "color-white", "color-gray", "color-grey",
            "red-text", "green-text", "blue-text", "yellow-text", "orange-text", "purple-text", "pink-text", "black-text", "white-text", "gray-text", "grey-text"
        };
        
        for (String pattern : colorPatterns) {
            if (lowerId.contains(pattern)) {
                return extractColorFromPattern(pattern);
            }
        }
        
        return null;
    }

    private String extractBackgroundColorFromClassName(String className) {
        String lowerClassName = className.toLowerCase();
        
        String[] bgColorPatterns = {
            "bg-red", "bg-green", "bg-blue", "bg-yellow", "bg-orange", "bg-purple", "bg-pink", "bg-black", "bg-white", "bg-gray", "bg-grey",
            "background-red", "background-green", "background-blue", "background-yellow", "background-orange", "background-purple", "background-pink", "background-black", "background-white", "background-gray", "background-grey",
            "red-bg", "green-bg", "blue-bg", "yellow-bg", "orange-bg", "purple-bg", "pink-bg", "black-bg", "white-bg", "gray-bg", "grey-bg"
        };
        
        for (String pattern : bgColorPatterns) {
            if (lowerClassName.contains(pattern)) {
                return extractColorFromPattern(pattern);
            }
        }
        
        return null;
    }

    private String extractBackgroundColorFromId(String id) {
        String lowerId = id.toLowerCase();
        
        String[] bgColorPatterns = {
            "bg-red", "bg-green", "bg-blue", "bg-yellow", "bg-orange", "bg-purple", "bg-pink", "bg-black", "bg-white", "bg-gray", "bg-grey",
            "background-red", "background-green", "background-blue", "background-yellow", "background-orange", "background-purple", "background-pink", "background-black", "background-white", "background-gray", "background-grey",
            "red-bg", "green-bg", "blue-bg", "yellow-bg", "orange-bg", "purple-bg", "pink-bg", "black-bg", "white-bg", "gray-bg", "grey-bg"
        };
        
        for (String pattern : bgColorPatterns) {
            if (lowerId.contains(pattern)) {
                return extractColorFromPattern(pattern);
            }
        }
        
        return null;
    }

    private String extractColorFromPattern(String pattern) {
        if (pattern.contains("red")) return "red";
        if (pattern.contains("green")) return "green";
        if (pattern.contains("blue")) return "blue";
        if (pattern.contains("yellow")) return "yellow";
        if (pattern.contains("orange")) return "orange";
        if (pattern.contains("purple")) return "purple";
        if (pattern.contains("pink")) return "pink";
        if (pattern.contains("black")) return "black";
        if (pattern.contains("white")) return "white";
        if (pattern.contains("gray") || pattern.contains("grey")) return "gray";
        return null;
    }

    private String normalizeColorValue(String colorValue) {
        String lowerColor = colorValue.toLowerCase().trim();
        
        switch (lowerColor) {
            case "red": return "red";
            case "green": return "green";
            case "blue": return "blue";
            case "yellow": return "yellow";
            case "orange": return "orange";
            case "purple": return "purple";
            case "pink": return "pink";
            case "black": return "black";
            case "white": return "white";
            case "gray":
            case "grey": return "gray";
            default:
                return lowerColor;
        }
    }

    private double calculateContrastRatio(String color1, String color2) {
        int[] rgb1 = colorToRgb(color1);
        int[] rgb2 = colorToRgb(color2);
        
        double lum1 = calculateRelativeLuminance(rgb1);
        double lum2 = calculateRelativeLuminance(rgb2);
        
        double lighter = Math.max(lum1, lum2);
        double darker = Math.min(lum1, lum2);
        
        return (lighter + 0.05) / (darker + 0.05);
    }

    private int[] colorToRgb(String color) {
        String lowerColor = color.toLowerCase().trim();
        
        switch (lowerColor) {
            case "black": return new int[]{0, 0, 0};
            case "white": return new int[]{255, 255, 255};
            case "red": return new int[]{255, 0, 0};
            case "green": return new int[]{0, 128, 0};
            case "blue": return new int[]{0, 0, 255};
            case "yellow": return new int[]{255, 255, 0};
            case "orange": return new int[]{255, 165, 0};
            case "purple": return new int[]{128, 0, 128};
            case "pink": return new int[]{255, 192, 203};
            case "gray":
            case "grey": return new int[]{128, 128, 128};
            default:
                if (lowerColor.startsWith("#")) {
                    return parseHexColor(lowerColor);
                } else {
                    return new int[]{0, 0, 0};
                }
        }
    }

    private int[] parseHexColor(String hex) {
        try {
            String cleanHex = hex.replace("#", "");
            if (cleanHex.length() == 3) {
                int r = Integer.parseInt(cleanHex.substring(0, 1) + cleanHex.substring(0, 1), 16);
                int g = Integer.parseInt(cleanHex.substring(1, 2) + cleanHex.substring(1, 2), 16);
                int b = Integer.parseInt(cleanHex.substring(2, 3) + cleanHex.substring(2, 3), 16);
                return new int[]{r, g, b};
            } else if (cleanHex.length() == 6) {
                int r = Integer.parseInt(cleanHex.substring(0, 2), 16);
                int g = Integer.parseInt(cleanHex.substring(2, 4), 16);
                int b = Integer.parseInt(cleanHex.substring(4, 6), 16);
                return new int[]{r, g, b};
            }
        } catch (NumberFormatException e) {
        }
        
        return new int[]{0, 0, 0};
    }

    private double calculateRelativeLuminance(int[] rgb) {
        double r = rgb[0] / 255.0;
        double g = rgb[1] / 255.0;
        double b = rgb[2] / 255.0;
        
        r = r <= 0.03928 ? r / 12.92 : Math.pow((r + 0.055) / 1.055, 2.4);
        g = g <= 0.03928 ? g / 12.92 : Math.pow((g + 0.055) / 1.055, 2.4);
        b = b <= 0.03928 ? b / 12.92 : Math.pow((b + 0.055) / 1.055, 2.4);
        
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
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
