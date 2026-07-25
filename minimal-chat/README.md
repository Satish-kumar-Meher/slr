# Minimal Two-User Chat Application

A production-quality, minimal two-user real-time chat web application built with React, Vite, Tailwind CSS, and Firebase.

## Setup Instructions

### 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project.
3. Add a Web App to the project and copy the configuration object.

### 2. Enable Authentication
1. Go to **Authentication** in the Firebase Console.
2. Click **Get Started**.
3. Under the **Sign-in method** tab, enable **Email/Password**.

### 3. Create Two Authorized Users
1. In the **Authentication** section, go to the **Users** tab.
2. Click **Add user**.
3. Create two user accounts (e.g., `user1@example.com` and `user2@example.com`).
4. Note down the **User UID** for both newly created users.

### 4. Configure Firestore
1. Go to **Firestore Database** in the Firebase Console.
2. Click **Create database** (Start in production mode).
3. Choose a location and click **Enable**.

### 5. Configure Realtime Database (for Presence)
1. Go to **Realtime Database** in the Firebase Console.
2. Click **Create Database** (Start in locked mode).
3. Choose a location and click **Enable**.

### 6. Environment Configuration
1. Clone or download this project.
2. Copy the `.env.example` file to a new file named `.env`:
   ```bash
   cp .env.example .env
   ```
3. Fill in your Firebase configuration values in the `.env` file.
4. Replace `user_1_uid` and `user_2_uid` with the actual UIDs of the two users you created in Step 3:
   ```env
   VITE_AUTHORIZED_UID_1=abc123def456
   VITE_AUTHORIZED_UID_2=xyz789uvw012
   ```

### 7. Deploy Firebase Security Rules

**Firestore Security Rules:**
Go to Firestore Database -> Rules and paste the contents of `firebase/firestore.rules`.

**Realtime Database Security Rules:**
Go to Realtime Database -> Rules and paste the contents of `firebase/database.rules.json`.

### 8. Run Locally
Install dependencies and run the development server:
```bash
npm install
npm run dev
```

### 9. Build for Production
To test the production build locally:
```bash
npm run build
npm run preview
```

## Vercel Deployment Instructions

1. Push your code to a GitHub/GitLab/Bitbucket repository.
2. Go to [Vercel](https://vercel.com/) and import the repository.
3. In the project configuration on Vercel, ensure the Framework Preset is set to **Vite**.
4. Expand the **Environment Variables** section.
5. Add all the environment variables from your local `.env` file:
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`
   - `VITE_FIREBASE_DATABASE_URL`
   - `VITE_AUTHORIZED_UID_1`
   - `VITE_AUTHORIZED_UID_2`
6. Click **Deploy**.

## Testing Scenarios Covered
- Real-time messaging with "Sent", "Delivered", and "Seen" status indicators.
- Online/Offline presence using Realtime Database.
- Mobile-first, responsive, minimal UI.
- Secure access restricted entirely to the two specified UIDs using Firebase Security Rules.
