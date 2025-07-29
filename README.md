# Wonder Cloud Drive

A full-stack personal cloud storage system built with React, Node.js, and MongoDB.

## Features

- User authentication (login/register)
- File upload and management
- File download and deletion
- Responsive UI with Material-UI
- RESTful API design
- MongoDB for data storage

## Tech Stack

### Frontend

- React 18 with TypeScript
- Material-UI (MUI) for UI components
- React Router for navigation
- Axios for HTTP requests
- Vite for build tool

### Backend

- Node.js with Express
- TypeScript
- MongoDB with Mongoose
- JSON Web Tokens (JWT) for authentication
- Multer for file uploads
- Helmet for security headers
- CORS for cross-origin resource sharing

## Project Structure

```
wonder-cloud-drive/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   └── server.ts
│   ├── .env
│   ├── .env.example
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── .env
│   ├── index.html
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or cloud instance)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/2311719626/wonder-cloud-drive.git
   cd wonder-cloud-drive
   ```

2. Install backend dependencies:

   ```bash
   cd backend
   npm install
   ```

3. Install frontend dependencies:
   ```bash
   cd ../frontend
   npm install
   ```

### Configuration

1. Backend configuration:

   - Copy `backend/.env.example` to `backend/.env`
   - Update the values in `backend/.env` with your configuration:
     ```
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/wonder-cloud-drive
     JWT_SECRET=your_jwt_secret_key
     ```

2. Frontend configuration:
   - Copy `frontend/.env.example` to `frontend/.env`
   - Update the values in `frontend/.env` with your configuration:
     ```
     VITE_API_URL=http://localhost:5000/api
     ```

### Running the Application

1. Start the backend server:

   ```bash
   cd backend
   npm run dev
   ```

2. Start the frontend application:

   ```bash
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:3000` (or the port shown in the terminal)

### Building for Production

1. Build the backend:

   ```bash
   cd backend
   npm run build
   ```

2. Build the frontend:
   ```bash
   cd frontend
   npm run build
   ```

## API Endpoints

### Authentication

- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user info

### Files

- `GET /api/files` - Get user files
- `POST /api/files/upload` - Upload a file
- `GET /api/files/:id/download` - Download a file
- `DELETE /api/files/:id` - Delete a file

## Deployment

This application can be deployed to any cloud platform that supports Node.js applications. For deployment to a specific platform, please refer to that platform's documentation.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
