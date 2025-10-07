Blog App
========

A modern, responsive blogging platform built with **Next.js (React)** for the frontend and **Django REST Framework** for the backend. Users can read posts, filter by category, comment on blogs, and manage their own posts. The app supports authentication, real-time comments, and rich media content.

Table of Contents
-----------------

*   [Features](#features)
    
*   [Tech Stack](#tech-stack)
    
*   [Getting Started](#getting-started)
    
*   [Running the Project](#running-the-project)
    
*   [API Endpoints](#api-endpoints)
    

Features
--------

*   User authentication (sign up, login, logout)
    
*   Create, edit, and delete blog posts
    
*   Categorized blog posts (Technology, Health, Travel, Lifestyle, Education)
    
*   Rich-text blog content
    
*   Cover images for posts
    
*   Comments system with author and timestamp
    
*   Responsive design for desktop and mobile
    
*   Filter posts by category
    
*   Clean, modern UI using **Shadcn UI**
    

Tech Stack
----------

**Frontend:**

* Next.js 14
    
* React
    
* Axios for API requests
    
* Framer Motion for animations
    
* Shadcn UI for components
    

**Backend:**

* Django 4.x
 
* Django REST Framework
    
* PostgreSQL (or SQLite for development)
  
* CORS headers for cross-origin support
    

**Other:**

* Vercel for frontend deployment
    
* Sonner for toast notifications
    
Getting Started
---------------

1.  **Clone the repository**
    
```bash
git clone https://github.com/yourusername/blog-app.git
cd blog-app
```

1.  **Backend Setup (Django)**

```bash
cd blog_backend  
python -m venv venv  
source venv/bin/activate  # On Windows: venv\Scripts\activate  
pip install -r requirements.txt  
python manage.py migrate  
python manage.py runserver
```

1.  **Frontend Setup (Next.js)**

```bash   
cd blog_frontend  
npm install  
npm run dev
```
- Frontend runs on http://localhost:3000 and backend runs on http://localhost:8000.


Running the Project
-------------------

*   **Frontend:** npm run dev
    
*   **Backend:** python manage.py runserver
    

The blog homepage will show all posts. Use category buttons to filter posts dynamically.

API Endpoints
-------------

**Posts**

* GET /api/posts/ – List all posts
    
* GET /api/posts/:id/ – Retrieve single post
    
* POST /api/posts/ – Create post (authenticated)
    
* PUT /api/posts/:id/ – Update post (authenticated)
    
* DELETE /api/posts/:id/ – Delete post (authenticated)
    

**Comments**

* GET /api/comments/?post= – List comments for a post
    
* POST /api/comments/ – Create comment (authenticated)
    

**Authentication**

* POST /api/auth/register/ – Register user
    
* POST /api/auth/login/ – Login user
