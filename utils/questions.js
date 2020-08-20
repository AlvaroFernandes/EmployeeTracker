const Questions = [{
    type: "list",
    pageSize: 12,
    name: "start",
    message: "What would you like to do?",
    choices: [
        { name: "view all employees", value: "allEmployees" },
        { name: "view all departments", value: "allDepartments" },
        { name: "view all roles", value: "allRoles" },
        { name: "update employee's role", value: "uEmployeeRole" },
        { name: "update employee's manager", value: "uEmpManager" },
        { name: "add an employee", value: "addEmployee" },
        { name: "add a department", value: "addDepartment" },
        { name: "add a role", value: "addRole" },
        { name: "delete a department", value: "deleteDepartment" },
        { name: "delete a role", value: "deleteRole" },
        { name: "delete an employee", value: "deleteEmployee" },
        { name: "quit", value: "quit" }
    ]
}, ]
module.exports = { Questions }