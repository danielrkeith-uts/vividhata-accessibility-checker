DROP SCHEMA IF EXISTS ac CASCADE;

CREATE SCHEMA ac;

CREATE TABLE ac.account (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(100) UNIQUE,
    password VARCHAR(100),
    first_name TEXT,
    last_name TEXT
);

CREATE TABLE ac.web_page (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    account_id INT REFERENCES ac.account(id),
    url TEXT,
    UNIQUE(account_id, url)
);

CREATE TABLE ac.page_check (
    id INT PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    web_page_id INT REFERENCES ac.web_page(id),
    time_ran TIMESTAMP WITH TIME ZONE,
    html_content TEXT
)
