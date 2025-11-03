# TalentMinds LMS

TalentMinds LMS is a web-based learning management system designed to streamline the educational process for both instructors and students.
This platform provides a comprehensive suite of tools for creating, delivering, and tracking educational content,
making it an ideal solution for educational institutions and corporate training programs.

## Overview

The project is a full-stack web application featuring a Java Spring Boot backend and a React frontend.
The backend is responsible for handling business logic and providing RESTful APIs, while the frontend offers a dynamic and interactive user interface.

## Current Development Progress

The project is currently in the initial development phase. The basic structure for both the backend and frontend has been set up, but many features are still under development.

## Prerequisites

Before you begin, ensure you have the following tools installed on your system:

- **Java Development Kit (JDK):** Version 17 or higher
- **Maven:** Version 3.6 or higher, for managing backend dependencies
- **Node.js:** Version 14 or higher, for managing frontend packages
- **npm:** Version 6 or higher, included with Node.js
- **MySQL:** A running instance of MySQL database

## Backend Setup

1. **Navigate to the Backend Directory**
   Open a terminal and change to the `backend` directory:
   ```sh
   cd backend
   ```

2. **Install Dependencies**
   Maven will automatically download all required dependencies when you build the project.

3. **Configure the Database**
   - Make sure your MySQL server is running.
   - Create a new database for the application.
   - Update the `application.properties` file in `src/main/resources` with your database credentials.

4. **Run the Application**
   Use the Maven wrapper to start the Spring Boot application:
   ```sh
   ./mvnw spring-boot:run
   ```

## Frontend Setup

1. **Navigate to the Frontend Directory**
   In a separate terminal, change to the `frontend` directory:
   ```sh
   cd frontend
   ```

2. **Install Dependencies**
   Install the required Node.js packages using npm:
   ```sh
   npm install
   ```

3. **Start the Development Server**
   Run the following command to start the Vite development server:
   ```sh
   npm run dev
   ```

4. **Access the Application**
   Once the server is running, you can access the application in your web browser at `http://localhost:3000`.
