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

async function viewAllRoles() {
    const db = await databaseConnect();

    const [rows, fields] = await db.promise().execute(`
        SELECT r.id, r.title, r.salary, d.department_name AS department
        FROM roles r
        JOIN department d ON r.department_id = d.id
    `);

    console.table(rows);
}

async function viewAllEmployees() {
    const db = await databaseConnect();

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
    } catch(err){
        console.log(err)
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
    } catch(err){
        console.log(err)
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
    } catch (err) {
        console.log(err);
    } 
}

async function updateEmployee(){
    const db = await databaseConnect();
    try {
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
        const selectedEmployee = employees[0].find(employee =>
            `${employee.first_name} ${employee.last_name}` === data.selectedEmployee
        );
        
        const selectedRole = roles[0].find(role =>
            `${role.title} ${role.department_id}` === data.newRole
        );

        
        await db.promise().execute(`UPDATE employee SET role_id=${selectedRole.id} WHERE id=${selectedEmployee.id}`);

    }catch(err){
        console.log(err)
    }
}

module.exports = {viewAllDepartments, viewAllRoles, viewAllEmployees, addDepartment, addRole, addEmployee, updateEmployee}