USE employee_trackerDB;

INSERT INTO department (name)
VALUES ("Marketing"),
    ("Sales"),
    ("Legal"),
    ("Human resources");

INSERT INTO role (title, salary, department_id)
VALUES ("Marketing Manager", 175000, 1),
    ("Human resources Manager", 150000, 4),
    ("Legal Manager", 200000, 3),
    ("Sales Manager", 170000, 2),
    ("Marketing Coordinator", 120000, 1),
    ("Salesperson", 85000, 2),
    ("Lawyer", 150000, 3),
    ("Human Resources Recruiter", 90000, 4),
    ("Human Resources Intern", 65000, 4),
    ("Marketing Intern", 65000, 1);


INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ("Mari", "Stevens", 1, NULL),
    ("Jack", "Sparrow", 2, NULL),
    ("John", "Wick", 3, NULL),
    ("Kevin", "Hart", 4, NULL),
    ("Ellen", "Ripley", 5, 1),
    ("Malia", "Brown", 6, 2),
    ("Forrest", "Bondurant", 7, 3),
    ("Mallory", "Kane", 8,4),
    ("Ethan", "Hunt", 9, 4),
    ("Ryan", "Stone",10, 1);