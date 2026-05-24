// src/screens/ArticleScreen.tsx
import React, { useState, useRef } from 'react';
import {
  View, Text, TouchableOpacity, ScrollView, StyleSheet, StatusBar,
  Modal, Animated, ActivityIndicator, Share, Alert, Image, Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../utils/theme';
import { useStore } from '../store/useStore';
import { generateInfographic } from '../services/infographicService';
import type { NewsArticle } from '../services/newsService';

export default function ArticleScreen({ navigation, route }: any) {
  const { article }: { article: NewsArticle } = route.params;
  const { savedIds, toggleSave, settings } = useStore();
  const isSaved = savedIds.has(article.id);

  const [selText, setSelText] = useState('');
  const [popVisible, setPopVisible] = useState(false);
  const [infVisible, setInfVisible] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [genUrl, setGenUrl] = useState<string|null>(null);
  const popAnim = useRef(new Animated.Value(0)).current;

  const readBg = { dark:COLORS.bg0, warm:'#f5f0e8', cool:'#e8f0f5', night:'#1a1a2e' }[settings.readingBg];
  const readText = (settings.readingBg==='warm'||settings.readingBg==='cool') ? '#1a1a1e' : COLORS.text3;
  const fontFamily = { sans:'System', serif:'Georgia', mono:'Courier New' }[settings.readingFont];
  const lineH = { compact:1.45, normal:1.7, relaxed:2.0 }[settings.lineSpacing];
  const fs = settings.fontSize;

  const paragraphs = (article.content || article.description || '').split('\n\n').filter(Boolean);

  const showPop = (text: string) => {
    setSelText(text);
    setPopVisible(true);
    Animated.spring(popAnim, { toValue:1, useNativeDriver:true, tension:80, friction:10 }).start();
  };
  const hidePop = () => {
    Animated.timing(popAnim, { toValue:0, duration:150, useNativeDriver:true }).start(() => setPopVisible(false));
  };

  const handleCopy = () => { hidePop(); Alert.alert('Copied ✓', 'Text copied to clipboard.'); };
  const handleShare = () => { hidePop(); Share.share({ message: `${selText}\n\n— via Instants, ${article.source}` }); };
  const handleInfographic = async () => {
    hidePop();
    setInfVisible(true);
    setGenerating(true);
    setGenUrl(null);
    try {
      const res = await generateInfographic(selText, article.source, article.category);
      setGenUrl(res.imageUrl);
    } catch (e: any) {
      Alert.alert('Error', e.message || 'Check your OpenAI API key in infographicService.ts');
    } finally { setGenerating(false); }
  };

  const shareInfographic = () => {
    if (!genUrl) return;
    Share.share({ message: `${selText}\n\nvia Instants app`, url: genUrl });
  };

  const formattedDate = (() => {
    try { return new Date(article.publishedAt).toLocaleDateString('en-IN', { day:'numeric', month:'long', year:'numeric' }); }
    catch { return article.publishedAt; }
  })();

  return (
    <View style={[s.root, { backgroundColor: readBg }]}>
      <StatusBar barStyle="light-content" />

      {/* Hero image */}
      <View style={s.hero}>
        <Image source={{ uri: article.image }} style={s.heroImg} resizeMode="cover" />
        <View style={s.heroOverlay} />
        <SafeAreaView style={s.heroNav} edges={['top']}>
          <TouchableOpacity style={s.navBtn} onPress={() => navigation.goBack()}>
            <Text style={{ color:'#fff', fontSize:18 }}>←</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[s.navBtn, isSaved && s.navBtnA]} onPress={() => toggleSave(article)}>
            <Text style={{ fontSize:16, color: isSaved ? COLORS.gold : '#fff' }}>🔖</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>

      {/* Body */}
      <ScrollView style={{ flex:1 }} contentContainerStyle={s.body} showsVerticalScrollIndicator={false}>
        <View style={s.sourceRow}>
          <Text style={s.source}>{article.source.toUpperCase()}</Text>
          <Text style={s.atime}>{formattedDate}</Text>
        </View>
        <Text style={[s.title, { fontFamily, fontSize: fs+3, lineHeight: (fs+3)*1.45 }]}>
          {article.title}
        </Text>
        {article.author && (
          <View style={s.bylineRow}>
            <View style={s.avatar}>
              <Text style={{ fontSize:9, color:COLORS.text4 }}>
                {article.author.split(' ').slice(0,2).map(w=>w[0]).join('')}
              </Text>
            </View>
            <Text style={s.byline}>{article.author}</Text>
          </View>
        )}
        <View style={s.divider} />

        {paragraphs.map((p, i) => {
          const isPull = p.startsWith('"') || p.startsWith('"');
          return isPull ? (
            <TouchableOpacity key={i} style={s.pull} onLongPress={() => showPop(p)} activeOpacity={0.9}>
              <Text style={[s.pullT, { fontFamily, fontSize:fs, lineHeight:fs*lineH }]}>{p}</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity key={i} onLongPress={() => showPop(p)} activeOpacity={1}>
              <Text style={[s.para, { fontFamily, fontSize:fs, lineHeight:fs*lineH, color:readText }]}>{p}</Text>
            </TouchableOpacity>
          );
        })}

        {/* Read more */}
        <TouchableOpacity style={s.readMore} onPress={() => Linking.openURL(article.url)}>
          <Text style={s.readMoreT}>Read full article  →</Text>
        </TouchableOpacity>

        <View style={s.tagsRow}>
          {[article.category, article.source].filter(Boolean).map(t => (
            <View key={t} style={s.tag}><Text style={s.tagT}>{t}</Text></View>
          ))}
        </View>

        <Text style={s.hint}>💡 Long-press any paragraph → Copy · Share · Infographic</Text>
      </ScrollView>

      {/* Selection popup */}
      {popVisible && (
        <Animated.View style={[s.popup, { transform:[{scale:popAnim}], opacity:popAnim }]}>
          <TouchableOpacity style={s.popBtn} onPress={handleCopy}>
            <Text style={s.popBtnT}>📋 Copy</Text>
          </TouchableOpacity>
          <View style={s.popSep} />
          <TouchableOpacity style={s.popBtn} onPress={handleShare}>
            <Text style={s.popBtnT}>↗ Share</Text>
          </TouchableOpacity>
          <View style={s.popSep} />
          <TouchableOpacity style={s.popBtn} onPress={handleInfographic}>
            <Text style={[s.popBtnT, { color:COLORS.gold }]}>🖼 Infographic</Text>
          </TouchableOpacity>
          <View style={s.popSep} />
          <TouchableOpacity style={s.popBtn} onPress={hidePop}>
            <Text style={[s.popBtnT, { color:COLORS.text5 }]}>✕</Text>
          </TouchableOpacity>
        </Animated.View>
      )}

      {/* Infographic modal */}
      <Modal visible={infVisible} transparent animationType="slide" onRequestClose={() => setInfVisible(false)}>
        <View style={s.infBackdrop}>
          <View style={s.infSheet}>
            <Text style={s.infTitle}>Share as Infographic</Text>
            <Text style={s.infSub}>AI-generated branded visual</Text>

            <View style={s.infCard}>
              <View style={s.infTop}>
                <Text style={s.infQuoteMark}>"</Text>
                <Text style={s.infQuote} numberOfLines={4}>
                  {selText.length > 140 ? selText.substring(0,140)+'…' : selText}
                </Text>
                <View style={s.infSrcRow}>
                  <View style={s.infDot} />
                  <Text style={s.infSrcT}>{article.source} · {article.category}</Text>
                </View>
              </View>
              <View style={s.infBot}>
                <View style={s.infBrand}>
                  <View style={s.infLm} />
                  <Text style={s.infBrandT}>INSTANTS</Text>
                </View>
                <Text style={s.infDate}>{formattedDate}</Text>
              </View>
            </View>

            {generating && (
              <View style={s.genRow}>
                <ActivityIndicator color={COLORS.gold} size="small" />
                <Text style={s.genT}>Generating AI visual…</Text>
              </View>
            )}
            {genUrl && (
              <View style={s.genRow}>
                <Image source={{ uri: genUrl }} style={s.genPreview} resizeMode="cover" />
              </View>
            )}

            <View style={s.infActions}>
              <TouchableOpacity style={s.infAct} onPress={() => setInfVisible(false)}>
                <Text style={s.infActT}>✕  Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.infAct}>
                <Text style={s.infActT}>⬇  Save</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[s.infAct, s.infActPri]} onPress={shareInfographic}>
                <Text style={[s.infActT, { color:COLORS.bg0 }]}>↗  Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:COLORS.bg0},
  hero:{height:240,position:'relative'},
  heroImg:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  heroOverlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(13,13,15,0.35)'},
  heroNav:{position:'absolute',top:0,left:0,right:0,flexDirection:'row',
    justifyContent:'space-between',paddingHorizontal:14,paddingTop:6},
  navBtn:{width:36,height:36,backgroundColor:'rgba(13,13,15,0.7)',borderRadius:RADIUS.md,
    alignItems:'center',justifyContent:'center'},
  navBtnA:{backgroundColor:`${COLORS.gold}30`},
  body:{padding:SPACING.lg,paddingBottom:40},
  sourceRow:{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:10},
  source:{fontSize:11,color:COLORS.gold,fontWeight:'500',letterSpacing:1},
  atime:{fontSize:11,color:COLORS.text5},
  title:{fontSize:18,fontWeight:'600',color:COLORS.text1,marginBottom:12},
  bylineRow:{flexDirection:'row',alignItems:'center',gap:8,marginBottom:12},
  avatar:{width:22,height:22,borderRadius:11,backgroundColor:COLORS.bg5,alignItems:'center',justifyContent:'center'},
  byline:{fontSize:11,color:COLORS.text5},
  divider:{height:0.5,backgroundColor:COLORS.bg4,marginBottom:14},
  para:{fontSize:14,color:COLORS.text3,lineHeight:22,marginBottom:12},
  pull:{borderLeftWidth:2,borderLeftColor:COLORS.gold,paddingLeft:13,paddingVertical:8,
    backgroundColor:`${COLORS.gold}08`,borderRadius:4,marginBottom:12},
  pullT:{fontSize:14,color:COLORS.gold,fontStyle:'italic',lineHeight:22},
  readMore:{marginTop:4,marginBottom:16,alignSelf:'flex-start',
    borderBottomWidth:0.5,borderBottomColor:COLORS.gold,paddingBottom:2},
  readMoreT:{fontSize:12,color:COLORS.gold},
  tagsRow:{flexDirection:'row',flexWrap:'wrap',gap:6,marginBottom:12},
  tag:{backgroundColor:COLORS.bg3,borderWidth:0.5,borderColor:COLORS.bg5,
    paddingHorizontal:9,paddingVertical:3,borderRadius:5},
  tagT:{fontSize:10,color:COLORS.text4},
  hint:{fontSize:11,color:COLORS.text5,textAlign:'center',lineHeight:17},

  popup:{position:'absolute',bottom:20,alignSelf:'center',backgroundColor:COLORS.bg3,
    borderRadius:RADIUS.lg,flexDirection:'row',borderWidth:0.5,borderColor:COLORS.bg5,overflow:'hidden'},
  popBtn:{paddingHorizontal:13,paddingVertical:10},
  popBtnT:{fontSize:12,color:COLORS.text2},
  popSep:{width:0.5,backgroundColor:COLORS.bg5,marginVertical:6},

  infBackdrop:{flex:1,backgroundColor:'#000000aa',justifyContent:'flex-end'},
  infSheet:{backgroundColor:COLORS.bg1,borderRadius:20,padding:SPACING.lg,paddingBottom:34,
    borderTopWidth:0.5,borderTopColor:COLORS.bg4},
  infTitle:{fontSize:16,fontWeight:'500',color:COLORS.text1,marginBottom:3},
  infSub:{fontSize:12,color:COLORS.text5,marginBottom:14},
  infCard:{backgroundColor:COLORS.bg3,borderRadius:RADIUS.lg,borderWidth:0.5,
    borderColor:COLORS.bg5,overflow:'hidden',marginBottom:12},
  infTop:{backgroundColor:'#1a1208',padding:SPACING.md},
  infQuoteMark:{fontSize:28,color:COLORS.gold,lineHeight:30,marginBottom:3},
  infQuote:{fontSize:13,color:COLORS.goldLight,fontWeight:'500',lineHeight:19,marginBottom:10,fontStyle:'italic'},
  infSrcRow:{flexDirection:'row',alignItems:'center',gap:6},
  infDot:{width:6,height:6,borderRadius:3,backgroundColor:COLORS.gold},
  infSrcT:{fontSize:10,color:COLORS.text4},
  infBot:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',padding:SPACING.md},
  infBrand:{flexDirection:'row',alignItems:'center',gap:6},
  infLm:{width:14,height:14,backgroundColor:COLORS.gold,borderRadius:3},
  infBrandT:{fontSize:9,color:COLORS.gold,letterSpacing:1.5,fontWeight:'500'},
  infDate:{fontSize:10,color:COLORS.text5},
  genRow:{flexDirection:'row',alignItems:'center',justifyContent:'center',gap:8,marginBottom:12},
  genT:{fontSize:12,color:COLORS.text5},
  genPreview:{width:'100%',height:180,borderRadius:RADIUS.md,marginBottom:12},
  infActions:{flexDirection:'row',gap:8},
  infAct:{flex:1,padding:12,backgroundColor:COLORS.bg3,borderRadius:RADIUS.md,
    borderWidth:0.5,borderColor:COLORS.bg5,alignItems:'center'},
  infActPri:{backgroundColor:COLORS.gold,borderColor:COLORS.gold},
  infActT:{fontSize:12,color:COLORS.text2},
});
