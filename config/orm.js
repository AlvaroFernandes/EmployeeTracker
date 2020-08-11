const connection = require("./connection.js");

const orm = {
    selectAll: (table, cb) => {
            const queryString = "SELECT * FROM ?? ";
            connection.query(queryString, [table], (err, result) => {
                if (err) throw err;
                cb(result);
            });
        }
        // selectAndOrder: (whatToSelect, table, orderCol) => {
        //   const queryString = "SELECT ?? FROM ?? ORDER BY ?? DESC";
        //   console.log(queryString);
        //   connection.query(queryString, [whatToSelect, table, orderCol], (err, result) => {
        //     if (err) throw err;
        //     console.log(result);
        //   });
        // },
        // findWhoHasMost: (tableOneCol, tableTwoForeignKey, tableOne, tableTwo) => {
        //   const queryString =
        //     "SELECT ??, COUNT(??) AS count FROM ?? LEFT JOIN ?? ON ??.??= ??.id GROUP BY ?? ORDER BY count DESC LIMIT 1";

    //   connection.query(
    //     queryString,
    //     [tableOneCol, tableOneCol, tableOne, tableTwo, tableTwo, tableTwoForeignKey, tableOne, tableOneCol],
    //     (err, result) => {
    //       if (err) throw err;
    //       console.log(result);
    //     }
    //   );
    // }
};

module.exports = orm;