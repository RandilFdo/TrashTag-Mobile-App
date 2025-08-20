# 📱 TrashTag Lanka – App Concept & UI Flow

## Overview

**TrashTag Lanka** is a mobile app designed to make environmental cleanup **fun, shareable, and rewarding**. Inspired by the **visual interactivity of Snapchat** and the **social, feed-driven experience of Instagram**, the app leverages **gamification** and **social good** to drive real-world impact.

**Key Goals:**
- Deliver a **high-quality, intuitive UI** with smooth animations and responsiveness.
- Ensure **robust security and verification** for accounts and content.
- Enable **seamless sharing** to Instagram, TikTok, and other social platforms.
- Build a **scalable architecture** for future features like AI trash classification and large-scale community events.

---

## 🎯 Core Features

1. **Before/After Camera Mode**  
   Capture and compare cleanup transformations.
2. **Geo-tagged Cleanup Map**  
   Explore cleanups across Sri Lanka.
3. **Challenge Board**  
   Participate in weekly challenges and earn rewards.
4. **Leaderboard & Crew Mode**  
   Compete solo or as part of a team.
5. **Social Media Sharing**  
   Instantly generate TikTok/Reels/Instagram-friendly posts with stats.

---

## 🛡 Security & Verification

- **Secure Sign-up/Login:** OAuth via Google, Facebook, Apple ID, or verified email.
- **Two-Factor Authentication (2FA):** Optional for enhanced security.
- **Content Moderation:** AI-assisted and human review to prevent inappropriate or fake posts.
- **Location Verification:** Accurate, tamper-proof cleanup location data.
- **Privacy Controls:** Users can hide exact locations or display only general areas.

## Tech Stack:
Frontend: React Native with TypeScript, Expo, and Expo Router
Backend/Database: Supabase
UI Framework: React Native Paper

## 📱 UI Flow

### 1. Onboarding

- **Splash Screen:** App logo and tagline (*Clean it. Snap it. Trend it.*)
- **Intro Slides:**
  1. Snap the mess (before photo)
  2. Clean it up (after photo)
  3. Post & inspire (share + earn rewards)
- **Sign Up / Login:**
  - Google / Facebook / Apple ID / Phone number
  - Request: Name, Profile Pic, City
  - Optional: Join/Create Crew

---

### 2. Home Screen (Feed)

- **Top Bar:**
  - Current Rank
  - Total Trash Collected
  - “+” Button → New Cleanup Post
- **Main Feed:**
  - Before/After Cards
  - Likes & Comments
  - Filters: Nearby / Trending / My Crew / Challenges
- **Floating Action Button (FAB):** Camera shortcut

---

### 3. New Cleanup Flow

1. Select Mode: Solo / Crew / Challenge
2. Camera (Before Shot) – Optional AI waste detection
3. Cleanup Confirmation: Timer/checklist for “After” stage
4. Camera (After Shot)
5. Post Details:
   - Caption (auto-suggested)
   - Tag Crew
   - Add Location
   - Select Hashtags
6. Post Preview → Share to app feed & external socials (Instagram, TikTok, etc.)

---

### 4. Map View

- **Interactive Map:**
  - Green markers: Cleaned spots
  - Yellow markers: Needs attention
- **Tap Marker:** View before/after photos, cleaner info, and stats
- **Filters:** This week / This month / All time

---

### 5. Challenge Board

- Current weekly challenges & prizes
- “Join” → Camera with challenge tag auto-applied
- Archive of past challenges & winners

---

### 6. Leaderboard

- Tabs: All Users / Crews / My City / My Friends
- Tap profile to view cleanup history & stats

---

### 7. Profile Page

- Avatar, bio, crew name, total trash collected
- Badges earned
- Cleanup gallery grid (before/after)
- Stats: Cleanups, weight removed, streak count

---

### 8. Rewards & Sponsors

- Available rewards (vouchers, merch, mobile data packs)
- Point thresholds for earning
- Sponsor highlight section

---

### 9. Notifications

- Likes & comments
- Challenge reminders
- Reward unlock alerts
- Crew updates

---

### 10. Settings

- Account info
- Privacy controls
- Language preference (Sinhala / Tamil / English)
- Help & support

---

## 🔗 Social Media Integration

- Auto-export cleanup posts in vertical video format (Reels/TikTok-friendly)
- Share buttons for Instagram, TikTok, Facebook, and Twitter/X
- Hashtag auto-generation (e.g., `#TrashTagLKA #CleanSriLanka`)
- Option to link accounts for auto-posting

---

## 📌 Developer Notes

- **Platform:** Mobile-first (iOS & Android), with future web support
- **Tech Stack Suggestion:** Flutter/React Native for cross-platform, Firebase for backend/auth, Google Maps API for geo-features
- **Performance:** Prioritize image/video compression for fast uploads without quality loss
- **Security:** End-to-end encryption for private messages, encrypted location data

---

## 🗄️ Database Schema & Folder Structure

### Database Schema (Supabase/Postgres)

#### users
- id (UUID, PK)
- name (string)
- email (string, unique)
- profile_pic_url (string)
- city (string)
- bio (string, optional)
- created_at (timestamp)
- updated_at (timestamp)
- oauth_provider (enum: google, facebook, apple, email, phone)
- crew_id (UUID, FK to crews, nullable)
- is_private (boolean)

#### crews
- id (UUID, PK)
- name (string, unique)
- description (string)
- avatar_url (string)
- created_by (UUID, FK to users)
- created_at (timestamp)

#### crew_members
- id (UUID, PK)
- crew_id (UUID, FK to crews)
- user_id (UUID, FK to users)
- role (enum: member, admin, owner)
- joined_at (timestamp)

#### cleanups
- id (UUID, PK)
- user_id (UUID, FK to users)
- crew_id (UUID, FK to crews, nullable)
- challenge_id (UUID, FK to challenges, nullable)
- before_photo_url (string)
- after_photo_url (string)
- caption (string)
- location (geopoint)
- city (string)
- hashtags (string[])
- trash_weight_kg (float)
- created_at (timestamp)
- verified (boolean)
- ai_detected (boolean)

#### cleanup_likes
- id (UUID, PK)
- cleanup_id (UUID, FK to cleanups)
- user_id (UUID, FK to users)
- created_at (timestamp)

#### cleanup_comments
- id (UUID, PK)
- cleanup_id (UUID, FK to cleanups)
- user_id (UUID, FK to users)
- comment (string)
- created_at (timestamp)

#### challenges
- id (UUID, PK)
- title (string)
- description (string)
- start_date (date)
- end_date (date)
- prize (string)
- created_at (timestamp)
- is_active (boolean)

#### challenge_participants
- id (UUID, PK)
- challenge_id (UUID, FK to challenges)
- user_id (UUID, FK to users)
- joined_at (timestamp)

#### leaderboard_entries
- id (UUID, PK)
- user_id (UUID, FK to users)
- crew_id (UUID, FK to crews, nullable)
- city (string)
- points (int)
- rank (int)
- period (enum: all_time, month, week)
- updated_at (timestamp)

#### rewards
- id (UUID, PK)
- title (string)
- description (string)
- image_url (string)
- points_required (int)
- sponsor_id (UUID, FK to sponsors, nullable)
- created_at (timestamp)

#### user_rewards
- id (UUID, PK)
- user_id (UUID, FK to users)
- reward_id (UUID, FK to rewards)
- claimed_at (timestamp)

#### sponsors
- id (UUID, PK)
- name (string)
- logo_url (string)
- description (string)
- website (string)

#### notifications
- id (UUID, PK)
- user_id (UUID, FK to users)
- type (enum: like, comment, challenge, reward, crew_update)
- data (jsonb)
- is_read (boolean)
- created_at (timestamp)

#### social_links
- id (UUID, PK)
- user_id (UUID, FK to users)
- provider (enum: instagram, tiktok, facebook, twitter)
- handle (string)
- linked_at (timestamp)

#### badges
- id (UUID, PK)
- name (string)
- description (string)
- icon_url (string)

#### user_badges
- id (UUID, PK)
- user_id (UUID, FK to users)
- badge_id (UUID, FK to badges)
- awarded_at (timestamp)

---

### 📁 Optimal Folder Structure (React Native + Supabase)

```
TrashTag/
├── app/                # React Native app source (screens, navigation, hooks, context)
│   ├── components/     # Reusable UI components
│   ├── screens/        # App screens (Feed, Map, Profile, etc.)
│   ├── navigation/     # Navigation config
│   ├── hooks/          # Custom React hooks
│   ├── context/        # React context providers
│   ├── assets/         # Images, icons, fonts
│   └── utils/          # Utility functions
├── backend/            # (Optional) Edge functions, serverless, or API helpers
│   ├── supabase/       # Supabase client, types, and queries
│   └── functions/      # Custom backend logic (if any)
├── docs/               # Documentation
├── scripts/            # Dev scripts, seeders, migrations
├── .env                # Environment variables
├── app.json            # Expo config
├── package.json        # Project manifest
└── README.md           # Project overview
```

> **Note:** For monorepo or web support, add `web/` and `shared/` folders as needed.

---

## 🚀 Step-by-Step Development Plan

This section outlines the recommended step-by-step process for building the TrashTag Lanka app. Each step should be completed and tested before moving to the next. Document progress and decisions as you go.

### 1. Project Setup & Initialization (Detailed)

**Checklist:**

1. **Initialize Expo Project**
   - Run:
     ```sh
     npx create-expo-app@latest TrashTag -e with-router
     ```
   - Change directory:
     ```sh
     cd TrashTag
     ```

2. **Set Up Folder Structure**
   - Organize folders as described in the 'Optimal Folder Structure' section above.
   - Create empty directories for `app/components`, `app/screens`, `app/navigation`, etc.

3. **Install Core Dependencies**
   - Run:
     ```sh
     npm install react-native-paper @supabase/supabase-js expo-router
     ```
   - (Optional) Install other useful packages:
     ```sh
     npm install react-native-dotenv expo-image-picker expo-location
     ```

4. **Configure TypeScript**
   - If not already set up, rename files to `.tsx` and ensure `tsconfig.json` exists.
   - Run:
     ```sh
     npx tsc --init
     ```

5. **Set Up Environment Variables**
   - Create a `.env` file for Supabase keys and other secrets.
   - Add `.env` to `.gitignore`.

6. **Initialize Git & Add README**
   - Run:
     ```sh
     git init
     echo "# TrashTag Lanka" > README.md
     git add .
     git commit -m "Initial project setup"
     ```

7. **Test the App**
   - Start the development server:
     ```sh
     npx expo start
     ```
   - Ensure the app runs on both iOS and Android simulators/devices.

---

*Mark this step as complete in the docs when all items are done. Only then proceed to Step 2: Authentication & User Onboarding.*

### 2. Authentication & User Onboarding (Detailed)

**Checklist:**

1. **Set Up Supabase Project**
   - Go to https://supabase.com/ and create a new project.
   - Note your Supabase URL and anon/public API key.
   - In the Supabase dashboard, enable authentication providers: Google, Facebook, Apple, Email, Phone (as needed).

2. **Install Supabase Client**
   - If not already installed:
     ```sh
     npm install @supabase/supabase-js
     ```
   - Create a file (e.g., `backend/supabase/client.ts`) to initialize the Supabase client:
     ```ts
     import { createClient } from '@supabase/supabase-js';
     import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env';
     export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
     ```

3. **Configure Environment Variables**
   - Add your Supabase URL and anon key to `.env`:
     ```env
     SUPABASE_URL=your-supabase-url
     SUPABASE_ANON_KEY=your-anon-key
     ```
   - Use `react-native-dotenv` or similar to load env variables.

4. **Implement Auth Flow**
   - Create onboarding screens:
     - Splash screen
     - Intro slides
     - Sign up / Login (with OAuth and email/phone)
     - Profile setup (name, profile pic, city, optional crew)
   - Use Supabase Auth methods for sign-in/sign-up:
     - `signInWithOAuth({ provider: 'google' })`
     - `signInWithOtp({ email })`
     - etc.
   - Handle auth state (signed in/out) and navigation accordingly.

5. **Store User Profile Data**
   - On first sign-up, collect and store user info in the `users` table (see schema above).
   - Use Supabase client to insert/update user data.

6. **Protect Routes & Navigation**
   - Ensure only authenticated users can access main app screens.
   - Redirect unauthenticated users to onboarding/login.
   - Use context or state management for auth state.

7. **Test Authentication**
   - Test sign-up and login with all enabled providers.
   - Test onboarding flow and profile creation.
   - Test navigation and route protection.

*Mark this step as complete in the docs when all items are done. Only then proceed to Step 3: Home Feed & Main Navigation.*

> **Continue adding steps here as you build each feature (Feed, Cleanup Flow, Map, Challenges, Leaderboard, etc.). Only move to the next step after the current one is complete and tested.**