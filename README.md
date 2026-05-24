# Instants — News App

A beautiful, dark-aesthetic React Native news app for Android (and iOS).

---

## 📱 Screens

| Screen | Description |
|--------|-------------|
| Launch | Zoom-out logo animation (2s) |
| Sign Up / Log In | Email + social auth |
| News Feed | Live news with images, category chips, feature card, save button |
| Article Detail | Hero image, reading mode, long-press → Copy / Share / AI Infographic |
| Saved | Bookmarked articles |
| Profile | Stats + settings entry |
| App Settings | Dark mode, reading font, font size, bg colour, line spacing, notifications |

---

## 🔑 API Keys Required

### 1. GNews API (Primary news source)
- Sign up free at **https://gnews.io**
- Free tier: **100 requests/day**, includes article images
- Add your key in `src/services/newsService.ts`:
  ```ts
  export const GNEWS_API_KEY = 'your_key_here';
  ```

### 2. NewsData.io (Fallback / secondary source)
- Sign up free at **https://newsdata.io**
- Free tier: **200 requests/day**, includes article images
- Add your key in `src/services/newsService.ts`:
  ```ts
  export const NEWSDATA_API_KEY = 'your_key_here';
  ```

### 3. OpenAI API (AI Infographic generation — optional)
- Sign up at **https://platform.openai.com**
- Uses DALL-E 3 to generate branded infographics from selected article text
- Add your key in `src/services/infographicService.ts`:
  ```ts
  const OPENAI_API_KEY = 'your_key_here';
  ```

---

## 🚀 Setup & Run

### Prerequisites
- Node.js 18+
- React Native CLI
- Android Studio + Android SDK (API 33+)
- A physical Android device or AVD (emulator)

### 1. Install dependencies
```bash
npm install
```

### 2. Link native modules
```bash
npx react-native link react-native-vector-icons
```

### 3. Run on Android
```bash
# Start Metro bundler
npm start

# In another terminal:
npm run android
```

---

## 🏗️ Build Release APK

```bash
cd android
./gradlew assembleRelease
```

APK will be at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### Sign the APK (for Play Store)

1. Generate a keystore:
   ```bash
   keytool -genkey -v -keystore instants-release.keystore \
     -alias instants -keyalg RSA -keysize 2048 -validity 10000
   ```

2. Add to `android/app/build.gradle`:
   ```groovy
   signingConfigs {
     release {
       storeFile file('../../instants-release.keystore')
       storePassword 'YOUR_STORE_PASSWORD'
       keyAlias 'instants'
       keyPassword 'YOUR_KEY_PASSWORD'
     }
   }
   ```

3. Rebuild:
   ```bash
   ./gradlew assembleRelease
   ```

---

## 📤 Push to GitHub

```bash
cd /path/to/instants-app

git init
git add .
git commit -m "feat: initial Instants news app"

# Create a repo on github.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/instants-app.git
git branch -M main
git push -u origin main
```

---

## 🗂️ Project Structure

```
instants-app/
├── App.tsx                        # Root with launch → auth → app flow
├── android/                       # Android native project
├── src/
│   ├── screens/
│   │   ├── LaunchScreen.tsx       # Zoom-out splash animation
│   │   ├── AuthScreen.tsx         # Sign Up / Log In
│   │   ├── NewsFeedScreen.tsx     # Feed + hamburger drawer
│   │   ├── ArticleScreen.tsx      # Detail + text selection + infographic
│   │   ├── SavedScreen.tsx        # Bookmarked articles
│   │   ├── ProfileScreen.tsx      # User profile
│   │   └── SettingsScreen.tsx     # App settings
│   ├── components/
│   │   └── Logo.tsx               # Instants logomark component
│   ├── navigation/
│   │   └── BottomTabs.tsx         # Bottom nav bar
│   ├── store/
│   │   └── useStore.ts            # Zustand global state
│   ├── services/
│   │   ├── newsService.ts         # GNews + NewsData.io API
│   │   └── infographicService.ts  # OpenAI DALL-E 3 infographics
│   └── utils/
│       └── theme.ts               # Design tokens (colours, spacing, radius)
└── README.md
```

---

## 🎨 Design

- **Palette**: Deep black (#0d0d0f) · Warm gold (#c8a96e) · Off-white (#e8e6e0)
- **Typography**: System sans / Georgia serif / Courier mono (user-selectable)
- **Images**: Real article images from APIs; Unsplash curated fallbacks per category
- **Infographics**: DALL-E 3 generates square branded visuals from selected text

---

## 📦 Key Dependencies

| Package | Purpose |
|---------|---------|
| `@react-navigation/native-stack` | Screen navigation |
| `@react-navigation/bottom-tabs` | Bottom tab bar |
| `zustand` | Global state management |
| `@react-native-async-storage/async-storage` | Persist saved articles & settings |
| `@react-native-community/slider` | Font size slider in settings |
| `react-native-safe-area-context` | Safe area insets |

---

## 🔒 .gitignore additions

Add to `.gitignore` before pushing (to protect API keys):
```
# API keys — never commit these
src/services/newsService.ts
src/services/infographicService.ts
```

Instead, create `newsService.example.ts` with placeholder keys and document in README.
