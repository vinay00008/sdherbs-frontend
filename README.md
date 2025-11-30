# SD Herbs Frontend

This is the React frontend for the SD Herbs Dynamic Website.

## Features
- **Admin Panel**: Manage website content (Products, Activities, etc.).
- **Dynamic Content**: Fetches data from the backend API.
- **Responsive Design**: Built with Tailwind CSS.

## Prerequisites
- Node.js (v16+)

## Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd sdherbs-frontend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Environment Variables:**
    Create a `.env` file in the root directory:
    ```env
    REACT_APP_API_URL=https://your-backend-domain.com/api
    ```

4.  **Run Locally:**
    ```bash
    npm start
    ```

## Deployment (Vercel)

1.  Import the project into Vercel.
2.  **Framework Preset**: Create React App.
3.  **Build Command**: `npm run build`
4.  **Output Directory**: `build`
5.  **Environment Variables**: Add `REACT_APP_API_URL` pointing to your deployed backend URL.
