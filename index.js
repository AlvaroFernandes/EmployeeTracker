const connection = require("./config/connection.js");
const { prompt } = require("inquirer");
const table = require("console.table");
const quest = require("./utils/questions.js");
const logo = require('asciiart-logo');
const Prompt = require("inquirer/lib/prompts/base");
const util = require("util");

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
            case "deleteDepartament":
                delDep();
                break;
            case "deleteRole":
                delRole();
                break;
            case "deleteEmployee":
                delEmp();
                break;
        }
    })
};

start();

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
    })
    return result;
}
async function getDepartments() {
    const departmentSql = ("SELECT id, name FROM department");
    const departmentQuery = await connection.query(departmentSql);
    let result = departmentQuery.map(obj => {
        let departmentObj = { name: obj.name, value: obj.id };
        return departmentObj
    })
    return result;
}


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

}

const updateEmployeeManager = async() => {

}


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

const delEmp = () => {

}

const delDep = () => {

}

const delRole = () => {

}