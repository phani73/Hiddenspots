# HiddenSpots

**HiddenSpots** is a mobile application designed to help users discover and explore hidden gems in their surroundings. Whether it's a scenic viewpoint, a street art alley, or a cozy local eatery, HiddenSpots empowers users to uncover and share unique locations.

## Features

- 📍 **Discover Hidden Spots:** Easily browse and explore unique, lesser-known locations nearby.
- ✨ **User-Friendly Interface:** Clean and intuitive UI for seamless navigation and spot discovery.
- 📤 **Share Spots:** Users can share their favorite spots with the community.
- 🗺️ **Map Integration:** Visualize spots directly on an interactive map.
- ❤️ **Social Features:** Like, review, and interact with other users’ shared spots.
- 🔐 **User Authentication:** Secure login and logout functionality.
- 🖼️ **Profile Customization:** Upload profile pictures and track your activity and achievements.

## Tech Stack

- **Frontend:** React Native
- **Backend:** Node.js, Express
- **Database:** MongoDB (Atlas)
- **API Testing:** Postman
- **Version Control:** Git, GitHub

## Getting Started

### Prerequisites
- Node.js
- Expo Go (for running React Native app)
- MongoDB Atlas (for database connection)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/phani73/Hiddenspots.git
cd HiddenSpots
cd project  # For frontend
npm install

cd ../backend  # For backend
npm install
cd backend
node server.js
cd ../project
expo start
MONGO_URI=your_mongodb_connection_string
