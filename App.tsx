// App.tsx — Root entry point for the Instants news app
import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import LaunchScreen from './src/screens/LaunchScreen';
import AuthScreen   from './src/screens/AuthScreen';
import NewsFeedScreen from './src/screens/NewsFeedScreen';
import ArticleScreen  from './src/screens/ArticleScreen';
import SavedScreen    from './src/screens/SavedScreen';
import ProfileScreen  from './src/screens/ProfileScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import BottomTabs     from './src/navigation/BottomTabs';
import { COLORS } from './src/utils/theme';

type AppState = 'launch' | 'auth' | 'app';

const Stack = createNativeStackNavigator();

// ─── Main tab shell ──────────────────────────────────────────────────────────────
function MainApp({ onLogout }: { onLogout: () => void }) {
  const [activeTab, setActiveTab] = useState('Feed');

  // Screen registry for bottom-tab routing
  const renderScreen = (nav: any) => {
    switch (activeTab) {
      case 'Feed':    return <NewsFeedScreen navigation={nav} />;
      case 'Explore': return <NewsFeedScreen navigation={nav} />;
      case 'Saved':   return <SavedScreen navigation={nav} />;
      case 'Profile': return <ProfileScreen navigation={nav} onLogout={onLogout} />;
      default:        return <NewsFeedScreen navigation={nav} />;
    }
  };

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: 'slide_from_right' }}>
        <Stack.Screen name="Main">
          {({ navigation }) => (
            <View style={styles.shell}>
              <View style={{ flex: 1 }}>
                {renderScreen(navigation)}
              </View>
              <BottomTabs activeTab={activeTab} onTabPress={setActiveTab} />
            </View>
          )}
        </Stack.Screen>
        <Stack.Screen name="Feed">
          {({ navigation }) => <NewsFeedScreen navigation={navigation} />}
        </Stack.Screen>
        <Stack.Screen name="Article" component={ArticleScreen} />
        <Stack.Screen name="Saved"   component={SavedScreen} />
        <Stack.Screen name="Profile">
          {({ navigation }) => <ProfileScreen navigation={navigation} onLogout={onLogout} />}
        </Stack.Screen>
        <Stack.Screen name="Settings" component={SettingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ─── Root ────────────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState<AppState>('launch');

  return (
    <SafeAreaProvider>
      {state === 'launch' && <LaunchScreen onDone={() => setState('auth')} />}
      {state === 'auth'   && <AuthScreen onAuth={() => setState('app')} />}
      {state === 'app'    && <MainApp onLogout={() => setState('auth')} />}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  shell: { flex: 1, backgroundColor: COLORS.bg0 },
});
