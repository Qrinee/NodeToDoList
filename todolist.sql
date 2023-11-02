DROP DATABASE IF EXISTS todolist;
CREATE DATABASE todolist;
USE todolist;

CREATE TABLE users (
	id_users INT NOT NULL AUTO_INCREMENT UNIQUE,
	userstatus TEXT NOT NULL DEFAULT "basic",
	PRIMARY KEY(id_users)
) Engine=InnoDB DEFAULT CHARACTER SET 'utf8' COLLATE 'utf8_polish_ci';

CREATE TABLE categories (
	id_categories INT NOT NULL AUTO_INCREMENT,
	categoryname TEXT NOT NULL,
	PRIMARY KEY(id_categories)
) Engine=InnoDB DEFAULT CHARACTER SET 'utf8' COLLATE 'utf8_polish_ci';

CREATE TABLE tasks (
	id_tasks INT NOT NULL AUTO_INCREMENT UNIQUE,
	taskname TEXT NOT NULL,
	iscompleted BOOLEAN NOT NULL DEFAULT 0,
	PRIMARY KEY(id_tasks),
	id_categories INT NOT NULL,
		CONSTRAINT tasks_id_categories_fk
		FOREIGN KEY (id_categories)
		REFERENCES categories(id_categories),
	id_users INT NOT NULL,
		CONSTRAINT tasks_id_users_fk
		FOREIGN KEY(id_users)
		REFERENCES users(id_users)
) Engine=InnoDB DEFAULT CHARACTER SET 'utf8' COLLATE 'utf8_polish_ci';