const orm = require("../config/orm.js");
const { prompt } = require("inquirer");

const all = (par) => {
    orm.selectAll(par, (data) => {
        console.log(data);
    });
}

module.exports = app;