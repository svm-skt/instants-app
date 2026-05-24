// src/screens/AuthScreen.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet,
  ScrollView, StatusBar, KeyboardAvoidingView, Platform } from 'react-native';
import { COLORS, RADIUS, SPACING } from '../utils/theme';
import Logo from '../components/Logo';

export default function AuthScreen({ onAuth }: { onAuth: () => void }) {
  const [tab, setTab] = useState<'signup'|'login'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');

  const fields = tab === 'signup'
    ? [{ label:'Full Name', val:name, set:setName, ph:'Your name', kbt:'default' as const, cap:'words' as const, sec:false },
       { label:'Email', val:email, set:setEmail, ph:'you@example.com', kbt:'email-address' as const, cap:'none' as const, sec:false },
       { label:'Password', val:pass, set:setPass, ph:'••••••••', kbt:'default' as const, cap:'none' as const, sec:true }]
    : [{ label:'Email', val:email, set:setEmail, ph:'you@example.com', kbt:'email-address' as const, cap:'none' as const, sec:false },
       { label:'Password', val:pass, set:setPass, ph:'••••••••', kbt:'default' as const, cap:'none' as const, sec:true }];

  return (
    <KeyboardAvoidingView style={s.root} behavior={Platform.OS==='ios'?'padding':undefined}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg0} />
      <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">
        <View style={s.logoWrap}><Logo size="md" showWordmark /></View>
        <View style={s.tabs}>
          {(['signup','login'] as const).map(t => (
            <TouchableOpacity key={t} style={[s.tab, tab===t && s.tabA]} onPress={() => setTab(t)}>
              <Text style={[s.tabT, tab===t && s.tabTA]}>{t==='signup'?'Sign Up':'Log In'}</Text>
            </TouchableOpacity>
          ))}
        </View>
        {fields.map(f => (
          <View key={f.label} style={s.field}>
            <Text style={s.label}>{f.label}</Text>
            <TextInput style={s.input} placeholder={f.ph} placeholderTextColor={COLORS.text5}
              value={f.val} onChangeText={f.set} keyboardType={f.kbt}
              autoCapitalize={f.cap} secureTextEntry={f.sec} />
          </View>
        ))}
        <TouchableOpacity style={s.cta} onPress={onAuth} activeOpacity={0.85}>
          <Text style={s.ctaT}>{tab==='signup'?'Create Account':'Log In'}</Text>
        </TouchableOpacity>
        <View style={s.divRow}>
          <View style={s.divLine}/><Text style={s.divT}>or continue with</Text><View style={s.divLine}/>
        </View>
        <View style={s.socialRow}>
          {['G  Google','  Apple'].map(l => (
            <TouchableOpacity key={l} style={s.socialBtn} onPress={onAuth}>
              <Text style={s.socialT}>{l}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={s.footer}>By continuing you agree to our{'\n'}Terms of Service & Privacy Policy</Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:COLORS.bg0},
  scroll:{flexGrow:1,padding:SPACING.xl,paddingTop:56},
  logoWrap:{alignItems:'center',marginBottom:SPACING.xl},
  tabs:{flexDirection:'row',backgroundColor:COLORS.bg3,borderRadius:RADIUS.lg,padding:4,marginBottom:SPACING.lg},
  tab:{flex:1,paddingVertical:10,alignItems:'center',borderRadius:RADIUS.md},
  tabA:{backgroundColor:COLORS.gold},
  tabT:{fontSize:13,color:COLORS.text4},
  tabTA:{color:COLORS.bg0,fontWeight:'500'},
  field:{marginBottom:SPACING.md},
  label:{fontSize:10,color:COLORS.text4,letterSpacing:1,textTransform:'uppercase',marginBottom:5},
  input:{backgroundColor:COLORS.bg3,borderWidth:0.5,borderColor:COLORS.bg5,borderRadius:RADIUS.md,
    paddingHorizontal:SPACING.md,paddingVertical:12,fontSize:13,color:COLORS.text1},
  cta:{backgroundColor:COLORS.gold,borderRadius:RADIUS.md,paddingVertical:14,alignItems:'center',marginTop:SPACING.sm,marginBottom:SPACING.lg},
  ctaT:{fontSize:14,fontWeight:'500',color:COLORS.bg0,letterSpacing:0.5},
  divRow:{flexDirection:'row',alignItems:'center',marginBottom:SPACING.md},
  divLine:{flex:1,height:0.5,backgroundColor:COLORS.bg4},
  divT:{fontSize:11,color:COLORS.text5,marginHorizontal:SPACING.md},
  socialRow:{flexDirection:'row',gap:SPACING.sm,marginBottom:SPACING.lg},
  socialBtn:{flex:1,backgroundColor:COLORS.bg3,borderWidth:0.5,borderColor:COLORS.bg5,
    borderRadius:RADIUS.md,paddingVertical:11,alignItems:'center'},
  socialT:{fontSize:12,color:COLORS.text3},
  footer:{textAlign:'center',fontSize:11,color:COLORS.text5,lineHeight:18},
});
