# Vividhata Accessibility Checker

Accessibility Checker for Vividhata, developed in 41113 Software Development Studio

## Setup local postgres database
Make sure you have postgres installed and can access the `psql` command-line tool.

To log in with the admin user: `psql -U <username>`  
*(username is* `postgres` *by default)*

1. Run `CREATE USER ac_admin_local WITH PASSWORD 'fywkAm-vivhu4-nijgeq';`
2. Run `CREATE DATABASE accessibility_checker_local OWNER ac_admin_local;`

Now run the backend API, and use Postman (or some other tool) to `Post` to the endpoint `http://localhost:8000/api/admin/db/rebuild-schema`

## Running project locally
The project will only work as intended when both the frontend and backend are running simultaneously

### Backend
1. Navigate terminal to `accessibility-api`
2. Run `mvn package`
3. Run `java -jar target/*.jar`

This will run the backend on port 8000

### Frontend
1. Navigate terminal to `frontend`
2. Run `npm start`
3. Open `http://localhost:3000`
