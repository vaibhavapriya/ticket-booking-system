# ticket-booking-system

This project is a dynamic movie ticket booking application that allows users to book seats for movies and manage cinema hall configurations. It includes features like dynamic seat layout generation, picking and interactive booking.

## Features
- **Cinema Hall Management**:
  - Dynamically generate seat layouts based on rows and columns.
  - Upload and crop cinema hall images for customization.

- **User-Friendly Booking**:
  - Interactive seat selection with real-time updates.
  - Responsive design for seamless use on all devices.

- **Image Cropping Utility**:
  - Upload and crop images using `react-easy-crop`.
  - Convert cropped images to files for server upload.

- **Backend Integration**:
  - APIs to fetch and upload cinema hall data and user bookings.

## Technologies Used
- **Frontend**:
  - React.js with functional components.
  - Tailwind CSS for responsive styling.
  - `axios` for API requests.

- **Backend**:
  - Node.js and Express.js for the server.
  - MongoDB for data storage.

- **Deployment**:
  - Frontend hosted on [Netlify]([https://netlify.com/](https://loquacious-florentine-32cf70.netlify.app/)).
  - Backend hosted on [Render]([https://render.com/](https://ticket-booking-system-7vpl.onrender.com)).

## Installation

### Prerequisites
- Node.js (v14 or higher recommended)
- npm or yarn

### Setup Instructions
1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/movie-ticket-booking-app.git
   cd movie-ticket-booking-app
