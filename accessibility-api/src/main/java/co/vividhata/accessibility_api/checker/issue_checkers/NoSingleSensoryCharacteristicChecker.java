package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;

import java.util.ArrayList;
import java.util.List;

@Service
public class NoSingleSensoryCharacteristicChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.NO_SINGLE_SENSORY_CHARACTERISTIC;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();

        NodeList allElements = document.getElementsByTagName("*");

        for (int i = 0; i < allElements.getLength(); i++) {
            Node elementNode = allElements.item(i);
            if (elementNode.getNodeType() == Node.ELEMENT_NODE) {
                if (reliesOnSensoryCharacteristic(elementNode)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(elementNode)));
                }
            }
        }

        return issues;
    }

    private boolean reliesOnSensoryCharacteristic(Node elementNode) {
        if (elementNode.getNodeType() != Node.ELEMENT_NODE) {
            return false;
        }

        org.w3c.dom.Element element = (org.w3c.dom.Element) elementNode;
        String tagName = element.getTagName().toLowerCase();
        String textContent = getTextContent(element).trim();
        String style = element.getAttribute("style");
        String className = element.getAttribute("class");
        String id = element.getAttribute("id");

        if (!textContent.isEmpty() && hasMeaningfulText(textContent)) {
            return false;
        }

        if (reliesOnColorAlone(element, style, className, id)) {
            return true;
        }

        if (reliesOnPositionAlone(element, style, className, id)) {
            return true;
        }

        if (reliesOnShapeAlone(element, style, className, id)) {
            return true;
        }

        if (reliesOnSizeAlone(element, style, className, id)) {
            return true;
        }

        if (tagName.equals("audio") && !hasAlternativeContent(element)) {
            return true;
        }

        return false;
    }


    private boolean reliesOnColorAlone(org.w3c.dom.Element element, String style, String className, String id) {
        String[] colorOnlyPatterns = {
            "red", "green", "blue", "yellow", "orange", "purple", "pink", "black", "white",
            "success", "error", "warning", "danger", "info", "primary", "secondary"
        };

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            for (String pattern : colorOnlyPatterns) {
                if (lowerClassName.contains(pattern) && !hasAlternativeContent(element)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            for (String pattern : colorOnlyPatterns) {
                if (lowerId.contains(pattern) && !hasAlternativeContent(element)) {
                    return true;
                }
            }
        }

        if (style != null && !style.trim().isEmpty()) {
            String lowerStyle = style.toLowerCase();
            if ((lowerStyle.contains("color:") || lowerStyle.contains("background-color:")) 
                && !hasAlternativeContent(element)) {
                return true;
            }
        }

        return false;
    }

    private boolean reliesOnPositionAlone(org.w3c.dom.Element element, String style, String className, String id) {
        String[] positionOnlyPatterns = {
            "left", "right", "top", "bottom", "center", "middle", "first", "last", "above", "below"
        };

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            for (String pattern : positionOnlyPatterns) {
                if (lowerClassName.contains(pattern) && !hasAlternativeContent(element)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            for (String pattern : positionOnlyPatterns) {
                if (lowerId.contains(pattern) && !hasAlternativeContent(element)) {
                    return true;
                }
            }
        }

        return false;
    }


    private boolean reliesOnShapeAlone(org.w3c.dom.Element element, String style, String className, String id) {
        String[] shapeOnlyPatterns = {
            "circle", "square", "triangle", "diamond", "arrow", "star", "heart", "round", "oval"
        };

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            for (String pattern : shapeOnlyPatterns) {
                if (lowerClassName.contains(pattern) && !hasAlternativeContent(element)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            for (String pattern : shapeOnlyPatterns) {
                if (lowerId.contains(pattern) && !hasAlternativeContent(element)) {
                    return true;
                }
            }
        }

        return false;
    }


    private boolean reliesOnSizeAlone(org.w3c.dom.Element element, String style, String className, String id) {
        String[] sizeOnlyPatterns = {
            "small", "large", "big", "tiny", "huge", "mini", "maxi", "compact", "expanded"
        };

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            for (String pattern : sizeOnlyPatterns) {
                if (lowerClassName.contains(pattern) && !hasAlternativeContent(element)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            for (String pattern : sizeOnlyPatterns) {
                if (lowerId.contains(pattern) && !hasAlternativeContent(element)) {
                    return true;
                }
            }
        }

        return false;
    }


    private boolean hasAlternativeContent(org.w3c.dom.Element element) {
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

        String textContent = getTextContent(element).trim();
        if (!textContent.isEmpty() && hasMeaningfulText(textContent)) {
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



    private String getTextContent(org.w3c.dom.Element element) {
        StringBuilder text = new StringBuilder();
        NodeList children = element.getChildNodes();
        for (int i = 0; i < children.getLength(); i++) {
            Node child = children.item(i);
            if (child.getNodeType() == Node.TEXT_NODE) {
                text.append(child.getTextContent());
            } else if (child.getNodeType() == Node.ELEMENT_NODE) {
                text.append(getTextContent((org.w3c.dom.Element) child));
            }
        }
        return text.toString().trim();
    }

}
