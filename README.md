# Greenland University
# Greenland University

# Table of Contents
1. [Introduction](#introduction)
2. [Project Structure](#project-structure)
3. [Getting Started](#getting-started)
4. [Features](#features)
5. [Contributing](#contributing)
6. [License](#license)

## Introduction
Greenland University is a project aimed at providing a comprehensive platform for students, faculty, and staff to collaborate and learn.

## Project Structure
```markdown
Greenland University/
│   .env
│   .gitignore
│   app.js
│   package-lock.json
│   package.json
│   README.md
│   tsconfig.json (Unnecessary, don't mind.)
│
├───config
│       db.js
│
├───db
│       database.db
│       init.js
│       insert.js
│
├───prisma
│   │   schema.prisma
│   │
│   └───migrations
│       │   migration_lock.toml
│       │
│       ├───20250127210619_init
│       │       migration.sql
│       │
│       └───20250127211300_init
│               migration.sql
│
├───public
│   ├───css
│   │       style.css
│   │
│   ├───html
│   │       login.html
│   │
│   └───js
│           script.js
│           spinner.js
│           validation.js
│
├───routes
│       accmanage.js
│       api.js
│       index.js
│
├───static
├───utils
└───views
    │   dashboard.ejs
    │
    ├───css
    │       dashboard.css
    │
    └───partials
            admin.ejs
            assignments.ejs
            courses.ejs
            dash.ejs
            payments.ejs
            settings.ejs
```

## Getting Started
To get started with the project, follow these steps:

1. Clone the repository using `git clone https://github.com/DDeluca06/Greenland-University.git`
2. Navigate to the project directory using `cd Greenland-University`
3. Build the project using `npm i`
4. Launch the app using Node.JS `node app.js` OR `npx nodemon`

## Features
* User authentication and authorization
* Payment system
* User dashboard
* Admin panel
* Course management

## Contributing
Contributions are welcome! To contribute to the project, follow these steps:

1. Fork the repository using `git fork https://github.com/DDeluca06/Greenland-University.git`
2. Create a new branch using `git branch feature/new-feature`
3. Make changes and commit them using `git commit -m "New feature"`
4. Push the changes to the remote repository using `git push origin feature/new-feature`
5. Create a pull request to merge the changes into the main branch