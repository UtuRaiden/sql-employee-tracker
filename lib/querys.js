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

    const [rows, fields] = await db.promise().execute('SELECT * FROM department');
        console.table(rows);
}

async function viewAllRoles(){
    const db = await databaseConnect();

    const [rows, fields] = await db.promise().execute('SELECT * FROM roles');
    console.table(rows);
}

async function viewAllEmployees(){
    const db = await databaseConnect();

    const [rows, fields] = await db.promise().execute('SELECT * FROM employee');    
    console.table(rows);
}

async function addDepartment(){
    const db = await databaseConnect();
    const questions = [
        {
            type:'input',
            message:'What would you like the new Department to be called?',
            name:'departmentName'
        }
    ]
    try {
        const data = await inquirer.prompt(questions);
        await db.promise().execute(`INSERT INTO department (department_name)
            VALUES ("${data.departmentName}")`);
        console.log('Department added successfully.');
    } catch (error) {
        console.error('Error adding department:', error);
    } 
}

module.exports = {viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment}