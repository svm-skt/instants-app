// src/screens/SettingsScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native';
import Slider from '@react-native-community/slider';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../utils/theme';
import { useStore, Settings } from '../store/useStore';

type ToggleKey = 'autoTheme' | 'breakingAlerts' | 'dailyDigest' | 'personalisation';
type SegKey = 'readingFont' | 'lineSpacing';

const BG_OPTIONS: { key: Settings['readingBg']; color: string; label: string }[] = [
  { key:'dark',  color:'#0d0d0f', label:'Dark' },
  { key:'warm',  color:'#f5f0e8', label:'Warm' },
  { key:'cool',  color:'#e8f0f5', label:'Cool' },
  { key:'night', color:'#1a1a2e', label:'Night' },
];

export default function SettingsScreen({ navigation }: any) {
  const { settings, updateSetting } = useStore();

  const Toggle = ({ k }: { k: ToggleKey }) => {
    const on = settings[k] as boolean;
    return (
      <TouchableOpacity style={[s.tog, on && s.togOn]} onPress={() => updateSetting(k, !on as any)}>
        <View style={[s.togThumb, on && s.togThumbOn]} />
      </TouchableOpacity>
    );
  };

  const Seg = ({ k, opts }: { k: SegKey; opts: string[] }) => (
    <View style={s.seg}>
      {opts.map(o => (
        <TouchableOpacity key={o} style={[s.segOpt, settings[k]===o && s.segOptA]}
          onPress={() => updateSetting(k, o as any)}>
          <Text style={[s.segOptT, settings[k]===o && s.segOptTA]}>{o.charAt(0).toUpperCase()+o.slice(1)}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const Section = ({ title }: { title: string }) => (
    <Text style={s.sec}>{title}</Text>
  );

  const Row = ({ icon, label, sub, right }: { icon:string; label:string; sub?:string; right:React.ReactNode }) => (
    <View style={s.item}>
      <View style={s.itemL}>
        <View style={s.ico}><Text style={{ fontSize:14 }}>{icon}</Text></View>
        <View>
          <Text style={s.itemT}>{label}</Text>
          {sub && <Text style={s.itemS}>{sub}</Text>}
        </View>
      </View>
      {right}
    </View>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg0} />
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
            <Text style={{ color:COLORS.text3, fontSize:18 }}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerT}>App Settings</Text>
        </View>
        <ScrollView contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>

          <Section title="APPEARANCE" />
          <Row icon="🌙" label="Dark Mode" sub="Reduce eye strain"
            right={<Toggle k="autoTheme" />} />
          <Row icon="☀️" label="Auto (System)" sub="Follow device setting"
            right={<Toggle k="autoTheme" />} />

          <Section title="READING MODE" />
          <Row icon="🔤" label="Text Style"
            right={<Seg k="readingFont" opts={['sans','serif','mono']} />} />

          <View style={s.item}>
            <View style={s.itemL}>
              <View style={s.ico}><Text style={{ fontSize:14 }}>🔡</Text></View>
              <Text style={s.itemT}>Font Size</Text>
            </View>
            <View style={s.sliderWrap}>
              <Text style={s.sliderA}>A</Text>
              <Slider
                style={s.slider}
                minimumValue={12}
                maximumValue={22}
                step={1}
                value={settings.fontSize}
                onValueChange={v => updateSetting('fontSize', v)}
                minimumTrackTintColor={COLORS.gold}
                maximumTrackTintColor={COLORS.bg5}
                thumbTintColor={COLORS.gold}
              />
              <Text style={s.sliderB}>A</Text>
              <Text style={s.sliderV}>{settings.fontSize}</Text>
            </View>
          </View>

          <View style={[s.item, { flexWrap:'wrap', gap:10 }]}>
            <View style={s.itemL}>
              <View style={s.ico}><Text style={{ fontSize:14 }}>🎨</Text></View>
              <Text style={s.itemT}>Background</Text>
            </View>
            <View style={s.swatches}>
              {BG_OPTIONS.map(b => (
                <TouchableOpacity key={b.key}
                  style={[s.sw, { backgroundColor:b.color }, settings.readingBg===b.key && s.swA]}
                  onPress={() => updateSetting('readingBg', b.key)}>
                  {settings.readingBg===b.key && <View style={s.swCheck}/>}
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <Row icon="↕️" label="Line Spacing"
            right={<Seg k="lineSpacing" opts={['compact','normal','relaxed']} />} />

          <Section title="NOTIFICATIONS" />
          <Row icon="🚨" label="Breaking News" sub="Instant alerts"
            right={<Toggle k="breakingAlerts" />} />
          <Row icon="🌅" label="Daily Digest" sub="Morning briefing at 7 AM"
            right={<Toggle k="dailyDigest" />} />

          <Section title="PRIVACY" />
          <Row icon="📊" label="Personalisation" sub="Use reading data for suggestions"
            right={<Toggle k="personalisation" />} />
          <TouchableOpacity style={[s.item, { borderBottomWidth:0 }]}>
            <View style={s.itemL}>
              <View style={s.ico}><Text style={{ fontSize:14 }}>🗑️</Text></View>
              <Text style={[s.itemT, { color:'#e2503a' }]}>Clear Cache</Text>
            </View>
            <Text style={s.itemS}>24 MB</Text>
          </TouchableOpacity>

        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:COLORS.bg0},
  safe:{flex:1},
  header:{flexDirection:'row',alignItems:'center',gap:12,paddingHorizontal:SPACING.lg,
    paddingVertical:12,borderBottomWidth:0.5,borderBottomColor:COLORS.bg4},
  back:{width:34,height:34,backgroundColor:COLORS.bg3,borderRadius:RADIUS.md,alignItems:'center',justifyContent:'center'},
  headerT:{fontSize:17,fontWeight:'500',color:COLORS.text1},
  body:{padding:14,paddingBottom:40},
  sec:{fontSize:10,color:COLORS.text5,letterSpacing:1,textTransform:'uppercase',
    marginTop:20,marginBottom:4,marginLeft:2},
  item:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
    paddingVertical:13,borderBottomWidth:0.5,borderBottomColor:COLORS.bg2},
  itemL:{flexDirection:'row',alignItems:'center',gap:11,flex:1},
  ico:{width:32,height:32,backgroundColor:COLORS.bg3,borderRadius:9,alignItems:'center',justifyContent:'center'},
  itemT:{fontSize:13,color:COLORS.text2},
  itemS:{fontSize:11,color:COLORS.text5,marginTop:1},
  tog:{width:40,height:22,backgroundColor:COLORS.bg5,borderRadius:11,
    justifyContent:'center',paddingHorizontal:3},
  togOn:{backgroundColor:COLORS.gold},
  togThumb:{width:16,height:16,borderRadius:8,backgroundColor:'#fff'},
  togThumbOn:{alignSelf:'flex-end'},
  seg:{flexDirection:'row',backgroundColor:COLORS.bg3,borderRadius:8,padding:3,gap:2},
  segOpt:{paddingHorizontal:9,paddingVertical:4,borderRadius:6},
  segOptA:{backgroundColor:COLORS.gold},
  segOptT:{fontSize:11,color:COLORS.text4},
  segOptTA:{color:COLORS.bg0,fontWeight:'500'},
  sliderWrap:{flexDirection:'row',alignItems:'center',gap:4,flex:1,marginLeft:8},
  slider:{flex:1,height:20},
  sliderA:{fontSize:10,color:COLORS.text5},
  sliderB:{fontSize:14,color:COLORS.text4},
  sliderV:{fontSize:12,color:COLORS.gold,minWidth:22,textAlign:'right'},
  swatches:{flexDirection:'row',gap:8,marginLeft:'auto'},
  sw:{width:28,height:28,borderRadius:8,borderWidth:2,borderColor:'transparent',
    alignItems:'center',justifyContent:'center'},
  swA:{borderColor:COLORS.gold},
  swCheck:{width:10,height:10,borderRadius:5,backgroundColor:COLORS.gold},
});
