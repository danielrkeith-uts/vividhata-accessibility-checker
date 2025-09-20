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

@Service
public class CaptionsForVideoAudioChecker implements IIssueChecker {

    private static final IssueType ISSUE_TYPE = IssueType.CAPTIONS_FOR_VIDEO_AUDIO_MISSING;

    @Autowired
    private INodeParser nodeParser;

    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();

        NodeList videoNodeList = document.getElementsByTagName("video");
        for (int i = 0; i < videoNodeList.getLength(); i++) {
            Node videoNode = videoNodeList.item(i);
            if (!hasCaptions(videoNode)) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(videoNode)));
            }
        }

        NodeList audioNodeList = document.getElementsByTagName("audio");
        for (int i = 0; i < audioNodeList.getLength(); i++) {
            Node audioNode = audioNodeList.item(i);
            if (!hasCaptions(audioNode)) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(audioNode)));
            }
        }

        return issues;
    }


    private boolean hasCaptions(Node mediaNode) {
        NodeList trackNodes = ((org.w3c.dom.Element) mediaNode).getElementsByTagName("track");
        for (int i = 0; i < trackNodes.getLength(); i++) {
            Node trackNode = trackNodes.item(i);
            String kind = getAttributeValue(trackNode, "kind");
            if ("captions".equals(kind) || "subtitles".equals(kind)) {
                return true;
            }
        }

        String ariaDescribedBy = getAttributeValue(mediaNode, "aria-describedby");
        if (ariaDescribedBy != null && !ariaDescribedBy.trim().isEmpty()) {
            return true;
        }

        String ariaLabel = getAttributeValue(mediaNode, "aria-label");
        String ariaLabelledBy = getAttributeValue(mediaNode, "aria-labelledby");
        if ((ariaLabel != null && !ariaLabel.trim().isEmpty()) || 
            (ariaLabelledBy != null && !ariaLabelledBy.trim().isEmpty())) {
            return true;
        }

        return hasTranscriptLink(mediaNode);
    }


    private String getAttributeValue(Node node, String attributeName) {
        if (node.getNodeType() == Node.ELEMENT_NODE) {
            org.w3c.dom.Element element = (org.w3c.dom.Element) node;
            return element.getAttribute(attributeName);
        }
        return null;
    }


    private boolean hasTranscriptLink(Node mediaNode) {
        String[] transcriptKeywords = {
            "transcript", "captions", "subtitles", "subtitle", "caption", 
            "closed caption", "cc", "accessibility", "audio description",
            "text version", "text alternative", "read transcript"
        };

        Node parent = mediaNode.getParentNode();
        if (parent != null && parent.getNodeType() == Node.ELEMENT_NODE) {
            if (hasTranscriptLinkInElement((Element) parent, transcriptKeywords)) {
                return true;
            }
        }

        Node nextSibling = mediaNode.getNextSibling();
        while (nextSibling != null) {
            if (nextSibling.getNodeType() == Node.ELEMENT_NODE) {
                if (hasTranscriptLinkInElement((Element) nextSibling, transcriptKeywords)) {
                    return true;
                }
            }
            nextSibling = nextSibling.getNextSibling();
        }

        Node prevSibling = mediaNode.getPreviousSibling();
        while (prevSibling != null) {
            if (prevSibling.getNodeType() == Node.ELEMENT_NODE) {
                if (hasTranscriptLinkInElement((Element) prevSibling, transcriptKeywords)) {
                    return true;
                }
            }
            prevSibling = prevSibling.getPreviousSibling();
        }

        return false;
    }

    private boolean hasTranscriptLinkInElement(Element element, String[] keywords) {
        NodeList links = element.getElementsByTagName("a");
        for (int i = 0; i < links.getLength(); i++) {
            Node link = links.item(i);
            if (link.getNodeType() == Node.ELEMENT_NODE) {
                Element linkElement = (Element) link;
                String linkText = getTextContent(linkElement).toLowerCase();
                String href = linkElement.getAttribute("href").toLowerCase();
                
                for (String keyword : keywords) {
                    if (linkText.contains(keyword) || href.contains(keyword)) {
                        return true;
                    }
                }
            }
        }

        NodeList buttons = element.getElementsByTagName("button");
        for (int i = 0; i < buttons.getLength(); i++) {
            Node button = buttons.item(i);
            if (button.getNodeType() == Node.ELEMENT_NODE) {
                Element buttonElement = (Element) button;
                String buttonText = getTextContent(buttonElement).toLowerCase();
                
                for (String keyword : keywords) {
                    if (buttonText.contains(keyword)) {
                        return true;
                    }
                }
            }
        }

        return false;
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