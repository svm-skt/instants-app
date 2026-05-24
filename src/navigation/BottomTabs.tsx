// src/navigation/BottomTabs.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { COLORS } from '../utils/theme';

const TABS = [
  { id:'Feed',    icon:'🏠', label:'Home' },
  { id:'Explore', icon:'🧭', label:'Explore' },
  { id:'Saved',   icon:'🔖', label:'Saved' },
  { id:'Profile', icon:'👤', label:'Profile' },
];

interface Props { activeTab: string; onTabPress: (tab: string) => void; }

export default function BottomTabs({ activeTab, onTabPress }: Props) {
  return (
    <View style={s.nav}>
      {TABS.map(t => (
        <TouchableOpacity key={t.id} style={s.tab} onPress={() => onTabPress(t.id)}>
          <Text style={{ fontSize:19 }}>{t.icon}</Text>
          <Text style={[s.label, activeTab===t.id && s.labelA]}>{t.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const s = StyleSheet.create({
  nav:{flexDirection:'row',borderTopWidth:0.5,borderTopColor:COLORS.bg4,
    backgroundColor:COLORS.bg0,paddingBottom:18,paddingTop:10},
  tab:{flex:1,alignItems:'center',gap:3},
  label:{fontSize:9,color:COLORS.text5,letterSpacing:0.3},
  labelA:{color:COLORS.gold},
});
