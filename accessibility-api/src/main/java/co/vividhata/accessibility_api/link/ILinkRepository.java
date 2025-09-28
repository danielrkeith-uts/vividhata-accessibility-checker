package co.vividhata.accessibility_api.link;

import co.vividhata.accessibility_api.model.Link;

import java.util.List;

public interface ILinkRepository {

    int create(int scanId, String link);

    List<Link> getAll(int scanId);

}
