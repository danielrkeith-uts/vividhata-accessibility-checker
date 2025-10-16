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
import com.github.pemistahl.lingua.api.*;

import java.util.List;
import java.util.ArrayList;

@Service
public class LanguageChangesChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.LANGUAGE_CHANGE_NOT_MARKED;
    
    @Autowired
    private INodeParser nodeParser; 
    private final LanguageDetector detector;

    public LanguageChangesChecker() {
        this.detector = LanguageDetectorBuilder.fromAllLanguages().build();
    }

   
    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();
        
        Element htmlElement = document.getDocumentElement();
        String defaultLanguage = (htmlElement != null) ? htmlElement.getAttribute("lang") : null;

        NodeList allNodes = document.getElementsByTagName("*");
        for (int i = 0; i < allNodes.getLength(); i++) {
            Element element = (Element) allNodes.item(i);
            String language = element.getAttribute("lang");

            if (language.isEmpty()) {
                String textContent = element.getTextContent().trim();
                if (textContent.length() > 3 && textContent.matches(".*[a-zA-Z].*") && defaultLanguage != null) {
                    String htmlLang = defaultLanguage.split("-")[0].toLowerCase();
                    Language detected = detector.detectLanguageOf(textContent);
                    String detectedLang = detected.toString().substring(0,2).toLowerCase();
                    if (!detectedLang.equals(htmlLang)) {
                        issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                    }
                }
            }
        }

        return issues;
    }
}