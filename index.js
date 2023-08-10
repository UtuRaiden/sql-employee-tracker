// require all the necessary elements for the file
const inquirer = require('inquirer');
const mysql = require('mysql2');
const fs = require('fs');
const {viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployee} = require('./lib/querys')

require('dotenv').config();
// defines the base questions for the intro page
const questions = [
    {
        type:'list',
        message:'What would you like to do?',
        choices:["View All departments","View all roles","View all employees","Add a department","Add a role","Add an employee", "Update Employee role","Exit"],
        name:'introQuestions'
    }
]
// function that asks the intro questions. That is the only thing it does so im able to call it over and over again
function askQuestions(){
inquirer.prompt(questions)
.then((data)=>{handleResponse(data)})
}
// function that takes the response of the questions and then calls another function to execute whatever was selected
async function handleResponse(data){
    if(data.introQuestions ==="View All departments"){
        await viewAllDepartments();
        askQuestions();
    }
    if(data.introQuestions ==="View all roles"){
        await viewAllRoles();
        askQuestions();
    }
    if(data.introQuestions ==="View all employees"){
        await viewAllEmployees();
        askQuestions();
    }
    if(data.introQuestions ==="Add a department"){
        await addDepartment();
        await viewAllDepartments();
        askQuestions();
    }
    if(data.introQuestions ==="Add a role"){
        await addRole();
        await viewAllRoles();
        askQuestions();
    }
    if(data.introQuestions ==="Add an employee"){
        await addEmployee();
        await viewAllEmployees();
        askQuestions();
    }
    if(data.introQuestions ==="Update Employee role"){
        console.log("Update Employee role chosen")
        await updateEmployee();
        await viewAllEmployees();
        askQuestions();
    }
    if(data.introQuestions ==="Exit"){
        process.exit();
    }
}
// Initialize function it creates the database if it doesn't exist
// It also runs the schema and the seeds from the DB folder automatically so no interaction is needed from the user
async function init(){
  const db = mysql.createConnection(
    {
        host: 'localhost',
        user: 'root',
        password:process.env.DB_PASSWORD,
        database: 'employee_db',
    });
    try {

        await db.promise().query('CREATE DATABASE IF NOT EXISTS employee_db');
        await db.promise().query('USE employee_db');

        // Reads and executes the schema file by splitting the the statements from a ;
        const schemaSQL = fs.readFileSync(__dirname + '/db/schema.sql', 'utf8');
        const schemaStatements = schemaSQL.split(';');
        for (const statement of schemaStatements) {
            if (statement.trim() !== '') {
                await db.promise().query(statement);
            }
        }

      // Reads and executes the seeds file by splitting the the statements from a ;
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
// finally makes sure that everything else has been run first and then it calls the askQuestions function
}finally {
    askQuestions();
}
}
//calls the init function
init();