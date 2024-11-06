# Strip Subscription Integration (MERN)

Welcome to the Stripe Subscription Integration project! This application showcases how to implement subscription functionality using Stripe in a MERN (MongoDB, Express, React, Node.js) stack. This documentation will guide you through the setup, usage, and features of the application.

## Table of Contents

- [Features](#features)
- [Technologies Used](#technologies-used)
- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

- User registration and authentication with JWT.
- Stripe payment integration for managing subscriptions.
- Subscription plans management (create, retrieve, update, delete).
- Secure payment processing with webhooks for real-time updates.
- Responsive user interface built with React.
- User dashboard for managing subscriptions and billing.

## Technologies Used

- **Frontend:** React, Axios, Bootstrap
- **Backend:** Node.js, Express.js, MongoDB
- **Stripe:** Stripe API for payment integration
- **Authentication:** JSON Web Tokens (JWT)

## Installation

Follow these instructions to set up the project locally:

1. **Clone the Repository:**
   ```bash
   git clone https://github.com/NP5555/Strip-Subcription-Integration-MERN.git
   cd Strip-Subcription-Integration-MERN
   ```

2. **Setup Backend:**
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```
   - Create a `.env` file in the backend directory and add your environment variables, such as:
     ```
     MONGODB_URI=your_mongodb_connection_string
     JWT_SECRET=your_jwt_secret
     STRIPE_SECRET_KEY=your_stripe_secret_key
     ```

3. **Setup Frontend:**
   - Navigate to the frontend directory:
     ```bash
     cd frontend
     ```
   - Install the dependencies:
     ```bash
     npm install
     ```

4. **Run the Application:**
   - Start the backend server:
     ```bash
     cd backend
     npm start
     ```
   - In another terminal, start the frontend server:
     ```bash
     cd frontend
     npm start
     ```

5. **Access the Application:**
   Open your browser and go to `http://localhost:3000`.

## Usage

- Register a new account or log in with an existing one.
- Navigate to the subscription management area to create a new subscription plan.
- Use the Stripe checkout flow to manage payments securely.
- Monitor your billing cycle and subscription status through the dashboard.

## API Endpoints

Here are some of the key API endpoints you can use:

- **User Registration**: `POST /api/auth/register`
- **User Login**: `POST /api/auth/login`
- **Create Subscription**: `POST /api/subscribe`
- **Get Subscription Status**: `GET /api/subscribe/status`
- **Webhook for Stripe**: `POST /api/webhook`

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, please create an issue or submit a pull request. Be sure to follow the existing coding style.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Thank you for checking out the Stripe Subscription Integration project! If you have any questions or issues, feel free to open an issue on the GitHub repository.

# Happy Coding!
