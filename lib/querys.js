const mysql = require('mysql2');
const inquirer = require('inquirer');

function databaseConnect(){
    const db = mysql.createConnection(
        {
            host: 'localhost',
            user: 'root',
            password:process.env.DB_PASSWORD,
            database: 'employee_db',
        }
    )
    return db;
}

async function viewAllDepartments(){
    const db = await databaseConnect();
    console.log('its attempting')

    const [rows, fields] = await db.promise().execute('SELECT * FROM department');
        console.table(rows);
}




module.exports = {viewAllDepartments}