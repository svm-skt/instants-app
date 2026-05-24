// src/screens/LaunchScreen.tsx
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, StatusBar } from 'react-native';
import { COLORS } from '../utils/theme';
import { useStore } from '../store/useStore';
import Logo from '../components/Logo';

export default function LaunchScreen({ onDone }: { onDone: () => void }) {
  const scale = useRef(new Animated.Value(4)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const { loadSaved } = useStore();

  useEffect(() => {
    loadSaved();
    Animated.parallel([
      Animated.timing(opacity, { toValue: 1, duration: 400, useNativeDriver: true }),
      Animated.spring(scale, { toValue: 1, tension: 40, friction: 8, useNativeDriver: true }),
    ]).start();
    const t = setTimeout(onDone, 2400);
    return () => clearTimeout(t);
  }, []);

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg0} />
      <Animated.View style={{ transform: [{ scale }], opacity }}>
        <Logo size="lg" showWordmark showTagline />
      </Animated.View>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.bg0, alignItems: 'center', justifyContent: 'center' },
});
