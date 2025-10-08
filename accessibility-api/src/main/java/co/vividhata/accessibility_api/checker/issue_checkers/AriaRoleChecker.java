package co.vividhata.accessibility_api.checker.issue_checkers;

import co.vividhata.accessibility_api.checker.IIssueChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.INodeParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.NamedNodeMap;
import org.w3c.dom.NodeList;

import java.util.*;

@Service
public class AriaRoleChecker implements IIssueChecker {
    private static final IssueType ISSUE_TYPE = IssueType.ARIA_ROLE_MISSING_OR_INVALID;

    @Autowired
    private INodeParser nodeParser;

    private static final Set<String> VALID_ROLES = new HashSet<>();
    static {
        String[] roles = {
        "alert", "alertdialog", "application", "article", "banner", "button", "cell", "checkbox",
        "columnheader", "combobox", "complementary", "contentinfo", "definition", "dialog",
        "directory", "document", "feed", "figure", "form", "grid", "gridcell", "group", "heading",
        "img", "link", "list", "listbox", "listitem", "log", "main", "marquee", "math", "menu",
        "menubar", "menuitem", "menuitemcheckbox", "menuitemradio", "navigation", "note",
        "option", "presentation", "progressbar", "radio", "radiogroup", "region", "row",
        "rowgroup", "rowheader", "scrollbar", "search", "searchbox", "separator", "slider",
        "spinbutton", "status", "switch", "tab", "table", "tablist", "tabpanel", "textbox",
        "timer", "toolbar", "tooltip", "tree", 	"treegrid",	"treeitem"
        };
        Collections.addAll(VALID_ROLES, roles);
    }

    private static final Map<String, String> NATIVE_ROLES = new HashMap<>();
    static {
        NATIVE_ROLES.put("a", "link");
        NATIVE_ROLES.put("button", "button");
        NATIVE_ROLES.put("input", "textbox"); 
        NATIVE_ROLES.put("select", "listbox");
        NATIVE_ROLES.put("textarea", "textbox");
        NATIVE_ROLES.put("img", "img");
        NATIVE_ROLES.put("table", "table");
        NATIVE_ROLES.put("th", "columnheader");
        NATIVE_ROLES.put("td", "cell");
        NATIVE_ROLES.put("ul", "list");
        NATIVE_ROLES.put("ol", "list");
        NATIVE_ROLES.put("li", "listitem"); 
        NATIVE_ROLES.put("form", "form");
        NATIVE_ROLES.put("header", "banner");
        NATIVE_ROLES.put("footer", "contentinfo");
        NATIVE_ROLES.put("main", "main");
        NATIVE_ROLES.put("nav", "navigation");
        NATIVE_ROLES.put("section", "region");
        NATIVE_ROLES.put("article", "article");
        NATIVE_ROLES.put("aside", "complementary");
        NATIVE_ROLES.put("dialog", "dialog");
        NATIVE_ROLES.put("progress", "progressbar");
        NATIVE_ROLES.put("fieldset", "group");
        NATIVE_ROLES.put("legend", "heading");
        NATIVE_ROLES.put("output", "status");
        NATIVE_ROLES.put("details", "group");
        NATIVE_ROLES.put("summary", "button");
        NATIVE_ROLES.put("video", "application");
        NATIVE_ROLES.put("audio", "application");
        NATIVE_ROLES.put("canvas", "application");
        NATIVE_ROLES.put("svg", "img");
        NATIVE_ROLES.put("math", "math");
    }


    @Override
    public List<Issue> check(Document document) {
        List<Issue> issues = new ArrayList<>();

        NodeList nodes = document.getElementsByTagName("*");
        for (int i = 0; i < nodes.getLength(); i++) {
            Element element = (Element) nodes.item(i);
            String tagName = element.getTagName().toLowerCase();
            String role = element.getAttribute("role").trim().toLowerCase();

            if ((tagName.equals("div") || tagName.equals("span") || tagName.equals("p")) && role.isEmpty()) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
            }

            if (!role.isEmpty() && !VALID_ROLES.contains(role)) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
            }

            String nativeRole = NATIVE_ROLES.get(tagName);
            if (nativeRole != null && !role.isEmpty() && !role.equals(nativeRole)) {
                issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
            }

            NamedNodeMap attributes = element.getAttributes();
            for (int j = 0; j < attributes.getLength(); j++) {
                String attrName = attributes.item(j).getNodeName();
                if (attrName.startsWith("aria-")) {
                    String value = element.getAttribute(attrName).trim();
                    if (value.isEmpty()) {
                        issues.add(new Issue(-1, -1, ISSUE_TYPE, nodeParser.nodeToHtml(element)));
                    }
                }
            }
        }

        return issues;
    }
}

