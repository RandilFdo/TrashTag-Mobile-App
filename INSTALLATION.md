# 🚀 TrashTag Lanka - Complete Installation Guide

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **npm** or **yarn**
- **Expo CLI** (`npm install -g @expo/cli`)
- **Git**
- **Supabase Account** (for backend)

## 🛠️ Installation Steps

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd TrashTag
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Install Additional Required Modules
```bash
npx expo install expo-file-system expo-image-picker
```

### 4. Environment Setup

Create a `.env` file in the root directory:
```env
EXPO_PUBLIC_SUPABASE_URL=your_supabase_url
EXPO_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 5. Supabase Database Setup

#### Create the following tables in your Supabase database:

**1. profiles table:**
```sql
CREATE TABLE profiles (
  id UUID REFERENCES auth.users(id) PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  city TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**2. posts table:**
```sql
CREATE TABLE posts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT NOT NULL,
  location TEXT NOT NULL,
  hashtags TEXT[] DEFAULT '{}',
  is_before_photo BOOLEAN DEFAULT false,
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**3. post_likes table:**
```sql
CREATE TABLE post_likes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(post_id, user_id)
);
```

**4. comments table:**
```sql
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

#### Set up Row Level Security (RLS):
```sql
-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE post_likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Posts policies
CREATE POLICY "Users can view all posts" ON posts FOR SELECT USING (true);
CREATE POLICY "Users can insert own posts" ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own posts" ON posts FOR UPDATE USING (auth.uid() = user_id);

-- Post likes policies
CREATE POLICY "Users can view all likes" ON post_likes FOR SELECT USING (true);
CREATE POLICY "Users can insert own likes" ON post_likes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own likes" ON post_likes FOR DELETE USING (auth.uid() = user_id);

-- Comments policies
CREATE POLICY "Users can view all comments" ON comments FOR SELECT USING (true);
CREATE POLICY "Users can insert own comments" ON comments FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own comments" ON comments FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own comments" ON comments FOR DELETE USING (auth.uid() = user_id);
```

### 6. Supabase Storage Setup

Create a storage bucket called `post-images` with the following policy:
```sql
CREATE POLICY "Images are publicly accessible" ON storage.objects FOR SELECT USING (bucket_id = 'post-images');
CREATE POLICY "Users can upload images" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'post-images' AND auth.uid()::text = (storage.foldername(name))[1]);
```

### 7. Run the Application

```bash
# Start the development server
npm start

# Or run on specific platform
npm run android
npm run ios
npm run web
```

## 📱 Features Now Fully Functional

### ✅ **Camera & Photos**
- Take photos with device camera
- Select photos from gallery
- Before/After photo modes
- Flash control and camera flip
- Photo preview and retake functionality

### ✅ **Post Creation**
- Upload photos to Supabase storage
- Add captions, locations, and hashtags
- Real-time database saving
- Location auto-detection

### ✅ **Social Feed**
- View all cleanup posts
- Like/unlike posts (real-time counter)
- Comment on posts
- Share posts to external apps
- Pull-to-refresh functionality

### ✅ **Comments System**
- View comments on posts
- Add new comments
- Real-time comment count updates
- User avatars and timestamps

### ✅ **Interactive Map**
- View cleanup locations on map
- Filter by location type (beach, park, street, forest)
- Toggle between map and list view
- Location statistics
- Error handling with fallback data

### ✅ **User Authentication**
- Email/password login
- Profile creation and management
- Secure data access with RLS

## 🔧 Troubleshooting

### Common Issues:

**1. Camera permissions not working:**
- Ensure you've granted camera permissions in device settings
- For iOS, add camera usage description in `app.json`

**2. Location not working:**
- Grant location permissions when prompted
- Check device location settings

**3. Image upload failing:**
- Verify Supabase storage bucket is created
- Check storage policies are set correctly
- Ensure environment variables are set

**4. Database connection issues:**
- Verify Supabase URL and anon key in `.env`
- Check if all tables and policies are created
- Ensure RLS is enabled on all tables

### Platform-Specific Setup:

**iOS:**
- Add camera and location usage descriptions in `app.json`
- Run `npx expo run:ios` for native build

**Android:**
- Add permissions in `app.json`
- Run `npx expo run:android` for native build

**Web:**
- Some features may be limited (camera, location)
- Use `npm run web` for web version

## 🎯 Next Steps

1. **Test all features** on your device
2. **Customize the UI** to match your brand
3. **Add more features** like challenges, rewards, etc.
4. **Deploy to app stores** using EAS Build

## 📞 Support

If you encounter any issues:
1. Check the troubleshooting section above
2. Review the Supabase documentation
3. Check Expo documentation for platform-specific issues
4. Create an issue in the repository

---

**🎉 Congratulations! Your TrashTag Lanka app is now fully functional!**
