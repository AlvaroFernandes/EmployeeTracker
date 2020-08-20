const connection = require("./config/connection.js");
const { prompt } = require("inquirer");
const table = require("console.table");
const quest = require("./utils/questions.js");
const logo = require('asciiart-logo');
const Prompt = require("inquirer/lib/prompts/base");
const util = require("util");
const { finished } = require("stream");

connection.query = util.promisify(connection.query);

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
        switch (answer) {
            case "allEmployees":
                viewAllEmployees();
                break;
            case "allDepartments":
                viewAllDep();
                break;
            case "allRoles":
                viewAllRoles();
                break;
            case "uEmployeeRole":
                updateEmployeeRole();
                break;
            case "uEmployeeManager":
                updateEmployeeManager();
                break;
            case "addEmployee":
                addEmp();
                break;
            case "addDepartment":
                addDep();
                break;
            case "addRole":
                addRole();
                break;
            case "deleteDepartment":
                delDep();
                break;
            case "deleteRole":
                delRole();
                break;
            case "deleteEmployee":
                delEmp();
                break;
            case "quit":
                finish();
                break;
        }
    })
};

start();

async function getEmployee() {
    const employeeSQL = ("SELECT id, CONCAT(first_name,' ', last_name) AS name FROM employee;");
    const employeeQuery = await connection.query(employeeSQL);
    let result = employeeQuery.map(obj => {
        let employeeObj = { name: obj.name, value: obj.id };
        return employeeObj;
    });
    return result;
};

async function getRoles() {
    const roleSql = ("SELECT id, title as role FROM role;");
    const roleQuery = await connection.query(roleSql);
    let result = roleQuery.map(obj => {
        let roleObj = { name: obj.role, value: obj.id };
        return roleObj
    })
    return result;
};

async function getManagers() {
    const managerSql = ("SELECT id, CONCAT(first_name,' ', last_name) AS name FROM (SELECT distinct manager_id FROM employee WHERE manager_id  IS NOT NULL) AS managers JOIN employee ON (employee.id = managers.manager_id);");
    const managerQuery = await connection.query(managerSql);
    let result = managerQuery.map(obj => {
        let managerObj = { name: obj.name, value: obj.id };
        return managerObj;
    });
    return result;
};

async function getDepartments() {
    const departmentSql = ("SELECT id, name FROM department");
    const departmentQuery = await connection.query(departmentSql);
    let result = departmentQuery.map(obj => {
        let departmentObj = { name: obj.name, value: obj.id };
        return departmentObj
    });
    return result;
};


// VIEW FUNCTIONS
const viewAllEmployees = () => {
    const sqlQuery = ("SELECT employee.id, CONCAT (employee.first_name,' ', employee.last_name) AS 'Employee Name', role.title AS 'Role Title', name AS Department, role.salary AS Salary, CONCAT (managers.first_name,' ', managers.last_name) AS 'Manager Name' FROM employee INNER JOIN role ON (employee.role_id = role.id) INNER JOIN department ON (department.id = role.department_id) LEFT JOIN employee AS managers ON (employee.manager_id = managers.id)")
    connection.query(sqlQuery, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
        start();
    });
};

const viewAllDep = () => {
    const sqlQuery = ("SELECT * FROM department");
    connection.query(sqlQuery, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
        start();
    })
};

const viewAllRoles = () => {
    const sqlQuery = ("SELECT role.id, role.title AS 'Role Title', role.salary AS Salary, name AS Department FROM role INNER JOIN department ON (role.department_id = department.id);");
    connection.query(sqlQuery, (err, res) => {
        if (err) throw err;
        console.log("");
        console.table(res);
        start();
    })
};

//Update
const updateEmployeeRole = async() => {
    const empList = await getEmployee();
    const roleList = await getRoles();

    prompt([{
            type: "list",
            name: "employee",
            message: "Employee to change role:",
            choices: empList
        },
        {
            type: "list",
            name: "role",
            message: "New role of employee:",
            choices: roleList
        }
    ]).then(result => {
        const updateSql = ("UPDATE employee SET role_id = ? WHERE id = ?;");
        connection.query(updateSql, [result.role, result.employee], (err, res) => {
            if (err) throw err;
            console.log(" ");
            console.log("Employee's role updated!");
            start();
        })

    })
}

const updateEmployeeManager = async() => {
    const empList = await getEmployee();
    const manList = await getManagers();

    prompt([{
            type: "list",
            name: "employee",
            message: "Employee to change role:",
            choices: empList
        },
        {
            type: "list",
            name: "manager",
            message: "New manager of employee:",
            choices: manList
        }
    ]).then(result => {
        const updateSql = ("UPDATE employee SET manager_id = ? WHERE id = ?;");
        connection.query(updateSql, [result.manager, result.employee], (err, res) => {
            if (err) throw err;
            console.log(" ");
            console.log("Employee's manager updated!");
            start();
        })
    })
};


//add
const addEmp = async() => {
    const role = await getRoles();
    const man = await getManagers();

    prompt([{
            type: "input",
            name: "firstName",
            message: "First name of the new employee:"
        },
        {
            type: "input",
            name: "lastName",
            message: "Last name of the new employee:"
        },
        {
            type: "list",
            name: "roles",
            message: "Select a role:",
            choices: role
        },
        {
            type: "list",
            name: "manager",
            message: "Select a manager",
            choices: man
        }
    ]).then(result => {
        const addSql = ("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);");
        connection.query(addSql, [result.firstName, result.lastName, result.roles, result.manager], (err, res) => {
            if (err) throw err;
            console.log('');
            console.log("Employee addes!");
            start();
        })
    });

}

const addDep = async() => {
    await prompt([{
        type: "input",
        name: "department",
        message: "Name of the new department:",
    }, ]).then(result => {
        const addSql = "INSERT INTO department (name) VALUES (?);";
        connection.query(addSql, [result.department], (err, res) => {
            if (err) throw err;
        });
        console.log('');
        console.log("New department added!");
        start();
    });

}


const addRole = async() => {
    const dep = await getDepartments();

    prompt([{
            type: "input",
            name: "title",
            message: "Role title?"
        },
        {
            type: "input",
            name: "salary",
            message: "Role salary?"
        },
        {
            type: "list",
            name: "department",
            message: "Role department?",
            choices: dep
        }
    ]).then(result => {
        const addSql = ("INSERT INTO role (title,salary,department_id) VALUES (?,?,?);");
        connection.query(addSql, [result.title, result.salary, result.department], (err, res) => {
            if (err) throw err;
        });
        console.log('');
        console.log("New department added!");
        start();
    });

}

//del

const delEmp = async() => {
    const empList = await getEmployee();

    prompt([{
        type: "list",
        name: "employee",
        message: "Employee to delete:",
        choices: empList
    }]).then(result => {
        const delSql = ("DELETE FROM employee WHERE id = ?;");
        connection.query(delSql, [result.employee], (err, res) => {
            if (err) throw err;
        });
        console.log('');
        console.log("Employee deleted!");
        start();
    });
};

const delDep = async() => {
    console.log("delDep")
    const depList = await getDepartments();

    prompt([{
        type: "list",
        name: "department",
        message: "Department to delete:",
        choices: depList
    }]).then(result => {
        const delSql = ("DELETE FROM department WHERE id = ?;");
        connection.query(delSql, [result.department], (err, res) => {
            if (err) throw err;
        });
        console.log('');
        console.log("Department deleted!");
        start();
    });
}

const delRole = async() => {
    const roleList = await getRoles();

    prompt([{
        type: "list",
        name: "role",
        message: "Role to delete:",
        choices: roleList
    }]).then(result => {
        const delSql = ("DELETE FROM role WHERE id = ?;");
        connection.query(delSql, [result.role], (err, res) => {
            if (err) throw err;
        });
        console.log('');
        console.log("Employee deleted!");
        start();
    });
}

//end connection
const finish = () => {
    connection.end();
};