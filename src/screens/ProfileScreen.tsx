// src/screens/ProfileScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../utils/theme';

const ROWS = [
  { icon:'⚙️', label:'App Settings', sub:'Display, reading, privacy', screen:'Settings', danger:false },
  { icon:'🔔', label:'Notifications', sub:'Breaking alerts, digests', screen:null, danger:false },
  { icon:'📰', label:'Following', sub:'12 sources', screen:null, danger:false },
  { icon:'🛡️', label:'Privacy', sub:'Data & permissions', screen:null, danger:false },
  { icon:'❓', label:'Help & Feedback', sub:'', screen:null, danger:false },
  { icon:'🚪', label:'Log Out', sub:'', screen:'logout', danger:true },
];

export default function ProfileScreen({ navigation, onLogout }: any) {
  const handleRow = (row: typeof ROWS[0]) => {
    if (row.screen === 'logout') {
      Alert.alert('Log Out', 'Are you sure?', [
        { text:'Cancel', style:'cancel' },
        { text:'Log Out', style:'destructive', onPress: () => onLogout?.() },
      ]);
    } else if (row.screen) {
      navigation.navigate(row.screen);
    }
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg0} />
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <Text style={s.headerT}>Profile</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={s.avatar}><Text style={s.avatarT}>SV</Text></View>
          <Text style={s.name}>Shivam</Text>
          <Text style={s.email}>shivam@example.com</Text>

          <View style={s.statsRow}>
            {[['Saved','2'],['Following','12'],['Days','7']].map(([l,v]) => (
              <View key={l} style={s.stat}>
                <Text style={s.statV}>{v}</Text>
                <Text style={s.statL}>{l}</Text>
              </View>
            ))}
          </View>

          <View style={s.list}>
            {ROWS.map(row => (
              <TouchableOpacity key={row.label} style={s.row} onPress={() => handleRow(row)} activeOpacity={0.75}>
                <View style={[s.rowIco, row.danger && s.rowIcoDanger]}>
                  <Text style={{ fontSize:15 }}>{row.icon}</Text>
                </View>
                <View style={s.rowContent}>
                  <Text style={[s.rowLabel, row.danger && s.rowLabelDanger]}>{row.label}</Text>
                  {!!row.sub && <Text style={s.rowSub}>{row.sub}</Text>}
                </View>
                {!row.danger && <Text style={s.arrow}>›</Text>}
              </TouchableOpacity>
            ))}
          </View>
          <Text style={s.version}>Instants v1.0.0</Text>
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:COLORS.bg0},
  safe:{flex:1},
  header:{paddingHorizontal:SPACING.lg,paddingVertical:12,borderBottomWidth:0.5,borderBottomColor:COLORS.bg4},
  headerT:{fontSize:18,fontWeight:'500',color:COLORS.text1},
  avatar:{width:68,height:68,borderRadius:34,backgroundColor:COLORS.gold,alignItems:'center',
    justifyContent:'center',alignSelf:'center',marginTop:20,marginBottom:8},
  avatarT:{fontSize:22,fontWeight:'500',color:COLORS.bg0},
  name:{textAlign:'center',fontSize:17,fontWeight:'500',color:COLORS.text1,marginBottom:4},
  email:{textAlign:'center',fontSize:12,color:COLORS.text5,marginBottom:16},
  statsRow:{flexDirection:'row',justifyContent:'center',gap:32,marginBottom:20,
    paddingVertical:16,marginHorizontal:16,backgroundColor:COLORS.bg2,borderRadius:RADIUS.lg},
  stat:{alignItems:'center'},
  statV:{fontSize:18,fontWeight:'600',color:COLORS.gold},
  statL:{fontSize:11,color:COLORS.text5,marginTop:2},
  list:{paddingHorizontal:14,gap:2},
  row:{flexDirection:'row',alignItems:'center',gap:12,paddingVertical:13,
    borderBottomWidth:0.5,borderBottomColor:COLORS.bg2},
  rowIco:{width:34,height:34,backgroundColor:COLORS.bg3,borderRadius:10,alignItems:'center',justifyContent:'center'},
  rowIcoDanger:{backgroundColor:'#e2503a18'},
  rowContent:{flex:1},
  rowLabel:{fontSize:13,color:COLORS.text2},
  rowLabelDanger:{color:'#e2503a'},
  rowSub:{fontSize:11,color:COLORS.text5,marginTop:1},
  arrow:{color:COLORS.text5,fontSize:18},
  version:{textAlign:'center',fontSize:11,color:COLORS.text5,marginTop:20,marginBottom:32},
});
