# Vividhata Accessibility Checker

Accessibility Checker for Vividhata, developed in 41113 Software Development Studio


## Setup environment variables
These environment variables must be set to a password of your choice:
- AC_DB_PASSWORD
- AC_ADMIN_PASSWORD

**Write these passwords down somewhere**

Environment variables can be set in multiple ways; pick one of the below.


### Set environment variables on device
Guide for each OS:  
https://configu.com/blog/setting-env-variables-in-windows-linux-macos-beginners-guide/


### Set environment variables in IntelliJ run configuration
Guide:  
https://www.jetbrains.com/help/idea/program-arguments-and-environment-variables.html#environment_variables


## Setup local PostgreSQL database
Make sure you have postgres installed and can access the `psql` command-line tool.

To log in with the admin user: `psql -U <username>`  
*(username is* `postgres` *by default)*

1. Run `CREATE USER ac_admin_local WITH PASSWORD '<AC_DB_PASSWORD>';`
   * Replace `<AC_DB_PASSWORD>` with the password used for the corresponding environment variable
2. Run `CREATE DATABASE accessibility_checker_local OWNER ac_admin_local;`

Now run the backend API, and use Postman (or some other tool) to rebuild the schema using the API:
1. Create a `POST` request to `http://localhost:8080/api/account/login`
   * Include this body:
   ```
    {
        "username": "admin",
        "password": "<AC_ADMIN_PASSWORD>"
    }
   ```
   * Replace `<AC_ADMIN_PASSWORD>` with the corresponding environment variable
2. Create a `POST` request to `http://localhost:8080/api/admin/db/rebuild-schema`


## Running project locally
The project will only work as intended when both the frontend and backend are running simultaneously


### Backend
1. Navigate terminal to `accessibility-api`
2. Run `mvn package`
3. Run `java -jar target/*.jar`

Alternatively, an IntelliJ run configuration could be used

This will run the backend on port 8080


### Frontend
1. Navigate terminal to `frontend`
2. Run `npm start`
3. Open `http://localhost:3000`
