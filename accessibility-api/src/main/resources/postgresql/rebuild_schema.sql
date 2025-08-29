DROP SCHEMA IF EXISTS ac CASCADE;

CREATE SCHEMA ac;

CREATE TABLE ac.account (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(100),
    password VARCHAR(100),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    UNIQUE (username, password)
);
