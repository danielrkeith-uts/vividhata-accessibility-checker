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
public class LineHeightSpacingChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.LINE_HEIGHT_SPACING_VIOLATION;

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
                if (hasTextSpacingViolations(element)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(elementNode)));
                }
            }
        }

        return issues;
    }

    private boolean hasTextSpacingViolations(Element element) {
        String style = element.getAttribute("style");
        String className = element.getAttribute("class");
        String id = element.getAttribute("id");

        if (hasProblematicLineHeight(style, className, id)) {
            return true;
        }

        if (hasProblematicLetterSpacing(style, className, id)) {
            return true;
        }

        if (hasProblematicWordSpacing(style, className, id)) {
            return true;
        }

        if (hasProblematicParagraphSpacing(style, className, id)) {
            return true;
        }

        return false;
    }

    private boolean hasProblematicLineHeight(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            if (hasLineHeightViolationInStyle(style)) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            if (hasLineHeightViolationInClassName(className)) {
                return true;
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            if (hasLineHeightViolationInId(id)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasLineHeightViolationInStyle(String style) {
        String lowerStyle = style.toLowerCase();
        
        Pattern lineHeightPattern = Pattern.compile("line-height\\s*:\\s*([^;]+)");
        Matcher matcher = lineHeightPattern.matcher(lowerStyle);
        
        while (matcher.find()) {
            String value = matcher.group(1).trim();
            
            if (isProblematicLineHeightValue(value)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean isProblematicLineHeightValue(String value) {
        if (value.equals("normal") || value.equals("inherit") || value.equals("initial")) {
            return false;
        }

        if (value.endsWith("px")) {
            try {
                double pxValue = Double.parseDouble(value.replace("px", ""));
                return pxValue < 24.0;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        if (value.endsWith("em") || value.endsWith("rem")) {
            try {
                double emValue = Double.parseDouble(value.replace("em", "").replace("rem", ""));
                return emValue < 1.5;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        if (value.matches("\\d+(\\.\\d+)?")) {
            try {
                double numericValue = Double.parseDouble(value);
                return numericValue < 1.5;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        return false;
    }

    private boolean hasLineHeightViolationInClassName(String className) {
        String lowerClassName = className.toLowerCase();
        
        String[] problematicPatterns = {
            "line-height-1", "line-height-1-2", "line-height-1-3", "line-height-1-4",
            "tight", "compact", "condensed", "narrow", "squeezed"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerClassName.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean hasLineHeightViolationInId(String id) {
        String lowerId = id.toLowerCase();
        
        String[] problematicPatterns = {
            "line-height-1", "line-height-1-2", "line-height-1-3", "line-height-1-4",
            "tight", "compact", "condensed", "narrow", "squeezed"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerId.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean hasProblematicLetterSpacing(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            if (hasLetterSpacingViolationInStyle(style)) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            if (hasLetterSpacingViolationInClassName(className)) {
                return true;
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            if (hasLetterSpacingViolationInId(id)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasLetterSpacingViolationInStyle(String style) {
        String lowerStyle = style.toLowerCase();
        
        Pattern letterSpacingPattern = Pattern.compile("letter-spacing\\s*:\\s*([^;]+)");
        Matcher matcher = letterSpacingPattern.matcher(lowerStyle);
        
        while (matcher.find()) {
            String value = matcher.group(1).trim();
            
            if (isProblematicLetterSpacingValue(value)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean isProblematicLetterSpacingValue(String value) {
        if (value.equals("normal") || value.equals("inherit") || value.equals("initial")) {
            return false;
        }

        if (value.endsWith("px")) {
            try {
                double pxValue = Double.parseDouble(value.replace("px", ""));
                return pxValue < 1.92;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        if (value.endsWith("em") || value.endsWith("rem")) {
            try {
                double emValue = Double.parseDouble(value.replace("em", "").replace("rem", ""));
                return emValue < 0.12;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        return false;
    }

    private boolean hasLetterSpacingViolationInClassName(String className) {
        String lowerClassName = className.toLowerCase();
        
        String[] problematicPatterns = {
            "letter-spacing-tight", "letter-spacing-compact", "letter-spacing-condensed",
            "tight-spacing", "compact-spacing", "condensed-spacing"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerClassName.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean hasLetterSpacingViolationInId(String id) {
        String lowerId = id.toLowerCase();
        
        String[] problematicPatterns = {
            "letter-spacing-tight", "letter-spacing-compact", "letter-spacing-condensed",
            "tight-spacing", "compact-spacing", "condensed-spacing"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerId.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean hasProblematicWordSpacing(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            if (hasWordSpacingViolationInStyle(style)) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            if (hasWordSpacingViolationInClassName(className)) {
                return true;
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            if (hasWordSpacingViolationInId(id)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasWordSpacingViolationInStyle(String style) {
        String lowerStyle = style.toLowerCase();
        
        Pattern wordSpacingPattern = Pattern.compile("word-spacing\\s*:\\s*([^;]+)");
        Matcher matcher = wordSpacingPattern.matcher(lowerStyle);
        
        while (matcher.find()) {
            String value = matcher.group(1).trim();
            
            if (isProblematicWordSpacingValue(value)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean isProblematicWordSpacingValue(String value) {
        if (value.equals("normal") || value.equals("inherit") || value.equals("initial")) {
            return false;
        }

        if (value.endsWith("px")) {
            try {
                double pxValue = Double.parseDouble(value.replace("px", ""));
                return pxValue < 2.56;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        if (value.endsWith("em") || value.endsWith("rem")) {
            try {
                double emValue = Double.parseDouble(value.replace("em", "").replace("rem", ""));
                return emValue < 0.16;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        return false;
    }

    private boolean hasWordSpacingViolationInClassName(String className) {
        String lowerClassName = className.toLowerCase();
        
        String[] problematicPatterns = {
            "word-spacing-tight", "word-spacing-compact", "word-spacing-condensed",
            "tight-words", "compact-words", "condensed-words"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerClassName.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean hasWordSpacingViolationInId(String id) {
        String lowerId = id.toLowerCase();
        
        String[] problematicPatterns = {
            "word-spacing-tight", "word-spacing-compact", "word-spacing-condensed",
            "tight-words", "compact-words", "condensed-words"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerId.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean hasProblematicParagraphSpacing(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            if (hasParagraphSpacingViolationInStyle(style)) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            if (hasParagraphSpacingViolationInClassName(className)) {
                return true;
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            if (hasParagraphSpacingViolationInId(id)) {
                return true;
            }
        }

        return false;
    }

    private boolean hasParagraphSpacingViolationInStyle(String style) {
        String lowerStyle = style.toLowerCase();
        
        Pattern marginPattern = Pattern.compile("margin(?:-bottom)?\\s*:\\s*([^;]+)");
        Matcher matcher = marginPattern.matcher(lowerStyle);
        
        while (matcher.find()) {
            String value = matcher.group(1).trim();
            
            if (isProblematicParagraphSpacingValue(value)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean isProblematicParagraphSpacingValue(String value) {
        if (value.equals("0") || value.equals("0px") || value.equals("0em") || value.equals("0rem")) {
            return true;
        }

        if (value.endsWith("px")) {
            try {
                double pxValue = Double.parseDouble(value.replace("px", ""));
                return pxValue < 2.0;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        if (value.endsWith("em") || value.endsWith("rem")) {
            try {
                double emValue = Double.parseDouble(value.replace("em", "").replace("rem", ""));
                return emValue < 0.2;
            } catch (NumberFormatException e) {
                return false;
            }
        }

        return false;
    }

    private boolean hasParagraphSpacingViolationInClassName(String className) {
        String lowerClassName = className.toLowerCase();
        
        String[] problematicPatterns = {
            "no-margin", "zero-margin", "tight-margin", "compact-margin",
            "margin-0", "margin-zero", "margin-tight", "margin-compact"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerClassName.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }

    private boolean hasParagraphSpacingViolationInId(String id) {
        String lowerId = id.toLowerCase();
        
        String[] problematicPatterns = {
            "no-margin", "zero-margin", "tight-margin", "compact-margin",
            "margin-0", "margin-zero", "margin-tight", "margin-compact"
        };
        
        for (String pattern : problematicPatterns) {
            if (lowerId.contains(pattern)) {
                return true;
            }
        }
        
        return false;
    }
}
