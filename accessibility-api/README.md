# Accessibility Checker API

## Setup
Setup is detailed in the `README.md` in the root folder for the project.

## Using the API
The API is designed to be used from the frontend. However, for testing, a tool like Postman which can hit an endpoint directly can be used.

All API endpoints come from the base url `http://localhost:8080/api` when run locally. For example, to hit the `/account/create` endpoint, you should hit `http://localhost:8080/api/account/create`

Any endpoints that require a login will return a `401 UNAUTHORIZED` if they are hit without first hitting the `/account/login` endpoint.
- To check if any account is logged in, hit any endpoint that requires a login (e.g. `/account/me`) and see if it returns a `401`.


All endpoints will return a `200 OK` if they succeed, and may or may not return data in the response as well.

## Endpoints

### Admin

---

#### `POST /admin/db/rebuild-schema`
Rebuilds the schema, erasing all data. Should be done after any update to the backend.

Requires login: *false*

Requires the following header:
- Key: `ADMIN-AUTHENTICATION`
- Value: The API admin password set during setup

No body required.


Returns no significant data.

### Account

---

#### `POST /account/create`
Requires login: *false*

Body contents (JSON):
```json
{
    "username": "gregory.example.1",
    "password": "gregory.password.1",
    "firstName": "Gregory",
    "lastName": "Example"
}
```

Can return a `400 BAD REQUEST` if there is some error with the request, including:
- Username is taken
- Password is invalid

Returns no significant data.

---

#### `POST /account/login`
Requires login: *false*

Body contents (JSON):
```json
{
    "username": "gregory.example.1",
    "password": "gregory.password.1"
}
```

Can return a `401 UNAUTHORIZED` if the credentials are incorrect.

Returns no significant data.

---

#### `POST /account/logout`
Requires login: *true*

No body required.

Returns no significant data.

---

#### `GET /account/me`
Requires login: *true*

No body required.

Returns (JSON):
```json
{
    "username": "gregory.example.1",
    "id": 1
}
```
---

### Web Pages

---

#### `GET /web-pages`
Fetches all the web pages scanned in the past on the currently logged in account.

Requires login: *true*

No body required.

Returns (JSON):
```json
[
    {
        "id": 1,
        "accountId": 1,
        "url": "https://www.google.com"
    },
    {
        "id": 1,
        "accountId": 1,
        "url": "https://www.whattimeisitrightnow.com"
    }
]
```

---

#### `GET /web-page/{webPageId}/scans`
Fetches all the scans associated with a single web page.
Replace `webPageId` with the relevant web page id (which can be gotten from the `GET /web-pages` endpoint).

Requires login: *true*

No body required

Returns (JSON):
```json
[
    {
        "id": 2,
        "webPageId": 2,
        "timeScanned": "2025-09-18T02:37:20.996618Z",
        "htmlContent": "<html>Content</html>"
    },
    {
        "id": 3,
        "webPageId": 2,
        "timeScanned": "2025-09-18T06:46:31.900183Z",
        "htmlContent": "<html>Content</html>"
    }
]
```

---

### Scan

___

#### `POST /scan/from-url`
Fetches a website, scans it, and returns the details of that scan, including all issues.

Requires login: *true*

Body contents (Text):
```
https://www.url-to-scan.com
```
*Note: url must include protocol (e.g. `http://` or `https://`)*

Returns (JSON):
```json
{
    "scan": {
          "id": 1,
          "webPageId": 1,
          "timeScanned": "2025-09-10T03:32:11.983352Z",
          "htmlContent": "<html>EntirePageContents</html>"
    },
    "issues": [
        {
            "id": 1,
            "scanId": 1,
            "issueType": "SAMPLE_ISSUE_1",
            "htmlSnippet": "<sample>snippet</sample>"
        },
        {
            "id": 1,
            "scanId": 2,
            "issueType": "SAMPLE_ISSUE_2",
            "htmlSnippet": "<sample>snippet</sample>"
        }
    ]
}
```

---

#### `GET /scan/{scanId}/issues`
Fetches all the issues associated with a single scan.
Replace `scanId` with the relevant scan id (which can be gotten from the `GET /web-page/{webPageId}/scans` endpoint).

Requires login: *true*

No body required

Returns (JSON):
```json
[
    {
        "id": 1,
        "scanId": 1,
        "issueType": "SAMPLE_ISSUE_1",
        "htmlSnippet": "<sample>snippet</sample>"
    },
    {
        "id": 2,
        "scanId": 1,
        "issueType": "SAMPLE_ISSUE_2",
        "htmlSnippet": "<sample>snippet</sample>"
    }
]
```

#### `GET /scan/{scanId}/links`
Fetches all the links associated with a single scan.
Replace `scanId` with the relevant scan id (which can be gotten from the `GET /web-page/{webPageId}/scans` endpoint).

Requires login: *true*

No body required

Returns (JSON):
```json
[
    {
        "id": 1,
        "link": "https://google.com"
    },
    {
        "id": 2,
        "link": "https://www.whattimeisitrightnow.com"
    }
]
```