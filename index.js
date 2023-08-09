const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');

require('dotenv').config();
const questions = [
    {
        type:'list',
        message:'What would you like to do?',
        choices:["View All departments","View all roles","View all employees","Add a department","Add a role","Add an employee", "Update Employee role","Exit"],
        name:'introQuestions'
    }
]

function askQuestions(){
inquirer.prompt(questions)
.then((data)=>{handleResponse(data)})
}

function handleResponse(data){
    if(data.introQuestions ==="View All departments"){
        console.log("View All departments chosen")
    }
    if(data.introQuestions ==="View all roles"){
        console.log("View all roles chosen")
    }
    if(data.introQuestions ==="View all employees"){
        console.log("View all employees chosen")
    }
    if(data.introQuestions ==="Add a department"){
        console.log("Add a department chosen")
    }
    if(data.introQuestions ==="Add a role"){
        console.log("Add a role chosen")
    }
    if(data.introQuestions ==="Add an employee"){
        console.log("Add an employee chosen")
    }
    if(data.introQuestions ==="Update Employee role"){
        console.log("Update Employee role chosen")
    }
    if(data.introQuestions ==="Exit"){
        console.log("Exit chosen")
    }
}

async function init(){
  const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password:process.env.DB_PASSWORD,
        database: 'employee_db',
    });
    try {
        // Create the database if it doesn't exist
        await db.promise().query('CREATE DATABASE IF NOT EXISTS employee_db');
        await db.promise().query('USE employee_db');

        // Read and execute schema.sql file
        const schemaSQL = fs.readFileSync(__dirname + '/db/schema.sql', 'utf8');
        const schemaStatements = schemaSQL.split(';');
        for (const statement of schemaStatements) {
            if (statement.trim() !== '') {
                await db.promise().query(statement);
            }
        }

        // Read and execute seeds.sql file
        const seedsSQL = fs.readFileSync(__dirname + '/db/seeds.sql', 'utf8');
        const seedsStatements = seedsSQL.split(';');
        for (const statement of seedsStatements) {
            if (statement.trim() !== '') {
                await db.promise().query(statement);
            }
        }

        console.log('Database schema and seeds have been executed successfully.');

}catch (error) {
        console.error('Error executing SQL files:', error);
}finally {
    askQuestions(); // Call askQuestions() after initialization is complete
}
}

init();