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
public class TextResizeChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.TEXT_RESIZE_VIOLATION;

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
                if (hasTextResizeViolation(element)) {
                    issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(elementNode)));
                }
            }
        }

        return issues;
    }

    private boolean hasTextResizeViolation(Element element) {
        String style = element.getAttribute("style");
        String className = element.getAttribute("class");
        String id = element.getAttribute("id");

        if (hasFixedFontSize(style, className, id)) {
            return true;
        }

        if (hasFixedDimensions(style, className, id)) {
            return true;
        }

        if (hasOverflowHidden(style, className, id)) {
            return true;
        }

        if (hasWhiteSpaceNoWrap(style, className, id)) {
            return true;
        }

        if (hasFixedPositioning(style, className, id)) {
            return true;
        }

        if (hasAbsolutePositioningWithFixedDimensions(style, className, id)) {
            return true;
        }

        return false;
    }

    private boolean hasFixedFontSize(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            String lowerStyle = style.toLowerCase();
            
            Pattern fixedFontSizePattern = Pattern.compile("font-size\\s*:\\s*([0-9.]+)\\s*(px|pt|pc|in|cm|mm)");
            Matcher matcher = fixedFontSizePattern.matcher(lowerStyle);
            
            if (matcher.find()) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            
            String[] fixedFontSizePatterns = {
                "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl",
                "font-xs", "font-sm", "font-base", "font-lg", "font-xl", "font-2xl", "font-3xl", "font-4xl", "font-5xl", "font-6xl",
                "size-xs", "size-sm", "size-base", "size-lg", "size-xl", "size-2xl", "size-3xl", "size-4xl", "size-5xl", "size-6xl"
            };
            
            for (String pattern : fixedFontSizePatterns) {
                if (lowerClassName.contains(pattern)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            
            String[] fixedFontSizePatterns = {
                "text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl", "text-4xl", "text-5xl", "text-6xl",
                "font-xs", "font-sm", "font-base", "font-lg", "font-xl", "font-2xl", "font-3xl", "font-4xl", "font-5xl", "font-6xl",
                "size-xs", "size-sm", "size-base", "size-lg", "size-xl", "size-2xl", "size-3xl", "size-4xl", "size-5xl", "size-6xl"
            };
            
            for (String pattern : fixedFontSizePatterns) {
                if (lowerId.contains(pattern)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean hasFixedDimensions(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            String lowerStyle = style.toLowerCase();

            Pattern fixedWidthPattern = Pattern.compile("width\\s*:\\s*([0-9.]+)\\s*(px|pt|pc|in|cm|mm)");
            Pattern fixedHeightPattern = Pattern.compile("height\\s*:\\s*([0-9.]+)\\s*(px|pt|pc|in|cm|mm)");
            
            if (fixedWidthPattern.matcher(lowerStyle).find() || fixedHeightPattern.matcher(lowerStyle).find()) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            
            String[] fixedDimensionPatterns = {
                "w-", "h-", "width-", "height-", "size-", "fixed-", "static-"
            };
            
            for (String pattern : fixedDimensionPatterns) {
                if (lowerClassName.contains(pattern)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            
            String[] fixedDimensionPatterns = {
                "w-", "h-", "width-", "height-", "size-", "fixed-", "static-"
            };
            
            for (String pattern : fixedDimensionPatterns) {
                if (lowerId.contains(pattern)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean hasOverflowHidden(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            String lowerStyle = style.toLowerCase();
            
            if (lowerStyle.contains("overflow: hidden") || lowerStyle.contains("overflow:hidden")) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            
            String[] overflowHiddenPatterns = {
                "overflow-hidden", "overflowhidden", "hidden", "clip", "truncate"
            };
            
            for (String pattern : overflowHiddenPatterns) {
                if (lowerClassName.contains(pattern)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            
            String[] overflowHiddenPatterns = {
                "overflow-hidden", "overflowhidden", "hidden", "clip", "truncate"
            };
            
            for (String pattern : overflowHiddenPatterns) {
                if (lowerId.contains(pattern)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean hasWhiteSpaceNoWrap(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            String lowerStyle = style.toLowerCase();
            
            if (lowerStyle.contains("white-space: nowrap") || lowerStyle.contains("white-space:nowrap")) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            
            String[] nowrapPatterns = {
                "whitespace-nowrap", "whitespacenowrap", "nowrap", "no-wrap", "text-nowrap"
            };
            
            for (String pattern : nowrapPatterns) {
                if (lowerClassName.contains(pattern)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            
            String[] nowrapPatterns = {
                "whitespace-nowrap", "whitespacenowrap", "nowrap", "no-wrap", "text-nowrap"
            };
            
            for (String pattern : nowrapPatterns) {
                if (lowerId.contains(pattern)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean hasFixedPositioning(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            String lowerStyle = style.toLowerCase();
            
            if (lowerStyle.contains("position: fixed") || lowerStyle.contains("position:fixed")) {
                return true;
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            
            String[] fixedPositioningPatterns = {
                "fixed", "position-fixed", "pos-fixed", "sticky", "position-sticky", "pos-sticky"
            };
            
            for (String pattern : fixedPositioningPatterns) {
                if (lowerClassName.contains(pattern)) {
                    return true;
                }
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            
            String[] fixedPositioningPatterns = {
                "fixed", "position-fixed", "pos-fixed", "sticky", "position-sticky", "pos-sticky"
            };
            
            for (String pattern : fixedPositioningPatterns) {
                if (lowerId.contains(pattern)) {
                    return true;
                }
            }
        }

        return false;
    }

    private boolean hasAbsolutePositioningWithFixedDimensions(String style, String className, String id) {
        if (style != null && !style.trim().isEmpty()) {
            String lowerStyle = style.toLowerCase();
            
            if (lowerStyle.contains("position: absolute") || lowerStyle.contains("position:absolute")) {
                Pattern fixedWidthPattern = Pattern.compile("width\\s*:\\s*([0-9.]+)\\s*(px|pt|pc|in|cm|mm)");
                Pattern fixedHeightPattern = Pattern.compile("height\\s*:\\s*([0-9.]+)\\s*(px|pt|pc|in|cm|mm)");
                
                if (fixedWidthPattern.matcher(lowerStyle).find() || fixedHeightPattern.matcher(lowerStyle).find()) {
                    return true;
                }
            }
        }

        if (className != null && !className.trim().isEmpty()) {
            String lowerClassName = className.toLowerCase();
            
            String[] absolutePositioningPatterns = {
                "absolute", "position-absolute", "pos-absolute"
            };
            
            String[] fixedDimensionPatterns = {
                "w-", "h-", "width-", "height-", "size-"
            };
            
            boolean hasAbsolute = false;
            boolean hasFixedDimensions = false;
            
            for (String pattern : absolutePositioningPatterns) {
                if (lowerClassName.contains(pattern)) {
                    hasAbsolute = true;
                    break;
                }
            }
            
            for (String pattern : fixedDimensionPatterns) {
                if (lowerClassName.contains(pattern)) {
                    hasFixedDimensions = true;
                    break;
                }
            }
            
            if (hasAbsolute && hasFixedDimensions) {
                return true;
            }
        }

        if (id != null && !id.trim().isEmpty()) {
            String lowerId = id.toLowerCase();
            
            String[] absolutePositioningPatterns = {
                "absolute", "position-absolute", "pos-absolute"
            };
            
            String[] fixedDimensionPatterns = {
                "w-", "h-", "width-", "height-", "size-"
            };
            
            boolean hasAbsolute = false;
            boolean hasFixedDimensions = false;
            
            for (String pattern : absolutePositioningPatterns) {
                if (lowerId.contains(pattern)) {
                    hasAbsolute = true;
                    break;
                }
            }
            
            for (String pattern : fixedDimensionPatterns) {
                if (lowerId.contains(pattern)) {
                    hasFixedDimensions = true;
                    break;
                }
            }
            
            if (hasAbsolute && hasFixedDimensions) {
                return true;
            }
        }

        return false;
    }
}
