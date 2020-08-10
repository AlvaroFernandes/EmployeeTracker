DROP DATABASE IF EXISTS employee_trackerDB;

CREATE DATABASE employee_trackerDB;

USE employee_trackerDB;

CREATE TABLE department
(
    id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role
(
	id INT NOT NULL AUTO_INCREMENT,
    title VARCHAR(30),
    salary DECIMAL(10,2),
    departament_id int,
    PRIMARY KEY (id),
    FOREIGN KEY (departament_id) REFERENCES department(id)
);

CREATE TABLE manager
(
	id INT NOT NULL AUTO_INCREMENT,
    name VARCHAR(30),
	PRIMARY KEY(id)
);

CREATE TABLE employee
(
	id INT NOT NULL AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id int,
    manager_id int,
	PRIMARY KEY(id),
    FOREIGN KEY (role_id) REFERENCES role(id),
	FOREIGN KEY (manager_id) REFERENCES manager(id)
);



