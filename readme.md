# Task Manager App (server-side)

This is a task manager app built using Node, Express, Passport, JWT, MongoDB, and Mongoose. It provide APIs for user authentication, CRUD operations for tasks, and error handling.

## Features

- User authentication using JWT
- CRUD operations for tasks
- Error handling for API requests

## Getting Started

To get started, follow these steps:

1. Clone the repository:

```bash
git clone https://github.com/arshali2774/Task_Manager_DND_VOOSH.git
```

2. Navigate to the project directory:

```bash
cd Task_Manager_DND_VOOSH
```

3. Install the dependencies:

```bash
npm install
```

4. Start the development server:

```bash
npm run dev
```

5. Open postman and make a request to the server using following routes:

```js
Base URL: http://localhost:3000
```

- POST /api/auth/register: Register a new user
  - Request Body
    ```json
    {
      "firstName": "John",
      "lastName": "Doe",
      "email": "johndoe@example.com",
      "password": "password",
      "confirmPassword": "password"
    }
    ```
- POST /api/auth/login: Login a user
  - Request Body
    ```json
    {
      "email": "johndoe@example.com",
      "password": "password"
    }
    ```
- POST /api/auth/logout: Logout a user
- GET /api/auth/google: Redirect to Google authentication page
- GET /api/auth/google/callback: Handle Google authentication callback
- GET /api/tasks: Get all tasks
- GET /api/tasks/search: Search tasks by title and sort the results
  - Query Parameters: 'title' and 'sort'
    ```js
    https://localhost:3000/api/tasks?title=task1&sort=To%20Do
    ```
- PUT /api/tasks/:id: Update a task
  - Request Body
    ```json
    {
      "title": "Updated Task",
      "description": "Updated Description",
      "status": "To Do",
      "arrIdx": 1
    }
    ```
- DELETE /api/tasks/:id: Delete a task

## Process Explanation

The project is divided into two main components: the client-side and the server-side. This is the server-side readme.

- The first thing i did was to install necessary dependencies and create the server.
- Created a custom middleware for handling authentication and authorization.
- Created a custom middleware for validating the request body.
- Created a custom middleware for handling errors.
- Created a custom controller for handling CRUD operations for tasks.
- Created a custom controller for handling authentication and authorization.
- Created routes for handling CRUD operations for tasks.
- Created routes for handling authentication and authorization.
- Created route for handling Google authentication.
- Created route for handling Google authentication callback.
- Created route for handling search functionality.
- Created route for handling sorting functionality.
- Created route for handling error handling.

## Conclusion

I learned a lot about Node, Express, Passport, JWT, MongoDB, and Mongoose. I also learned how to use middleware effectively and how to integrate them with other libraries. I also learned how to handle errors and how to make API requests in Node. Overall, I am very satisfied with the project and would recommend it to anyone who wants to learn Node, Express, Passport, JWT, MongoDB, and Mongoose.
