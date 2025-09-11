# CafeChain - Cafe Loyalty Network Frontend

## Overview

CafeChain is a React-based frontend application for a cafe loyalty network system. It allows cafe owners to join a network, manage their loyalty programs, track metrics, process redemptions, and participate in network-wide events and promotions.

## Features

- **Authentication System**: User registration and login
- **First-time Setup**: Guided setup for new cafe owners
- **Dashboard**: Comprehensive dashboard with key metrics
- **Metrics Tracking**: Sales, transactions, customer data, and loyalty program statistics
- **Redemption System**: Process customer reward redemptions with OTP verification
- **Leaderboard**: Network-wide cafe rankings
- **Ads & Events**: Manage promotions and special events
- **Activity Log**: Track transactions and activities
- **Performance Analytics**: Business performance metrics and insights
- **Responsive Design**: Mobile-friendly interface

## Tech Stack

- **React**: Frontend library
- **React Router**: Navigation and routing
- **Context API**: State management
- **Tailwind CSS**: Styling and UI components
- **Vite**: Build tool and development server
- **localStorage**: Client-side data persistence

## Project Structure

```
├── src/
│   ├── assets/         # Static assets and dummy data
│   ├── components/     # Reusable UI components
│   ├── pages/          # Application pages
│   │   ├── auth/       # Authentication pages
│   │   ├── dashboard/  # Dashboard and subpages
│   │   └── setup/      # Setup pages
│   ├── store/          # Context and state management
│   ├── utils/          # Utility functions
│   ├── App.jsx         # Main application component
│   ├── main.jsx        # Application entry point
│   └── index.css       # Global styles
├── index.html          # HTML entry point
├── tailwind.config.js  # Tailwind CSS configuration
├── postcss.config.js   # PostCSS configuration
└── package.json        # Project dependencies
```

## Getting Started

### Prerequisites

- Node.js (v14.0.0 or higher)
- npm (v6.0.0 or higher)

### Installation

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/cafechain-frontend.git
   cd cafechain-frontend
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Start the development server
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

## Dashboard Components

### Metrics
Displays key performance indicators including daily sales, total customers, loyalty points issued, and redemption statistics.

### Redemption
Allows cafe staff to process customer reward redemptions using a point-based system with OTP verification.

### Leaderboard
Shows cafe rankings within the network based on customer engagement, sales, and loyalty program effectiveness.

### Ads & Events
Manage network-wide advertisements and create cafe-specific events and promotions.

### Activity Log
Track transaction history with filtering options for time periods and transaction types.

### Performance
Visual analytics showing points trends, user activity, event participation, and customer segmentation.

### Profile & Gallery
Manage cafe profile information, photo gallery, and loyalty program redemption settings.

## Accessibility Features

CafeChain is built with accessibility in mind:

- Semantic HTML structure
- ARIA attributes for interactive elements
- Keyboard navigation support
- Focus management
- Screen reader friendly content
- Responsive design for all device sizes

## Responsive Design

The application is fully responsive and works on devices of all sizes:

- Mobile-first approach
- Flexible layouts using Tailwind CSS grid and flex
- Responsive typography
- Touch-friendly interactive elements
- Optimized navigation for small screens

## License

MIT