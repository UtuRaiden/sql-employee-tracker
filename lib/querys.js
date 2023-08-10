//requires necessary packages
const mysql = require('mysql2');
const inquirer = require('inquirer');
// function to ensure the database is connected
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
// function to view all departments
async function viewAllDepartments(){
    const db = await databaseConnect();

    const [rows, fields] = await db.promise().execute('SELECT * FROM department');
        console.table(rows);
}
// function to view all roles
async function viewAllRoles() {
    const db = await databaseConnect();
// this joins the roles and department so the role will display the department name instead of the id number
    const [rows, fields] = await db.promise().execute(`
        SELECT r.id, r.title, r.salary, d.department_name AS department
        FROM roles r
        JOIN department d ON r.department_id = d.id
    `);

    console.table(rows);
}
// function to view all employees
async function viewAllEmployees() {
    const db = await databaseConnect();
// joins roles and departments to employee so it will show their salary and the department name
// Concats the managers name to the manager field to display their whole name
    const [rows, fields] = await db.promise().execute(`
        SELECT e.id, e.first_name, e.last_name, r.title AS job_title, r.salary, 
               d.department_name AS department, CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM employee e
        JOIN roles r ON e.role_id = r.id
        JOIN department d ON r.department_id = d.id
        LEFT JOIN employee m ON e.manager_id = m.id
    `);

    console.table(rows);
}
// function to add a department
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
        //this is what inserts the department into the DB Currently it is open to sql injection attacks. It is something i would change later
        const data = await inquirer.prompt(questions);
        await db.promise().execute(`INSERT INTO department (department_name)
            VALUES ("${data.departmentName}")`);
        console.log('Department added successfully.');
    } catch(err){
        console.log(err)
    }
}
// function to add a roll
async function addRole() {
    const db = await databaseConnect();
    try {
        // this gets all the departments and puts them into an array for the list to chose from
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
// this finds the department that the user has selected and stores that value
        const selectedDepartment = departments[0].find(department => department.department_name === data.departmentName);
        // this inserts the new role into the database Currently it is open to sql injection attacks. It is something i would change later
        await db.promise().execute(`INSERT INTO roles (title, salary, department_id)
            VALUES ("${data.roleName}", ${data.roleSalary}, ${selectedDepartment.id})`);
        
        console.log('Role added successfully.');
    } catch(err){
        console.log(err)
    }
}
// function to add an employee
async function addEmployee() {
    const db = await databaseConnect();
    try {
        //these finds all the roles and employees and puts them into an array for the list in the questions
        const roles = await db.promise().execute('SELECT * FROM roles');
        const roleNames = roles[0].map(role => role.title);

        const managers = await db.promise().execute('SELECT * FROM employee');
        const managerNames = managers[0].map(employee => employee.first_name);
        // adds a No Manager selection to the managers
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
// finds the role that the user selected and stores that value
        const selectedRole = roles[0].find(role => role.title === data.roleName);
        //sets the selected manager to null
        let selectedManagerId = null;
// if anything but No Manager was selected it changes the SelectedManagerId to the one that was selected
        if (data.managerName !== 'No Manager') {
            const selectedManager = managers[0].find(employee => employee.first_name === data.managerName);
            selectedManagerId = selectedManager.id;
        }

        // inserts the new employee into the database Currently it is open to sql injection attacks. It is something i would change later
        await db.promise().execute(`INSERT INTO employee (first_name, last_name,role_id, manager_id)
            VALUES ("${data.firstName}", "${data.lastName}", ${selectedRole.id}, ${selectedManagerId})`);
        
        console.log('Employee added successfully.');
    } catch (err) {
        console.log(err);
    } 
}
// function to update and employee
async function updateEmployee(){
    const db = await databaseConnect();
    try {
        // this pulls all the employee names and roles to be used in the questions list
        const employees = await db.promise().execute('SELECT * FROM employee');
        const employeeNames = employees[0].map(employee => `${employee.first_name} ${employee.last_name}`);
        const roles = await db.promise().execute('SELECT * FROM roles');
        const roleNames = roles[0].map(role => `${role.title} ${role.department_id}`);

        const questions = [
            {
                type:'list',
                message:'Which employee would you like to update?',
                choices: employeeNames,
                name:'selectedEmployee'
            },
            {
                type:'list',
                message:'What would you like their new role to be?',
                choices: roleNames,
                name:'newRole'
            },
        ]
        const data = await inquirer.prompt(questions);
        // finds what employee they selected and saves that value
        const selectedEmployee = employees[0].find(employee =>
            `${employee.first_name} ${employee.last_name}` === data.selectedEmployee
        );
        // finds what role they selected and finds that value
        const selectedRole = roles[0].find(role =>
            `${role.title} ${role.department_id}` === data.newRole
        );

        // updates the employee in the database Currently it is open to sql injection attacks. It is something i would change later
        await db.promise().execute(`UPDATE employee SET role_id=${selectedRole.id} WHERE id=${selectedEmployee.id}`);

    }catch(err){
        console.log(err)
    }
}
// exports all the functions to be used in the index.js file
module.exports = {viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployee}