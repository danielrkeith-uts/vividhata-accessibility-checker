# Vividhata Accessibility Checker

Website accessibility checker developed for Vividhata. Designed to accept the URL of a website and check that website for WCAG violations.

## Setting up project locally

### Set environment variables

Environment variables can be set globally on the machine used to run the project, or
in the run configuration used to launch the project (e.g. through IntelliJ). Research
the correct way to set environment variables for your device or IDE.

The following environment variables must be set to values of your own choice:
- `AC_DB_PASSWORD`
- `AC_ADMIN_PASSWORD`

These passwords will be used for setup later, so write them down somewhere.

### Setup local PostgreSql database
Ensure you have postgres installed and can access the `psql` command-line tool.

Login with the admin user using `psql -U <username>`  
*(username is* `postgres` *by default)*

Run the following to create the database, replacing `<AC_DB_PASSWORD>` with the
corresponding environment variable.

```sql
CREATE USER ac_admin_local WITH PASSWORD '<AC_DB_PASSWORD>';
CREATE DATABASE accessibility_checker_local OWNER ac_admin_local;
```

## Running project locally

### Backend
To run the backend, run the following in the root directory.

```bash
cd accessibility-api
mvn package
java -jar target/*.jar
```

This will host the backend API at `http://localhost:8080`

**If running the backend for the first time (or after a change to the DB schema),**
call the API to build the database schema, replacing `<AC_ADMIN_PASSWORD>` with the
corresponding environment variable. This can be done with an API tool (e.g. Postman).

|          |     |
| -------- | --- |
| Method   | `POST` |
| Endpoint | `http://localhost:8080/api/admin/db/rebuild-schema` |
| Headers  | `ADMIN-AUTHENTICATION: <AC_ADMIN_PASSWORD>` |

### Frontend
To run the frontend, run the following in the root directory.

```bash
cd frontend
npm install
npm start
```

This will host the frontend at `http://localhost:3000`

## Understanding the project's structure
This project is split into two distinct parts:
- A backend API (built in Java using Spring Boot)
- A frontend web app (built in TypeScript using React)

Inside the backend folder (`accessibility-api`) are two more pieces of documentation:
- `README.md` outlining how to use the API, and all of the available endpoints
- `ImplementingIssueCheckers.md` detailing how to implement the logic which checks
the accessibility of a website.

## Preparing for deployment
If this project is to be deployed, multiple project constants may need to be converted to environment variables.
|                              |      |
| ---------------------------- | ---- |
| Variable                     | File |
| `spring.datasource.url`      | `accessibility-api/src/main/resources/application.properties` |
| `spring.datasource.username` | `accessibility-api/src/main/resources/application.properties` |
| `FRONTEND_URL`               | `accessibility-api/src/main/java/co/vividhata/accessibility_api/config/WebSecurityConfig.java` |
| `API_BASE_URL`               | `frontend/src/services/api/apiService.ts` |
