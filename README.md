# Task-Manager

Task Manager is a full-stack MERN application that allows users to manage tasks with role-based access control, task assignment, and file attachments. The application is built with a clear separation of frontend and backend, includes API documentation, and supports containerized development.

---

## Live Application

- **Frontend:**  
  https://sauravjhatask.netlify.app/

- **Backend API:**  
  https://task-manager-9mtr.onrender.com/

- **API Documentation (Swagger):**  
  https://task-manager-9mtr.onrender.com/api-docs

---

## Tech Stack

### Frontend
- React
- Tailwind CSS
- Redux Toolkit
- Axios

### Backend
- Node.js (ES Modules)
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- Multer (file upload handling)
- Swagger (API documentation)

### DevOps
- Docker
- Docker Compose

---

## Features

- JWT-based authentication (Login/Register)
- Role-Based Access Control (Admin and User)
- Task CRUD operations
- Task assignment (Admin → User)
- File upload support (local storage)
- Filtering, sorting, and pagination
- User management (Admin only)
- Swagger API documentation
- Dockerized backend

---

## Roles and Permissions

### Admin
- Create tasks
- Assign tasks to users
- View all tasks
- Delete any task
- Manage users

### User
- View assigned or created tasks
- Update task status
- Cannot assign tasks or manage users

---

## Important Notes

- There is no frontend interface to create an admin user.
- Admin users must be created manually using Postman or Swagger.
- File uploads are stored locally in the `/uploads` directory.
- Local storage does not persist in production environments (such as Render).
- As a result, file upload/view functionality may not work after deployment.
- For production use, a cloud storage solution (e.g., Cloudinary or AWS S3) should be implemented.

---

## Project Structure


task-manager/
│
├── frontend/
│ ├── src/
│ ├── pages/
│ ├── components/
│ ├── redux/
│ └── services/
│
├── backend/
│ ├── src/
│ │ ├── controllers/
│ │ ├── models/
│ │ ├── routes/
│ │ ├── middleware/
│ │ └── config/
│ ├── uploads/
│ └── server.js
│
├── docker-compose.yml
└── README.md


---

## Environment Variables

Create a `.env` file inside the backend folder:


PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
TEST_MONGO_URI=your_test_database_uri


---

## Local Setup

### 1. Clone Repository


git clone <your-repository-url>
cd task-manager


---

### 2. Backend Setup


cd backend
npm install
npm run dev


---

### 3. Frontend Setup


cd frontend
npm install
npm start


---

## Docker Setup

### Run Full Project


docker-compose up --build


### Stop Containers


docker-compose down


### View Backend Logs


docker logs -f task-manager-backend


---

## API Documentation

Swagger UI is available at:


https://task-manager-9mtr.onrender.com/api-docs


Includes:
- Authentication endpoints
- Task endpoints
- User management endpoints

---

## Authentication

All protected routes require JWT token in headers:


Authorization: Bearer <token>


---

## Create Admin User

Since there is no frontend support, use Postman or Swagger.

### Endpoint


POST /api/auth/register


### Request Body

```json
{
  "email": "admin@test.com",
  "password": "123456",
  "role": "admin"
}

Known Limitations
File storage is local and not persistent in production
No cloud storage integration implemented
Admin creation not available in frontend UI
Future Improvements
Cloud storage integration (Cloudinary / AWS S3)
Admin dashboard for user management
Improved UI/UX
Real-time updates (WebSockets)
Activity tracking and analytics
Conclusion

This project demonstrates a complete MERN stack implementation with authentication, role-based access control, task assignment, file handling, and API documentation. It is structured for scalability and can be extended with production-grade features.