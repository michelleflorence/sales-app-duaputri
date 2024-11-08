# Sales App Dua Putri

Sales App Dua Putri is a comprehensive sales application tailored for a "Warung Nasi Bungkus" (wrapped rice stalls), offering three primary roles: superadmin, admin, and cashier. The application consists of two main components: a backend server and a frontend client.

# Project Structure
The project is organized into two folders:
- Backend: Contains the server-side code.
- Frontend: Contains the client-side code.

# Getting Started
Follow the steps below to set up and run the app on your local machine:

1. Clone The Repository
   ```js
   git clone https://github.com/michelleflorence/sales-app-duaputri.git
   cd sales-app-duaputri
   ```
2. Install Dependencies:
- Navigate to the backend folder and install dependencies:
    ```js
    cd backend
    npm install 
    ```
- Next, navigate to the frontend folder and install dependencies:
    ```js
    cd frontend
    npm install
    ```

# Running The Application
Follow these steps to start the backend server and frontend client.

## Backend (Server)
1. Navigate to the backend folder:
    ```js
    cd backend
    ```
2. Start the server with nodemon:
    ```js
    nodemon server.js
    ```
    The server will automatically restart on file changes.

## Frontend (Client)
1. Navigate to the frontend folder:
    ```js
    cd frontend
    ```
2. Start the server with nodemon:
    ```js
    npm run dev
    ```
    The frontend client will be served in development mode.

## Login Information
Use the following accounts to access the different roles:

| Role       | Email               | Password    |
|------------|---------------------|-------------|
| Superadmin | superadmin@gmail.com| michelle123 |
| Admin      | admin@gmail.com     | linda123    |
| Cashier    | kasir@gmail.com     | claudia123  |

# Project Features
- Role-based access for superadmin, admin, and cashier
- Management of products, customers, orders, and staff with full CRUD capabilities
- Daily earnings tracking with breakdown by payment methods (cash, QRIS, and transfers)
- Dark mode and light mode toggle for user convenience

# Technologies Used
- Backend: Node.js, Express
- Frontend: React.js (Vite)
