
# 📚 Personal Learning Platform

## Overview

Personal Learning Platform is a modern, full-stack web application designed to help users learn, track progress, and master new skills through curated video courses. Built with a scalable architecture, it provides a seamless experience for both learners and administrators.

## Features

- User authentication and profile management
- Course catalog with module and video breakdown
- Progress tracking and completion badges
- Dashboard with learning streaks and personalized stats
- Secure backend with RESTful API (Node.js/Express)
- Responsive frontend using Next.js and Tailwind CSS
- YouTube video integration for lessons
- Admin tools for course and user management (extensible)

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Authentication:** JWT & Cookie-based sessions
- **Video:** YouTube API integration

## Getting Started

1. **Clone the repository:**
	```bash
	git clone https://github.com/TanmayWarthe/personal-learning-platform.git
	cd personal-learning-platform
	```

2. **Install dependencies:**
	- For the backend:
	  ```bash
	  cd server
	  npm install
	  ```
	- For the frontend:
	  ```bash
	  cd ../client
	  npm install
	  ```

3. **Configure environment variables:**
	- Copy `.env.example` to `.env` in both `server` and `client` folders and update values as needed.

4. **Run the application:**
	- Start the backend:
	  ```bash
	  cd server
	  npm run dev
	  ```
	- Start the frontend:
	  ```bash
	  cd ../client
	  npm run dev
	  ```

5. **Access the app:**
	- Open [http://localhost:3000](http://localhost:3000) in your browser.

## Folder Structure

- `client/` - Next.js frontend
- `server/` - Express.js backend
- `docs/` - Architecture and documentation

## Contributing

Contributions are welcome! Please open issues or submit pull requests for improvements, bug fixes, or new features.

## License

This project is licensed under the MIT License.


