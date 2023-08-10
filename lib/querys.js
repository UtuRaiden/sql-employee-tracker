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

async function addRole() {
    const db = await databaseConnect();
    try {
        const departments = await db.promise().execute('SELECT * FROM department');
        const departmentNames = departments[0].map(department => department.department_name);

        const questions = [
            {
                type: 'input',
                message: 'What would you like the new Role to be called?',
                name: 'roleName'
            },
            {
                type: 'number',
                message: 'What would you like the Salary for the new role to be?',
                name: 'roleSalary'
            },
            {
                type: 'list',
                message: 'What department does this role belong to?',
                choices: departmentNames,
                name: 'departmentName' 
            }
        ];

        const data = await inquirer.prompt(questions);

        const selectedDepartment = departments[0].find(department => department.department_name === data.departmentName);
        
        await db.promise().execute(`INSERT INTO roles (title, salary, department_id)
            VALUES ("${data.roleName}", ${data.roleSalary}, ${selectedDepartment.id})`);
        
        console.log('Role added successfully.');
    } catch (error) {
        console.error('Error adding role:', error);
    } 
}

async function addEmployee() {
    const db = await databaseConnect();
    try {
        const roles = await db.promise().execute('SELECT * FROM roles');
        const roleNames = roles[0].map(role => role.title);

        const managers = await db.promise().execute('SELECT * FROM employee');
        const managerNames = managers[0].map(employee => employee.first_name);
        managerNames.push('No Manager');

        const questions = [
            {
                type: 'input',
                message: 'What is their first name?',
                name: 'firstName'
            },
            {
                type: 'input',
                message: 'What is their last name?',
                name: 'lastName'
            },
            {
                type: 'list',
                message: 'What role will this employee have?',
                choices: roleNames,
                name: 'roleName' 
            },
            {
                type: 'list',
                message: 'Who is their manager?',
                choices: managerNames,
                name:'managerName'
            }
        ];

        const data = await inquirer.prompt(questions);

        const selectedRole = roles[0].find(role => role.title === data.roleName);
        let selectedManagerId = null;

        if (data.managerName !== 'No Manager') {
            const selectedManager = managers[0].find(employee => employee.first_name === data.managerName);
            selectedManagerId = selectedManager.id;
        }

        
        await db.promise().execute(`INSERT INTO employee (first_name, last_name,role_id, manager_id)
            VALUES ("${data.firstName}", "${data.lastName}", ${selectedRole.id}, ${selectedManagerId})`);
        
        console.log('Employee added successfully.');
    } catch (error) {
        console.error('Error adding Employee:', error);
    } 
}

module.exports = {viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee}