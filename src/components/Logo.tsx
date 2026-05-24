// src/components/Logo.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

interface LogoProps { size?: 'sm' | 'md' | 'lg'; showWordmark?: boolean; showTagline?: boolean; }

const CFG = {
  sm:  { box: 26, r: 7,  b1:{l:4,t:5,w:4,h:16,r:2},  b2:{l:11,t:5,w:4,h:11,r:2},  b3:{l:18,t:5,w:4,h:13,r:2},  fs:11 },
  md:  { box: 42, r: 12, b1:{l:7,t:8,w:6,h:26,r:3},   b2:{l:18,t:8,w:6,h:17,r:3},  b3:{l:29,t:8,w:6,h:21,r:3},  fs:16 },
  lg:  { box: 72, r: 20, b1:{l:12,t:13,w:10,h:46,r:5}, b2:{l:30,t:13,w:10,h:29,r:5}, b3:{l:48,t:13,w:10,h:36,r:5}, fs:26 },
};

export default function Logo({ size = 'md', showWordmark = true, showTagline = false }: LogoProps) {
  const c = CFG[size];
  return (
    <View style={s.wrap}>
      <View style={[s.box, { width: c.box, height: c.box, borderRadius: c.r }]}>
        {(['b1','b2','b3'] as const).map(k => (
          <View key={k} style={[s.bar, { left: c[k].l, top: c[k].t, width: c[k].w, height: c[k].h, borderRadius: c[k].r }]} />
        ))}
      </View>
      {showWordmark && <Text style={[s.wm, { fontSize: c.fs }]}>INSTANTS</Text>}
      {showTagline && <Text style={s.tl}>News. Now.</Text>}
    </View>
  );
}

const s = StyleSheet.create({
  wrap: { alignItems: 'center', gap: 8 },
  box: { backgroundColor: COLORS.gold, position: 'relative', overflow: 'hidden' },
  bar: { position: 'absolute', backgroundColor: '#0d0d0f' },
  wm: { color: COLORS.text1, fontWeight: '500', letterSpacing: 4 },
  tl: { color: COLORS.text4, fontSize: 11, letterSpacing: 3, textTransform: 'uppercase' },
});
