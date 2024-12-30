# Post Creation Project

This project allows you to create posts. It consists of two parts:

- **Frontend**: Vue.js for the user interface
- **Backend**: Express.js with TypeScript for handling data

## Technologies Used

- **Frontend**: Vue.js
- **Backend**: Express.js, TypeScript
- **Database**: MySQL (or another of your choice)

## Prerequisites

- **Node.js** (version 18 or higher)
- **npm**
- **TypeScript** (it will be automatically installed if needed)

### Clone the project

```bash
git clone git@github.com:HangaWilfried/pencil.git
cd pencil
```

### Features
The app allows you to:

- Create a post: Add a title and content
- View all posts: List of existing posts

API Routes
Here are the main API routes for interacting with the backend:
- POST /api/posts: Create a new post
- GET /api/posts: Retrieve a list of posts