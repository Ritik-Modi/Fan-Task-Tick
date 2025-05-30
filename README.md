# Fan-Task-

FantaskTick deployed Server Link : https://fan-task-tick.onrender.com

## 🧠 FantaskTick API Collection

This collection contains a comprehensive set of API endpoints for **FantaskTick**, a task and project management platform. It includes requests for:

* 🔐 **User Authentication**: Signup, login, and token-based authorization.
* 📋 **Task Management**: Create, read, update, and delete tasks.
* 🗂 **Project Features**: Manage projects and their associated tasks.
* 👥 **User Roles & Teams**: Assign roles and manage team collaboration.
* 🔄 **Status & Priority Handling**: Update task status and set priorities.

Here’s a complete list of all the API routes in the **FantaskTick** Postman collection, organized by category. You can copy this directly into your GitHub README:

## 📡 API Endpoints

### 🔐 Auth Routes (`/api/v1/auth`)

* `POST /signUp` – User registration
* `POST /sendOtp` – Send OTP for verification
* `POST /login` – User login
* `GET /logout` – Logout user

### 👨‍💼 Admin Routes (`/api/v1/admin`)

* `POST /createEvent` – Create a new event
* `POST /updateEvent/:eventId` – Update an existing event
* `DELETE /deleteEvent/:eventId` – Delete an event
* `POST /addGenre` – Add a new genre
* `DELETE /removeGenre/:genreId` – Remove a genre

### 🎉 Event Routes (`/api/v1/event`)

* `GET /` – Get all events
* `GET /getEventById/:eventId` – Get event details by ID
* `GET /getEventByGenre/:genreId` – Get events by genre
* `GET /getEventByVenue/:venueName` – Get events by venue
* `GET /getEventByDate?startDate={ISO}&endDate={ISO}` – Get events by date range

### 🧑 Profile Routes (`/api/v1/user`)

* `GET /getUserProfile` – Retrieve user profile
* `GET /` – Create or fetch profile (placeholder endpoints)

### 🎫 Ticket Routes (`/api/v1/event/:eventId/ticket`)

* `POST /create-ticket` – Create ticket for an event
* `GET /getTicketByEvent` – Get all tickets for an event
* `PUT /updateTicket/:ticketId` – Update a ticket
* `DELETE /deleteTicket/:ticketId` – Delete a ticket

### ⭐ Review Routes (`/api/v1/event/:eventId/review`)

* `POST /create-review` – Add a review for an event
* `GET /getReview` – Get reviews for an event
* `DELETE /deleteReview/:reviewId` – Delete a review

### 💳 Payment Routes (`/api/v1/ticket/:ticketId/payment`)

* `POST /` – Purchase ticket
* `PUT /verify` – Mark ticket as paid

---

