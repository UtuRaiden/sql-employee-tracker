INSERT INTO department (department_name)
VALUES  ("Human Resources"),
        ("I.T."),
        ("Environmental Services");

INSERT INTO roles(title,salary,department_id)
VALUES  ("HR Ops Manager", 100000.00, 1),
        ("HR Supervisor", 60000.00, 1),
        ("HR Lead", 30000.00, 1),
        ("HR Employee", 25000.00, 1),
        ("IT Ops Manager", 100000.00, 2),
        ("IT Supervisor", 60000.00, 2),
        ("IT Lead", 30000.00, 2),
        ("IT Employee", 25000.00, 2),
        ("EvS Ops Manager", 100000.00, 3),
        ("EvS Supervisor", 60000.00, 3),
        ("EvS Lead", 30000.00, 3),
        ("EvS Employee", 25000.00, 3);

INSERT INTO employee (first_name,last_name,role_id, manager_id)
VALUES  ("Steve", "Jones", 1, NULL),
        ("Janet", "Smith", 2, 1),
        ("Barron", "Peterson", 3, 2),
        ("Dallas", "Moffett", 4, 3),
        ("John", "Makers", 5, NULL),
        ("Aaron", "Patterson", 6, 5),
        ("Johnathon", "Stratton", 7, 6),
        ("Derek", "Mullen", 8, 7),
        ("Matthew", "Frankenson", 9, NULL),
        ("Haven", "Parker", 10, 9),
        ("Cameron", "Jackson", 11, 10),
        ("Jacob", "Nickols", 12, 11);
