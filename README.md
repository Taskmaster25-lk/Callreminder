# CallMeBack - Call Reminder App

A clean, subscription-based mobile app that reminds you to call someone at a specific time with an incoming call-style alert.

## Features

### Core Features
- ✅ **User Authentication**: Email/Password and Google OAuth login
- ✅ **Reminder Management**: Create, view, and delete call reminders
- ✅ **Incoming Call UI**: Full-screen alert with slide-to-call and slide-to-cancel
- ✅ **Subscription Plans**: Free (5 reminders) and Premium (unlimited)
- ✅ **Push Notifications**: Real-time reminders via Expo Notifications
- ✅ **Payment Integration**: Razorpay payment gateway (ready to configure)

### Technical Stack
- **Frontend**: Expo (React Native) + TypeScript + Expo Router
- **Backend**: FastAPI (Python) + MongoDB
- **Authentication**: JWT + Firebase Auth
- **Payments**: Razorpay
- **Notifications**: Expo Push Notifications

## Project Structure

```
callmeback/
├── backend/
│   ├── server.py          # FastAPI server with all endpoints
│   ├── requirements.txt   # Python dependencies
│   └── .env               # Backend environment variables
│
├── frontend/
│   ├── app/
│   │   ├── (tabs)/        # Tab navigation screens
│   │   │   ├── home.tsx
│   │   │   ├── subscription.tsx
│   │   │   └── settings.tsx
│   │   ├── auth/          # Authentication screens
│   │   │   ├── login.tsx
│   │   │   └── signup.tsx
│   │   ├── context/       # React contexts
│   │   │   ├── AuthContext.tsx
│   │   │   └── NotificationContext.tsx
│   │   ├── index.tsx      # Splash screen
│   │   ├── add-reminder.tsx
│   │   ├── incoming-call.tsx
│   │   └── _layout.tsx    # Root layout
│   ├── package.json
│   ├── app.json
│   └── .env               # Frontend environment variables
│
└── README.md              # This file
```

## Setup Instructions

### Prerequisites
- Node.js 18+ and Yarn
- Python 3.11+
- MongoDB (running locally or Atlas)
- Expo CLI: `npm install -g expo-cli`
- Expo Go app on your phone (for testing)

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Configure environment variables**:
   Create or update `backend/.env` with:
   ```env
   MONGO_URL=mongodb://localhost:27017/
   DB_NAME=callmeback
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
   ```

4. **Start the backend server**:
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   yarn install
   ```

3. **Configure environment variables**:
   Update `frontend/.env` with:
   ```env
   EXPO_PUBLIC_BACKEND_URL=http://YOUR_LOCAL_IP:8001
   ```
   **Note**: Replace `YOUR_LOCAL_IP` with your computer's local IP address (not localhost)

4. **Start Expo dev server**:
   ```bash
   yarn start
   ```

5. **Run on device**:
   - Scan the QR code with Expo Go app (iOS) or camera (Android)
   - Or press `i` for iOS simulator, `a` for Android emulator

## Configuration Guide

### Firebase Authentication Setup

1. **Create Firebase Project**:
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication > Sign-in methods > Google

2. **Add Firebase to your app**:
   - Download `google-services.json` (Android) and `GoogleService-Info.plist` (iOS)
   - Get your Firebase config

3. **Update frontend code**:
   - Create `frontend/firebaseConfig.ts`:
   ```typescript
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```

4. **Implement Google Sign-In**:
   - In `login.tsx`, use Firebase Google authentication
   - Send the ID token to backend's `/api/auth/google` endpoint

### Razorpay Payment Setup

1. **Get Razorpay credentials**:
   - Sign up at [Razorpay](https://razorpay.com/)
   - Get your Key ID and Key Secret from Dashboard

2. **Update backend**:
   Add to `backend/.env`:
   ```env
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

3. **Update backend code**:
   In `server.py`, replace the mock payment code with real Razorpay integration:
   ```python
   import razorpay
   
   razorpay_client = razorpay.Client(
       auth=(os.getenv('RAZORPAY_KEY_ID'), os.getenv('RAZORPAY_KEY_SECRET'))
   )
   ```

4. **Frontend integration**:
   - Install: `cd frontend && yarn add react-native-razorpay`
   - Update subscription screen to use Razorpay SDK

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login with email/password
- `POST /api/auth/google` - Google OAuth login

### Reminders
- `POST /api/reminders/create` - Create new reminder
- `GET /api/reminders/list` - Get user's reminders
- `GET /api/reminders/check` - Check for upcoming reminders
- `DELETE /api/reminders/{id}` - Delete reminder
- `POST /api/reminders/{id}/complete` - Mark as completed

### Payments
- `POST /api/payments/create-order` - Create Razorpay order
- `POST /api/payments/verify-payment` - Verify payment

### User
- `GET /api/user/profile` - Get user profile
- `GET /api/user/plan-status` - Get subscription status

## Subscription Plans

| Plan | Price | Duration | Reminders |
|------|-------|----------|----------|
| Free | ₹0 | Forever | 5 per month |
| Monthly Premium | ₹79 | 1 month | Unlimited |
| Quarterly Premium | ₹199 | 3 months | Unlimited |

## Deployment

### Backend Deployment (Render/Railway)

1. **Prepare for deployment**:
   - Ensure `requirements.txt` is up to date
   - Set environment variables in hosting platform
   - Use MongoDB Atlas for production database

2. **Deploy to Render**:
   ```bash
   # Create new Web Service
   # Build Command: pip install -r requirements.txt
   # Start Command: uvicorn server:app --host 0.0.0.0 --port $PORT
   ```

3. **Environment variables**:
   - `MONGO_URL` - MongoDB Atlas connection string
   - `JWT_SECRET` - Strong random secret
   - `RAZORPAY_KEY_ID` - Your Razorpay key
   - `RAZORPAY_KEY_SECRET` - Your Razorpay secret

### Frontend Deployment (EAS Build)

1. **Install EAS CLI**:
   ```bash
   npm install -g eas-cli
   ```

2. **Configure EAS**:
   ```bash
   cd frontend
   eas init
   eas build:configure
   ```

3. **Build APK/IPA**:
   ```bash
   # Android
   eas build --platform android
   
   # iOS
   eas build --platform ios
   ```

4. **Submit to stores**:
   ```bash
   eas submit --platform android
   eas submit --platform ios
   ```

## Testing

### Test User Flow

1. **Sign Up**: Create new account with email/password
2. **Add Reminder**: Set a reminder 2 minutes in the future
3. **Wait for Notification**: App will show notification when time arrives
4. **Incoming Call Screen**: Tap notification to see call screen
5. **Make Call**: Slide to call button opens phone dialer
6. **Subscription**: Try upgrading to premium (uses test payment)

### Test Credentials (Development)
```
Email: test@example.com
Password: test123
```

## Troubleshooting

### Backend not connecting
- Check MongoDB is running: `mongosh`
- Verify MONGO_URL in `.env`
- Check backend logs for errors

### Push notifications not working
- Enable notifications permission on device
- Check Expo push token in logs
- Use physical device (notifications don't work in simulator)

### Payment flow issues
- Razorpay keys must be in production mode for real payments
- Test mode is active by default
- Check Razorpay dashboard for payment status

### App not loading
- Clear Metro bundler cache: `yarn start --clear`
- Restart Expo: `r` in terminal
- Check `EXPO_PUBLIC_BACKEND_URL` points to correct IP

## Environment Variables Reference

### Backend (.env)
```env
MONGO_URL=mongodb://localhost:27017/
DB_NAME=callmeback
JWT_SECRET=your-secret-key-change-in-production
RAZORPAY_KEY_ID=your_razorpay_key_id          # Add after signup
RAZORPAY_KEY_SECRET=your_razorpay_secret      # Add after signup
```

### Frontend (.env)
```env
EXPO_PUBLIC_BACKEND_URL=http://YOUR_IP:8001    # Update with your IP
```

## Features to Add (Future Enhancements)

- [ ] Recurring reminders (daily/weekly)
- [ ] Custom ringtones
- [ ] Reminder history
- [ ] Backup/sync across devices
- [ ] Dark mode
- [ ] Calendar integration
- [ ] WhatsApp/SMS reminders
- [ ] Multiple alarm sounds
- [ ] Snooze functionality

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review the API endpoint documentation
3. Check backend logs for errors
4. Verify all environment variables are set correctly

## License

MIT License - feel free to use this project for personal or commercial purposes.

---

**Built with ❤️ using Expo, FastAPI, and MongoDB**
