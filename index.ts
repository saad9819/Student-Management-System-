#!/usr/bin/env node

import inquirer from 'inquirer';

class Student {
    static idCounter: number = 0;
    
    id: number;
    name: string;
    courses: string[];
    balance: number;

    constructor(name: string, courses: string[]) {
        this.id = ++Student.idCounter;
        this.name = name;
        this.courses = courses;
        this.balance = 0;
    }

    enroll(course: string) {
        this.courses.push(course);
    }

    viewBalance() {
        console.log(`Balance for ${this.name}: $${this.balance}`);
    }

    payTuition(amount: number) {
        this.balance -= amount;
        console.log(`Thank you for your payment of $${amount}.`);
        this.viewBalance();
    }

    showStatus() {
        console.log(`Student Name: ${this.name}`);
        console.log(`Student ID: ${this.id}`);
        console.log(`Courses Enrolled: ${this.courses.join(', ')}`);
        this.viewBalance();
    }
}

class StudentManagementSystem {
    students: Student[];

    constructor() {
        this.students = [];
    }

    async addStudent() {
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'name',
                message: 'Enter student name:'
            },
            {
                type: 'input',
                name: 'courses',
                message: 'Enter courses (comma separated):',
                filter: (value: string) => value.split(',').map(course => course.trim())
            }
        ]);

        const newStudent = new Student(answers.name, answers.courses);
        this.students.push(newStudent);
        console.log(`Student ${newStudent.name} with ID ${newStudent.id} added successfully.`);
    }

    async enrollStudent() {
        const studentIdAnswer = await inquirer.prompt({
            type: 'input',
            name: 'studentId',
            message: 'Enter student ID to enroll:'
        });

        const studentId = parseInt(studentIdAnswer.studentId);
        const student = this.findStudentById(studentId);

        if (student) {
            const courseAnswer = await inquirer.prompt({
                type: 'input',
                name: 'course',
                message: 'Enter course to enroll:'
            });
            student.enroll(courseAnswer.course);
            console.log(`${courseAnswer.course} enrolled successfully for ${student.name}.`);
        } else {
            console.log(`Student with ID ${studentId} not found.`);
        }
    }

    findStudentById(id: number): Student | undefined {
        return this.students.find(student => student.id === id);
    }
}

async function main() {
    const sms = new StudentManagementSystem();

    while (true) {
        const { choice } = await inquirer.prompt({
            type: 'list',
            name: 'choice',
            message: 'Choose an operation:',
            choices: ['Add Student', 'Enroll Student', 'Exit']
        });

        switch (choice) {
            case 'Add Student':
                await sms.addStudent();
                break;
            case 'Enroll Student':
                await sms.enrollStudent();
                break;
            case 'Exit':
                console.log('Exiting program.');
                return;
        }
    }
}

main();
