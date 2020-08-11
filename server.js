const orm = require("./config/orm.js");
const { prompt } = require("inquirer");
const console = require("console.table");
const quest = require("./utils/questions.js");
const app = require("./model")


const start = () => {
    prompt(quest.Questions).then(async(answer) => {
        switch (answer.start) {
            case "allEmployees":
                await app.all("employee");


                break;
            case "allDepartaments":
                await all("departament");
                break;
            case "allRoles":
                await all("roles");
                break;
            case "uEmployeeRole":

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