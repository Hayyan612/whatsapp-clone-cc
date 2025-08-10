# CometChat WhatsApp UI Kit

A modern WhatsApp clone built with React, TypeScript, Vite, and CometChat's UI Kit. This application provides a complete messaging experience with real-time chat, calling features, and a WhatsApp-like interface.

## 🚀 Features

- **Real-time Messaging**: Instant messaging with CometChat's powerful SDK
- **Voice & Video Calls**: Built-in calling functionality
- **WhatsApp-like UI**: Familiar and intuitive user interface
- **Group Chats**: Create and manage group conversations
- **User Management**: Add/remove users, manage profiles
- **📱 Mobile Responsive**: Fully optimized for mobile devices with touch-friendly interface
- **AI Integration**: Enhanced with Gemini AI capabilities

## 📱 Mobile Features

- **Responsive Design**: Seamlessly adapts from desktop to mobile
- **Touch-Optimized**: 44px minimum touch targets for better mobile experience
- **Mobile Navigation**: Bottom navigation bar and panel switching
- **Smooth Transitions**: Native mobile-like transitions between views
- **iOS/Android Optimized**: Prevents zoom on input focus, proper viewport handling

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite
- **UI Framework**: CometChat UI Kit for React
- **Styling**: CSS3 with custom component styling
- **Backend**: CometChat SDK
- **Deployment**: Vercel
- **Additional**: Firebase integration, Cloudinary for media

## 📋 Prerequisites

Before running this application, make sure you have:

1. Node.js (v18 or higher)
2. npm or yarn package manager
3. CometChat account with App ID, Region, and Auth Key
4. Firebase project (optional, for additional features)

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/Hayyan612/whatsapp-clone-cc.git
cd whatsapp-clone-cc
```

### 2. Install dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_APP_ID=your_cometchat_app_id
VITE_REGION=your_cometchat_region
VITE_AUTH_KEY=your_cometchat_auth_key
```

### 4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. 🔐 Test Login Credentials

To test the application, you can use these pre-configured test users:

**Test User 1:**
- **UID**: `test-1`
- **Name**: Test User 1

**Test User 2:**
- **UID**: `test-2` 
- **Name**: Test User 2

> **Note**: Simply enter one of these UIDs (test-1 or test-2) in the login form to access the chat interface. You can open the app in two different browser windows/tabs and login with different test users to see real-time messaging in action.
VITE_AUTH_KEY=your_cometchat_auth_key
```

### 4. Run the development server
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### 5. 🔐 Test Login Credentials

To test the application, you can use these pre-configured test users:

**Test User 1:**
- **UID**: `test-1`
- **Name**: Test User 1

**Test User 2:**
- **UID**: `test-2` 
- **Name**: Test User 2

> **Note**: Simply enter one of these UIDs (test-1 or test-2) in the login form to access the chat interface. You can open the app in two different browser windows/tabs and login with different test users to see real-time messaging in action.

## 🌐 Deployment

### Deploy to Vercel

This project is configured for easy deployment to Vercel:

1. **Connect your GitHub repository to Vercel**
2. **Set environment variables in Vercel dashboard**:
   - `VITE_APP_ID`
   - `VITE_REGION` 
   - `VITE_AUTH_KEY`
3. **Deploy**: Vercel will automatically build and deploy your application

#### Manual Deployment
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

The `vercel.json` configuration file is already included for optimal deployment settings.

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── Chat/           # Chat interface components
│   ├── Calls/          # Voice/video call components
│   ├── Users/          # User management components
│   └── ...             # Other UI components
├── ai/                 # AI integration (Gemini)
├── assets/             # Static assets
├── styles/             # Global styles and overrides
├── utils/              # Utility functions
└── secrets/            # Configuration files (gitignored)
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_APP_ID` | CometChat App ID | ✅ |
| `VITE_REGION` | CometChat Region | ✅ |
| `VITE_AUTH_KEY` | CometChat Auth Key | ✅ |

## 📖 CometChat Setup

1. Visit [CometChat Dashboard](https://app.cometchat.com/)
2. Create a new app or use existing one
3. Get your App ID, Region, and Auth Key from the dashboard
4. Add these credentials to your `.env` file

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Check [CometChat Documentation](https://www.cometchat.com/docs/)
- Open an issue in this repository
- Contact the maintainers

---

Built with ❤️ using CometChat UI Kit
