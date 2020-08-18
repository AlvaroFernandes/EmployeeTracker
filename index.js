const connection = require("./config/connection.js");
const { prompt } = require("inquirer");
const table = require("console.table");
const quest = require("./utils/questions.js");
const logo = require('asciiart-logo');



const start = () => {

    console.log(logo({
            name: 'Employee Tracker',
            font: '3D-ASCII',
            lineChars: 10,
            padding: 2,
            margin: 3,
            borderColor: 'grey',
            logoColor: 'bold-green',
            textColor: 'green',
        })
        .emptyLine()
        .right('version 1.0.0')
        .emptyLine()
        .render()
    );


    prompt(quest.Questions).then(async(answers) => {
        const answer = answers.start;
        console.log(answer);
        switch (answer) {
            case "allEmployees":
                viewAllEmployees();
                break;
            case "allDepartments":
                viewAll;

                start();
                break;
            case "allRoles":
                selectAll("roles");
                start();
                break;
            case "uEmployeeRole":

                updateEmployeeRole();
                // start();
                break;
            case "uEmployeeManager":
                updateEmployeeManager();
                break;
            case "addEmployee":

                break;
            case "addDepartment":

                break;
            case "addRole":

                break;
            case "deleteDepartament":

                break;
            case "deleteRole":

                break;
            case "deleteEmployee":

                break;
        }
    })
};

start();

// GET FUNCTIONS
const AllDepartment = () => {
    const query = ("SELECT name FROM department");
    return connection.query(query);
};

const AllDepartments = async() => {
    const query = (`SELECT id, name FROM department`);
    const result = await connection.query(query);
    const Departament = result.map(obj => {
        const depID = { name: obj.name, value: obj.id };
        return depID
    })
    return Departament;
};

const AllManagers = async() => {
    const query = ("SELECT CONCAT(first_name,' ', last_name) AS name FROM (SELECT distinct manager_id FROM employee WHERE manager_id  IS NOT NULL) AS managers JOIN employee ON (employee.id = managers.manager_id);")
    return connection.query(query);
};

const AllManagersID = async() => {
    const query = ("SELECT id,CONCAT(first_name,' ', last_name) AS name FROM (SELECT distinct manager_id FROM employee WHERE manager_id  IS NOT NULL) AS managers JOIN employee ON (employee.id = managers.manager_id);")
    const result = await connection.query(query);
    const manager = query.map(obj => {
        const managerID = { name: obj.name, value: obj.id };
        return managerID
    })
    return manager;
};

const AllRoles = async() => {
    return connection.query("SELECT title AS name FROM role")
};

const AllRolesID = async() => {
    const query = ("SELECT id, title AS name FROM role");
    const result = await connection.query(query);
    const roles = query.map(obj => {
        const rolesID = { name: obj.name, value: obj.id };
        return rolesID
    });
    return roles;
};

const AllEmployees = async() => {
    return connection.query("SELECT CONCAT (first_name,' ', last_name) AS name FROM employee");
};

// VIEW FUNCTIONS
const viewAllEmployees = () => {
    const sqlQuery = ("SELECT employee.id, CONCAT (employee.first_name,' ', employee.last_name) AS 'Employee Name', role.title AS 'Role Title', name AS Department, role.salary AS Salary, CONCAT (managers.first_name,' ', managers.last_name) AS 'Manager Name' FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) LEFT JOIN employee AS managers ON (employee.manager_id = managers.id)")
    connection.query(sqlQuery, function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);
        start();
    });
};

const viewAllDep = () => {
    const sqlQuery = ("SELECT department_id")

};

const viewAllEmployeesByManager = () => {

    getAllManagers().then((managers) => {
        inquirer
            .prompt([{
                type: "list",
                message: "Which manager team would you like to see?",
                name: "manager",
                choices: managers
            }])
            .then(answer => {
                let fullName = answer.manager.split(" ");
                let firstName = fullName[0];
                let lastName = fullName[1];
                const query = `
          SELECT 
            employee.id, 
            CONCAT (employee.first_name,' ', employee.last_name) AS 'Employee Name', 
            role.title AS 'Role Title', 
            name AS Department, 
            role.salary AS Salary, 
            CONCAT (managers.first_name,' ', managers.last_name) AS 'Manager Name'
          FROM employee 
          INNER JOIN role ON (employee.role_id = role.id) 
          INNER JOIN department ON (department.id = role.department_id)
          LEFT JOIN employee AS managers ON (employee.manager_id = managers.id)
          WHERE managers.first_name = ? AND managers.last_name = ?;`;
                connection.query(query, [firstName, lastName], function(err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    init();
                });
            });
    });
};

const viewAllRoles = () => {
    connection.query(`
        SELECT 
          role.id, 
          role.title AS 'Role Title',  
          role.salary AS Salary, 
          name AS Department
        FROM role 
        INNER JOIN department ON (role.department_id = department.id)
      `, function(err, res) {
        if (err) throw err;
        console.log("");
        console.table(res);
        init();
    });
};

const viewTotalDepartmentBudget = () => {

    getAllDepartments().then((departments) => {
        inquirer
            .prompt([{
                type: "list",
                message: "From which department would you like to see the total budget?",
                name: "department",
                choices: departments
            }])
            .then(answer => {
                const query = `
        SELECT 
          name AS Department,
          SUM(role.salary) AS 'Total Budget'
        FROM employee 
        INNER JOIN role ON (employee.role_id = role.id) 
        INNER JOIN department ON (department.id = role.department_id)
        LEFT JOIN employee AS managers ON (employee.manager_id = managers.id)
        WHERE department.name = ?;`;
                connection.query(query, answer.department, function(err, res) {
                    if (err) throw err;
                    console.log("");
                    console.table(res);
                    init();
                });
            });
    });
};

// ADD FUNCTIONS

const addEmployee = async() => {
    let roles = await getAllRolesID();
    let manager = await getAllManagersID();
    inquirer
        .prompt([{
                name: "firstName",
                type: "input",
                message: "What is the employee first name?"
            },
            {
                name: "lastName",
                type: "input",
                message: "What is the employee last name?"
            },
            {
                type: "list",
                message: "What is the role title?",
                name: "role",
                choices: roles
            },
            {
                name: "manager",
                type: "list",
                message: "What is the manager name?",
                choices: manager
            }
        ])
        .then(answer => {
            const query = `
          INSERT INTO employee (first_name, last_name, role_id, manager_id)
          VALUES (?, ?, ?, ?);
            `;
            connection.query(query, [answer.firstName, answer.lastName, answer.role, answer.manager], function(err, res) {
                if (err) throw err;
                console.log("");
                console.log(` ${answer.firstName} ${answer.lastName} added to the Database.`);
                init();
            });
        });

};

const addRole = async() => {
    let departments = await getAllDepartmentsID();
    inquirer
        .prompt([{
                name: "title",
                type: "input",
                message: "What is the role title?"
            },
            {
                name: "salary",
                type: "input",
                message: "What is the role salary?"
            },
            {
                name: "department",
                type: "list",
                message: "What is the role department?",
                choices: departments
            }
        ])
        .then(answer => {
            const query = `
          INSERT INTO role (title, salary, department_id)
          VALUES (?, ?, ?);
            `;
            connection.query(query, [answer.title, answer.salary, answer.department], function(err, res) {
                if (err) throw err;
                console.log("");
                console.log(answer.title + " added to the Database.");
                init();
            });
        });
};

const addDepartment = () => {
    inquirer
        .prompt([{
            name: "name",
            type: "input",
            message: "What is the department name?"
        }])
        .then(answer => {
            const query = `
          INSERT INTO department (name)
          VALUES (?);
            `;
            connection.query(query, [answer.name], function(err, res) {
                if (err) throw err;
                console.log("");
                console.log(answer.name + " added to the Database.");
                init();
            });
        });
};

// REMOVE FUNCTIONS

const removeEmployee = async() => {
    let employees = await getAllEmployees();

    inquirer
        .prompt([{
            name: "employee",
            type: "list",
            message: "Which employee would you like to remove?",
            choices: employees
        }])
        .then(answer => {
            let fullName = answer.employee.split(" ");
            let firstName = fullName[0];
            let lastName = fullName[1];
            const query = `
        DELETE FROM employee
        WHERE first_name = ? AND last_name = ?;
          `;
            connection.query(query, [firstName, lastName], function(err, res) {
                if (err) throw err;
                console.log("");
                console.log(answer.employee + " removed from the Database.");
                init();
            });
        });
};

const removeRole = async() => {
    let roles = await getAllRoles();

    inquirer
        .prompt([{
            name: "role",
            type: "list",
            message: "Which role would you like to remove?",
            choices: roles
        }])
        .then(answer => {
            const query = `
        DELETE FROM role
        WHERE title = ?;
          `;
            connection.query(query, answer.role, function(err, res) {
                if (err) throw err;
                console.log("");
                console.log(answer.role + " removed from the Database.");
                init();
            });
        });
};

const removeDepartment = async() => {
    let departments = await getAllDepartments();

    inquirer
        .prompt([{
            name: "department",
            type: "list",
            message: "Which department would you like to remove?",
            choices: departments
        }])
        .then(answer => {
            const query = `
        DELETE FROM department
        WHERE name = ?;
          `;
            connection.query(query, answer.department, function(err, res) {
                if (err) throw err;
                console.log("");
                console.log(answer.department + " removed from the Database.");
                init();
            });
        });
};

// UPDATE FUNCTIONS

const updateEmployeeRole = async() => {
    let employees = await getAllEmployees();
    let roles = await getAllRolesID();

    inquirer
        .prompt([{
                name: "employee",
                type: "list",
                message: "Which employee would you like to change role?",
                choices: employees
            },
            {
                name: "role",
                type: "list",
                message: "Which is the employee new role?",
                choices: roles
            },
        ])
        .then(answer => {
            let fullName = answer.employee.split(" ");
            let firstName = fullName[0];
            let lastName = fullName[1];
            const query = `
          UPDATE employee
          SET role_id = ?
          WHERE first_name = ? AND last_name = ?;
          `;
            connection.query(query, [answer.role, firstName, lastName], function(err, res) {
                if (err) throw err;
                console.log("");
                console.log(` ${firstName} ${lastName} role updated in the Database.`);
                init();
            });
        });
};

const updateEmployeeManager = async() => {
    let employees = await getAllEmployees();
    let managers = await getAllManagersID();

    inquirer
        .prompt([{
                name: "employee",
                type: "list",
                message: "Which employee would you like to change manager?",
                choices: employees
            },
            {
                name: "manager",
                type: "list",
                message: "Which is the employee new role?",
                choices: managers
            },
        ])
        .then(answer => {
            let fullName = answer.employee.split(" ");
            let firstName = fullName[0];
            let lastName = fullName[1];
            const query = `
          UPDATE employee
          SET manager_id = ?
          WHERE first_name = ? AND last_name = ?;
          `;
            connection.query(query, [answer.manager, firstName, lastName], function(err, res) {
                if (err) throw err;
                console.log("");
                console.log(` ${firstName} ${lastName} manager updated in the Database.`);
                init();
            });
        });
};