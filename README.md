# KoLab -
A collaborative code editor built with the MERN stack and Socket.io. Share a room ID with others to write code together in real time, chat on the side, and run your code directly in the browser.

## What it does

- **Live editor sync:** Changes show up immediately for everyone in the room using Socket.io and Monaco Editor.
- **Run code:** Supports JS, C++, Python, and a few others via an external execution API.
- **Room chat & users:** See who's currently in the room and message each other while coding.
- **Saved rooms:** Log in to keep track of past rooms, pick up where you left off, or delete old ones from your dashboard.

## Stack

- **Frontend:** React, Monaco Editor, Socket.io Client, Axios
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB (Mongoose)
- **Auth & Execution:** JWT, Piston / Judge0 API

## Running it locally

1. **Clone the repo**
   ```bash
   git clone [https://github.com/your-username/your-repo-name.git](https://github.com/your-username/your-repo-name.git)
   cd your-repo-name
Backend

Bash
cd server
npm install
Create a .env file in server/ with:

Code snippet
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_jwt_secret
Bash
npm run dev
Frontend

Bash
cd client
npm install
Create a .env file in client/ with:

Code snippet
VITE_API_URL=http://localhost:5000
Bash
npm run dev
