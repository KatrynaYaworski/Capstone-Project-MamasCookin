Before you begin, make sure you have the following software installed on your system:

Node.js - Ensure that Node.js is installed on your machine.
npm - The Node.js package manager.
Installation
To install the project, follow these steps:

Clone this repository to your local machine

Navigate to the project directory:

cd Capstone-Project-MamasCookin
Install the project dependencies using npm:

npm install

Create a .env file in the root directory of the project. Add the following environment variables to configure the server and database connection:

SERVER_PORT=3000   # Replace with your desired port number
CONNECTION_STRING=your-database-connection-string

To start the server, run the following command:

node server.js

The server will listen on the port specified in the .env file.

To seed the database with starter data, make a POST request to the following endpoint using your preferred method (e.g., curl, Postman, etc.):

POST http://localhost:SERVER_PORT/seed
This will populate the database with initial data for testing and exploration.

Open your preferred web browser.
Navigate to http://localhost:SERVER_PORT/home.html.

Explore the application and enjoy its features!
