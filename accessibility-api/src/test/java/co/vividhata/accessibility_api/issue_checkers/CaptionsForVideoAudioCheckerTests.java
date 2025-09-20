package co.vividhata.accessibility_api.issue_checkers;

import co.vividhata.accessibility_api.checker.issue_checkers.CaptionsForVideoAudioChecker;
import co.vividhata.accessibility_api.model.Issue;
import co.vividhata.accessibility_api.model.IssueType;
import co.vividhata.accessibility_api.util.IHtmlParser;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.w3c.dom.Document;

import java.util.List;

@SpringBootTest
public class CaptionsForVideoAudioCheckerTests {

    private static final String HTML_WITH_VIDEO_AUDIO_NO_CAPTIONS = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
  </head>
  <body>
    <h1>Media Test Page</h1>
    <video src="video1.mp4" controls></video>
    <audio src="audio1.mp3" controls></audio>
    <video src="video2.mp4" controls>
      <track kind="captions" src="captions.vtt" srclang="en" label="English"/>
    </video>
    <audio src="audio2.mp3" controls aria-describedby="transcript1"></audio>
    <div id="transcript1">This is a transcript of the audio content.</div>
  </body>
</html>""";

    private static final String HTML_WITH_SUBTITLES = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
  </head>
  <body>
    <h1>Media Test Page</h1>
    <video src="video1.mp4" controls>
      <track kind="subtitles" src="subtitles.vtt" srclang="en" label="English"/>
    </video>
    <audio src="audio1.mp3" controls aria-label="Audio description of the content"></audio>
  </body>
</html>""";

    private static final String HTML_WITH_ARIA_LABELLEDBY = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Unit Test Fixture</title>
  </head>
  <body>
    <h1>Media Test Page</h1>
    <video src="video1.mp4" controls aria-labelledby="video-desc"></video>
    <div id="video-desc">This video shows a tutorial on accessibility</div>
    <audio src="audio1.mp3" controls></audio>
  </body>
</html>""";

    @Autowired
    private IHtmlParser htmlParser;
    @Autowired
    private CaptionsForVideoAudioChecker issueChecker;

    @Test
    void testVideoAudioWithoutCaptions() {
        Document document = htmlParser.parse(HTML_WITH_VIDEO_AUDIO_NO_CAPTIONS);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(2, issues.size());
        
        for (Issue issue : issues) {
            Assertions.assertEquals(IssueType.CAPTIONS_FOR_VIDEO_AUDIO_MISSING, issue.issueType());
            Assertions.assertEquals(-1, issue.id());
            Assertions.assertEquals(-1, issue.scanId());
        }
        
        String htmlSnippets = issues.get(0).htmlSnippet() + issues.get(1).htmlSnippet();
        Assertions.assertTrue(htmlSnippets.contains("video1.mp4"));
        Assertions.assertTrue(htmlSnippets.contains("audio1.mp3"));
    }

    @Test
    void testVideoAudioWithCaptions() {
        Document document = htmlParser.parse(HTML_WITH_SUBTITLES);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testVideoWithAriaLabelledBy() {
        Document document = htmlParser.parse(HTML_WITH_ARIA_LABELLEDBY);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(1, issues.size());
        Assertions.assertTrue(issues.get(0).htmlSnippet().contains("audio1.mp3"));
    }

    @Test
    void testEmptyDocument() {
        Document document = htmlParser.parse("<!doctype html><html><body></body></html>");

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testDocumentWithNoMedia() {
        String html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>No Media Page</title>
  </head>
  <body>
    <h1>Regular Page</h1>
    <p>This page has no video or audio elements.</p>
    <img src="image.jpg" alt="Test image"/>
  </body>
</html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testVideoWithTranscriptLink() {
        String html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Video with Transcript</title>
  </head>
  <body>
    <h1>Video with Transcript</h1>
    <div>
      <video src="video1.mp4" controls></video>
      <p><a href="transcript.html">Read Transcript</a></p>
    </div>
    <div>
      <audio src="audio1.mp3" controls></audio>
    </div>
  </body>
</html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);
        Assertions.assertEquals(1, issues.size());
        Assertions.assertTrue(issues.get(0).htmlSnippet().contains("audio1.mp3"));
    }

    @Test
    void testAudioWithCaptionLink() {
        String html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Audio with Captions</title>
  </head>
  <body>
    <h1>Audio with Captions</h1>
    <div>
      <audio src="audio1.mp3" controls></audio>
      <button>View Captions</button>
    </div>
    <div>
      <video src="video1.mp4" controls></video>
    </div>
  </body>
</html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);
        Assertions.assertEquals(1, issues.size());
        Assertions.assertTrue(issues.get(0).htmlSnippet().contains("video1.mp4"));
    }

    @Test
    void testMediaWithSubtitlesLink() {
        String html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Media with Subtitles</title>
  </head>
  <body>
    <h1>Media with Subtitles</h1>
    <video src="video1.mp4" controls></video>
    <a href="subtitles.vtt">Download Subtitles</a>
    <audio src="audio1.mp3" controls></audio>
    <a href="audio-transcript.txt">Audio Transcript</a>
  </body>
</html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }

    @Test
    void testMediaWithAccessibilityLink() {
        String html = """
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8"/>
    <title>Media with Accessibility</title>
  </head>
  <body>
    <h1>Media with Accessibility</h1>
    <video src="video1.mp4" controls></video>
    <p><a href="accessibility.html">Accessibility Options</a></p>
    <audio src="audio1.mp3" controls></audio>
    <button>Closed Caption (CC)</button>
  </body>
</html>""";
        
        Document document = htmlParser.parse(html);

        List<Issue> issues = issueChecker.check(document);

        Assertions.assertEquals(0, issues.size());
    }
}
