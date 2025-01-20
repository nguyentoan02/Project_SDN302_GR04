# README.md

# Express MongoDB App

This project is a simple Express application that connects to a MongoDB database. It demonstrates best practices for structuring an Express server with JavaScript and MongoDB.

## Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [License](#license)

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/nguyentoan02/Project_SD302_GR04.git
   ```

2. Navigate to the project directory:

   ```
   cd Project_SD302_GR04
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and add your MongoDB connection string and any other environment variables.

## Usage

To start the application, run:

```
npm start
```

The server will start on the specified port, and you can access the API endpoints.

## API Endpoints

- `GET /api/resource`: Retrieve all resources
- `POST /api/resource`: Create a new resource
- `GET /api/resource/:id`: Retrieve a resource by ID
- `PUT /api/resource/:id`: Update a resource by ID
- `DELETE /api/resource/:id`: Delete a resource by ID

## Environment Variables

- `MONGODB_URI`: MongoDB connection string
- `PORT`: Port number for the server (default is 3000)

## License

This project is licensed under the MIT License.
