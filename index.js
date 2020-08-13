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
        switch (answer) {
            case "allEmployees":
                selectAll("employee");
                start();
                break;
            case "allDepartments":
                selectAll("department");

                start();
                break;
            case "allRoles":
                selectAll("roles");
                start();
                break;
            case "uEmployeeRole":
                updateEmployeeRole();
                start();
                break;
            case "uEmployeeManager":

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

const selectAll = (data) => {
    switch (data) {
        case "employee":
            const emp = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;";
            connection.query(emp, (err, result) => {
                if (err) throw err;
                console.table(result);
            })
            break;
        case "department":
            console.log("dep");
            const dep = "SELECT * FROM department;";
            connection.query(dep, (err, result) => {
                if (err) throw err;
                console.table(result);
            })
            break;
        case "roles":
            const rol = "SELECT * FROM role LEFT JOIN department on role.department_id = department.id;";
            connection.query(rol, (err, result) => {
                if (err) throw err;
                console.table(result);
            })
            break;
    }
}

const updateEmployeeRole = () => {

}