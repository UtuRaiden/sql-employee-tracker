INSERT INTO department (id, department_name)
VALUES  (001, "Human Resources"),
        (002, "I.T."),
        (003, "Environmental Services");

INSERT INTO roles(id,title,salary,department_id)
VALUES  (1, "Ops Manager", 100000.00, 1),
        (2, "Supervisor", 60000.00, 1),
        (3, "Lead", 30000.00, 1),
        (4, "Employee", 25000.00, 1),
        (5, "Ops Manager", 100000.00, 2),
        (6, "Supervisor", 60000.00, 2),
        (7, "Lead", 30000.00, 2),
        (8, "Employee", 25000.00, 2),
        (9, "Ops Manager", 100000.00, 3),
        (10, "Supervisor", 60000.00, 3),
        (11, "Lead", 30000.00, 3),
        (12, "Employee", 25000.00, 3);

INSERT INTO employee (id,first_name,last_name,role_id, manager_id)
VALUES  (1, "Steve", "Jones", 1, NULL),
        (2, "Janet", "Smith", 2, 1),
        (3, "Barron", "Peterson", 3, 2),
        (4, "Dallas", "Moffett", 4, 3),
        (5, "John", "Makers", 1, NULL),
        (6, "Aaron", "Patterson", 2, 5),
        (7, "Johnathon", "Stratton", 3, 6),
        (8, "Derek", "Mullen", 4, 7),
        (9, "Matthew", "Frankenson", 1, NULL),
        (10, "Haven", "Parker", 2, 9),
        (11, "Cameron", "Jackson", 3, 10),
        (12, "Jacob", "Nickols", 4, 11);
