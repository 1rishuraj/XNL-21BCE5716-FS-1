# **Fintech Platform Project Full-Documentation**

## **1. Overview**
This **Full-Stack Fintech Platform** developed using **React.js, Node.js (Hono), Cloudflare Workers, Prisma (PostgreSQL)**, and deployed on **Vercel** for the frontend and **Cloudflare Workers** for the backend. The system supports **secure user authentication, real-time transactions, multi-currency support, and automated notifications.**

![ezgif-756b5d355be551](https://github.com/user-attachments/assets/51610c4f-4a4c-4505-baf3-bf514b0f74ae)


### **Live Deployed App URL:**
[Click Here](https://xnl-21-bce-5716-fs-1.vercel.app/signup)

### **Demo Video:**
[HERE](https://drive.google.com/file/d/1PUzFWXD3ARJA5Nyn9FunUG1jnhTDSZP6/view?usp=sharing)

## **2. System Architecture**
The system follows a **serverless and event-driven microservices architecture**, ensuring scalability, security, and real-time performance. Below is an overview of the major components:

### **2.1 Architectural Diagram**
![here](https://github.com/user-attachments/assets/48178f20-2d89-49a4-a7a0-314fecea3192)

## **3. Features & Implementation**

### **3.1 Authentication & Security**
- Implemented **JWT-based authentication** with `Hono/jwt`.
- Used **Zod validation** for secure input handling.
- Middleware in Hono to protect API routes.

### **3.2 Database & ORM**
- **Neon PostgreSQL** as a serverless and scalable DB.
- **Prisma ORM** with `prisma accelerate` for connection pooling for scalability, reduced latency and and lowers memory/CPU usage, cutting cloud costs.
- **Atomic transaction sessions** to prevent double-spending.
- Data partitioning and indexing for high performance.

#### **3.2.1 Database Schema**
```prisma
model User {
  id        Int      @id @default(autoincrement())
  email     String   @unique
  firstName String
  lastName  String
  password  String
  accounts  Account[] 
}

model Account {
  id       Int      @id @default(autoincrement())
  userId   Int
  balance   Float    
  user     User     @relation( fields: [userId], references: [id])
}
```

### **3.3 Backend & API Design**
- **Hono framework** for a lightweight and serverless API layer.
- **Cloudflare Workers** for auto-load balancing and edge computing.
- Secure API routes with JWT validation middleware.

### **3.4 API Documentation with Postman Testing**

##### **User Endpoints**

1. **Signup (User Registration)**
   - **Endpoint:** `POST /api/v1/user/signup`
   - **Description:** Registers a new user and returns a JWT token.
   - **Request Body:**
     ```json
     {
       "email": "user@example.com",
       "firstName": "John",
       "lastName": "Doe",
       "password": "securepassword"
     }
     ```
   - **Response:**
     ```json
     {
       "token": "jwt-token-string"
     }
     ```
     ![signup](https://github.com/user-attachments/assets/173ac21e-4ab9-4acf-ba3a-953c23d4c39c)

2. **Signin (User Login)**
   - **Endpoint:** `POST /api/v1/user/signin`
   - **Description:** Authenticates a user and returns a JWT token.
   - **Request Body:**
     ```json
     {
       "email": "user@example.com",
       "password": "securepassword"
     }
     ```
   - **Response:**
     ```json
     {
       "token": "jwt-token-string"
     }
     ```
     ![signin](https://github.com/user-attachments/assets/c695c1c0-79a1-4c36-95d9-184fdace73a4)


##### **Account Endpoints**

1. **Get Account Balance**
   - **Endpoint:** `GET /api/v1/account/balance`
   - **Description:** Retrieves the account balance of the authenticated user.
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <jwt-token>"
     }
     ```
   - **Response:**
     ```json
     {
       "acc": {
         "balance": 5000.75,
         "userId": 1
       }
     }
     ```
     ![bal](https://github.com/user-attachments/assets/7ec226cf-0f3f-4810-8393-3c427b738545)

2. **Transfer Money**
   - **Endpoint:** `POST /api/v1/account/transfer`
   - **Description:** Transfers money from the authenticated user to another user.
   - **Headers:**
     ```json
     {
       "Authorization": "Bearer <jwt-token>"
     }
     ```
   - **Request Body:**
     ```json
     {
       "amount": 100.00,
       "to": 2
     }
     ```
   - **Response:**
     ```json
     {
       "message": "Transfer successful"
     }
     ```
     ![transfer](https://github.com/user-attachments/assets/dae0919a-ec5b-4d5b-a2b2-70b529cc2d30)

### **3.5 Multi-Currency Payment System**
- Integrated **ExchangeRatesAPI.io** for currency conversion.
- Base currency: **EUR**, with support for **USD, INR**.
- **API Documentation for Exchange Rates:**
  - **Base URL:** `https://api.exchangeratesapi.io/v1/`
  - **Authentication:** API Key (`access_key` parameter)
  - **Example Request:**
    ```plaintext
    https://api.exchangeratesapi.io/v1/latest?access_key=API_KEY
    ```
  - **Example Response:**
    ```json
    {
        "success": true,
        "timestamp": 1519296206,
        "base": "EUR",
        "date": "2021-03-17",
        "rates": {
            "AUD": 1.566015,
            "CAD": 1.560132,
            "CHF": 1.154727,
            "CNY": 7.827874,
            "GBP": 0.882047,
            "JPY": 132.360679,
            "USD": 1.23396,
        [...]
        }
    }
    ```
    ![exch](https://github.com/user-attachments/assets/c400e560-7413-4382-8f66-ed9864b2978d)

### **3.6 Real-Time Transaction Processing**
- **Current implementation uses `setInterval()` in React to poll the API.**
- **Transactions are processed atomically to maintain data integrity.**

### **3.7 Notification System**
- **Used React Toastify for frontend transaction notifications.**

## **4. Deployment**

### **4.1 Frontend Deployment**
- **Platform:** Vercel
- **Auto-deployment on push to GitHub.**

### **4.2 Backend Deployment**
- **Platform:** Cloudflare Workers (Auto-scalable)
- **Database:** Neon PostgreSQL
- **API security:** JWT validation middleware.



