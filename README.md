# Backend Project - Node.js (Express)

This project is a backend application built using Node.js and Express. The primary goal of this project is to learn how to work in Sprints and manage Continuous Integration/Continuous Deployment (CI/CD) pipeline workflows. This project serves as the backend for a separate [React frontend](https://github.com/tcivie/project_management_frontend).

## Getting Started

To get started with the project, you'll need to have [Node.js](https://nodejs.org/en/) and [npm](https://www.npmjs.com/get-npm) installed on your local development environment.

1. Clone the repository:
```
git clone https://github.com/tcivie/project_management_backend.git
```

2. Change to the project directory:
```
cd project_management_backend
```

3. Install the dependencies:
```
npm install
```

4. Run the development server:
```
npm start
```

The backend server should now be accessible at `http://localhost:4000`. To interact with the frontend, ensure that the [frontend project](https://github.com/tcivie/project_management_frontend) is also set up and running.

## Sprint Management

We follow an Agile development process, utilizing Sprints to divide our work into manageable iterations. Each sprint will have a set of tasks that the team will work on. The tasks will be assigned to team members based on their expertise and availability.

## Linter and Syntax

This project uses a linter with Airbnb's syntax configuration. This helps maintain a consistent coding style throughout the project. The linter will check for syntax errors and enforce best practices in the code.

To run the linter manually, execute the following command:

```
npm init @eslint/config
```

## CI/CD Pipeline

Our CI/CD pipeline is set up using CircleCI. The pipeline is triggered upon every push to the repository. It includes the following stages:

1. Install npm packages
2. Run tests
3. Run linter
4. Build the project
5. CI Deployment ([To the hosting platform](https://project-management-backend-x92m.onrender.com))

You can find the configuration file for the CircleCI pipeline in the `.circleci` folder at the root of the repository.

## Frontend Project

The backend project interacts with a separate frontend project built using React. You can find the frontend project repository and its README file here: [React frontend](https://github.com/tcivie/project_management_frontend)
usernames of the project contributors.

If you have any questions, please feel free to reach out to the project maintainers. We're always happy to help!
