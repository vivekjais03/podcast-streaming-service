# 🎷 Podcast Streaming Service

A full-stack podcast streaming platform where users can register, log in, upload podcasts, and listen to podcasts. Built using the MERN stack and deployed using Render (backend) and Vercel (frontend).

#📍 Live Website

https://podcast-streaming-service-rouge.vercel.app

#🚀 Features

 -> User authentication (signup & login)

 -> Upload & stream podcasts

 -> View all podcasts on dashboard

 -> Audio player with controls

 -> Add to favourites

 -> Responsive UI with React.js & Tailwind CSS

#🧰 Tech Stack

#🔧 Frontend

React.js

Tailwind CSS

Axios

#🚀 Backend

Express.js

MongoDB + Mongoose

Multer (file uploads)

bcryptjs, JWT (authentication)

Helmet + CORS (security)

#📚 Project Structure

/podcast-streaming-service
|-- /client         # Frontend (React)
|-- /server         # Backend (Node.js + Express)
    |-- /routes     # API routes (auth, podcasts, favourites)
    |-- /models     # Mongoose schemas
    |-- /uploads    # Uploaded podcast audio files
    |-- index.js    # Entry point of backend

#🎥 Screenshots

Login, Register, Upload, Audio Player

#🛠️ Installation & Setup

1. Clone the Repository

git clone https://github.com/vivekjais03/podcast-streaming-service.git
cd podcast-streaming-service

2. Install Client Dependencies

cd client
npm install

3. Install Server Dependencies

cd ../server
npm install

4. Create .env File in server/

MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret_key

5. Run Locally

# Start backend
cd server
npm start

# In another terminal
cd ../client
npm start

#✨ Deployment

Frontend hosted on Vercel

Backend hosted on Render

#🙌 Author

Made with ❤️ by Vivek Jaiswal
GitHub: @vivekjais03

#🚪 License

This project is licensed under the MIT License - feel free to use it for learning or projects.

