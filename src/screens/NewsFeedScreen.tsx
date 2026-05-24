// src/screens/NewsFeedScreen.tsx
import React, { useEffect, useRef, useState, useCallback } from 'react';
import {
  View, Text, TouchableOpacity, FlatList, StyleSheet, StatusBar,
  Animated, Dimensions, ScrollView, Pressable, Image, ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../utils/theme';
import { useStore } from '../store/useStore';
import { fetchTopHeadlines, fetchAllCategories, NewsArticle } from '../services/newsService';
import Logo from '../components/Logo';

const { width: SW } = Dimensions.get('window');
const DRAWER_W = Math.min(SW * 0.78, 280);

const CATEGORIES = ['For You','Technology','Business','Sports','Science','Health','Entertainment','World'];

const GNEWS_CAT_MAP: Record<string,string> = {
  'For You':'general','Technology':'technology','Business':'business',
  'Sports':'sports','Science':'science','Health':'health','Entertainment':'entertainment','World':'world',
};

const DRAWER_ITEMS = [
  { icon:'🏠', label:'Home',         sub:'Your personalised feed',    screen:'Feed' },
  { icon:'🧭', label:'Explore',       sub:'Browse all topics',          screen:'Feed' },
  { icon:'📈', label:'Trending',      sub:"What's hot right now",       screen:'Feed', badge:'Live' },
  { icon:'🔖', label:'Saved',         sub:'Your saved articles',        screen:'Saved' },
  { icon:'🔔', label:'Notifications', sub:'Breaking alerts',            screen:null,   badge:'3' },
  null,
  { icon:'📰', label:'Following',     sub:'Sources you follow',         screen:null },
  { icon:'⚙️', label:'App Settings',  sub:'Display, reading, privacy',  screen:'Settings' },
  { icon:'❓', label:'Help & Support', sub:'',                           screen:null },
  { icon:'ℹ️', label:'About',          sub:'Instants v1.0.0',            screen:null },
];

export default function NewsFeedScreen({ navigation }: any) {
  const { articles, savedIds, toggleSave, setArticles, setLoading, setError,
    loading, error, activeCategory, setActiveCategory } = useStore();

  const drawerAnim = useRef(new Animated.Value(DRAWER_W)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadNews = useCallback(async (category: string, isRefresh = false) => {
    if (!isRefresh) setLoading(true);
    setError(null);
    try {
      const cat = GNEWS_CAT_MAP[category] ?? 'general';
      const data = category === 'For You'
        ? await fetchAllCategories()
        : await fetchTopHeadlines(cat);
      setArticles(data);
    } catch (e: any) {
      setError(e.message || 'Failed to load news');
    } finally {
      setLoading(false);
      if (isRefresh) setRefreshing(false);
    }
  }, []);

  useEffect(() => { loadNews(activeCategory); }, [activeCategory]);

  const onRefresh = () => { setRefreshing(true); loadNews(activeCategory, true); };

  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.spring(drawerAnim, { toValue: 0, tension: 60, friction: 12, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const closeDrawer = () => {
    Animated.parallel([
      Animated.spring(drawerAnim, { toValue: DRAWER_W, tension: 60, friction: 12, useNativeDriver: true }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => setDrawerOpen(false));
  };

  const renderArticle = ({ item, index }: { item: NewsArticle; index: number }) => {
    const isSaved = savedIds.has(item.id);
    const isFeature = index === 0 && activeCategory === 'For You';

    if (isFeature) {
      return (
        <TouchableOpacity style={s.featureCard} onPress={() => navigation.navigate('Article', { article: item })} activeOpacity={0.9}>
          <Image source={{ uri: item.image }} style={s.featureImage} resizeMode="cover" />
          <View style={s.featureOverlay} />
          <View style={s.featureContent}>
            <View style={s.featureMeta}>
              <Text style={s.featureSrc}>{item.source}</Text>
              <View style={s.dot} />
              <Text style={s.featureTime}>{timeAgo(item.publishedAt)}</Text>
              <View style={[s.catBadge, { marginLeft: 6 }]}>
                <Text style={s.catBadgeT}>{item.category}</Text>
              </View>
            </View>
            <Text style={s.featureTitle} numberOfLines={3}>{item.title}</Text>
          </View>
          <TouchableOpacity
            style={[s.featureSaveBtn, isSaved && s.saveBtnA]}
            onPress={() => toggleSave(item)}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
            <Text style={{ fontSize: 14, color: isSaved ? COLORS.gold : COLORS.text3 }}>🔖</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity style={s.card} onPress={() => navigation.navigate('Article', { article: item })} activeOpacity={0.85}>
        <Image source={{ uri: item.image }} style={s.thumb} resizeMode="cover" />
        <View style={s.cardBody}>
          <View style={s.meta}>
            <Text style={s.src}>{item.source}</Text>
            <View style={s.dot} />
            <Text style={s.time}>{timeAgo(item.publishedAt)}</Text>
          </View>
          <Text style={s.title} numberOfLines={2}>{item.title}</Text>
          <View style={s.cardBot}>
            <View style={s.catBadge}><Text style={s.catBadgeT}>{item.category}</Text></View>
            <TouchableOpacity
              style={[s.saveBtn, isSaved && s.saveBtnA]}
              onPress={() => toggleSave(item)}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Text style={{ fontSize: 12, color: isSaved ? COLORS.gold : COLORS.text5 }}>🔖</Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg0} />
      <SafeAreaView style={s.safe} edges={['top']}>
        {/* Header */}
        <View style={s.header}>
          <TouchableOpacity style={s.hBtn} onPress={() => navigation.navigate('Saved')}>
            <Text style={{ fontSize: 17 }}>🔖</Text>
          </TouchableOpacity>
          <Logo size="sm" showWordmark />
          <TouchableOpacity style={s.hBtn} onPress={openDrawer}>
            <Text style={{ fontSize: 17, color: COLORS.text3 }}>☰</Text>
          </TouchableOpacity>
        </View>

        {/* Category chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.chips}>
          {CATEGORIES.map(c => (
            <TouchableOpacity key={c}
              style={[s.chip, activeCategory===c && s.chipA]}
              onPress={() => { setActiveCategory(c); }}>
              <Text style={[s.chipT, activeCategory===c && s.chipTA]}>{c}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Feed */}
        {loading && articles.length === 0 ? (
          <View style={s.center}>
            <ActivityIndicator color={COLORS.gold} size="large" />
            <Text style={s.loadingT}>Loading latest news…</Text>
          </View>
        ) : error && articles.length === 0 ? (
          <View style={s.center}>
            <Text style={{ fontSize: 32 }}>📡</Text>
            <Text style={s.errorT}>{error}</Text>
            <Text style={s.errorSub}>Add your GNews/NewsData API keys in newsService.ts</Text>
            <TouchableOpacity style={s.retryBtn} onPress={() => loadNews(activeCategory)}>
              <Text style={s.retryT}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={articles}
            keyExtractor={item => item.id}
            renderItem={renderArticle}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 12 }}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={COLORS.gold} />}
          />
        )}
      </SafeAreaView>

      {/* Overlay */}
      {drawerOpen && (
        <Animated.View style={[s.overlay, { opacity: overlayAnim }]}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeDrawer} />
        </Animated.View>
      )}

      {/* Drawer */}
      <Animated.View style={[s.drawer, { transform: [{ translateX: drawerAnim }] }]}>
        <SafeAreaView style={{ flex: 1 }} edges={['top']}>
          <TouchableOpacity style={s.drawerClose} onPress={closeDrawer}>
            <Text style={{ color: COLORS.text3, fontSize: 15 }}>✕</Text>
          </TouchableOpacity>
          <View style={s.drawerTop}>
            <Logo size="sm" showWordmark />
            <Text style={s.drawerSub}>Your world, right now</Text>
          </View>
          <ScrollView style={{ flex: 1 }}>
            {DRAWER_ITEMS.map((item, idx) =>
              item === null
                ? <View key={`sep-${idx}`} style={s.drawerSep} />
                : (
                  <TouchableOpacity key={item.label} style={s.drawerItem}
                    onPress={() => { closeDrawer(); if (item.screen) setTimeout(() => navigation.navigate(item.screen!), 300); }}>
                    <Text style={{ fontSize: 17, marginRight: 12 }}>{item.icon}</Text>
                    <View style={{ flex: 1 }}>
                      <Text style={s.drawerLabel}>{item.label}</Text>
                      {!!item.sub && <Text style={s.drawerSub2}>{item.sub}</Text>}
                    </View>
                    {item.badge && <View style={s.badge}><Text style={s.badgeT}>{item.badge}</Text></View>}
                  </TouchableOpacity>
                )
            )}
          </ScrollView>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}

function timeAgo(dateStr: string): string {
  const diff = Math.max(0, Date.now() - new Date(dateStr).getTime());
  const mins = Math.floor(diff / 60000);
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return `${Math.floor(hrs / 24)}d ago`;
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:COLORS.bg0},
  safe:{flex:1},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
    paddingHorizontal:SPACING.lg,paddingVertical:10,borderBottomWidth:0.5,borderBottomColor:COLORS.bg4},
  hBtn:{width:36,height:36,backgroundColor:COLORS.bg3,borderRadius:RADIUS.md,alignItems:'center',justifyContent:'center'},
  chips:{paddingHorizontal:SPACING.md,paddingVertical:9,gap:7},
  chip:{paddingHorizontal:13,paddingVertical:5,borderRadius:RADIUS.pill,borderWidth:0.5,borderColor:COLORS.bg5},
  chipA:{backgroundColor:`${COLORS.gold}20`,borderColor:COLORS.gold},
  chipT:{fontSize:11,color:COLORS.text4},
  chipTA:{color:COLORS.gold},

  // Feature card
  featureCard:{margin:12,borderRadius:RADIUS.xl,overflow:'hidden',height:220},
  featureImage:{...StyleSheet.absoluteFillObject,width:'100%',height:'100%'},
  featureOverlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(13,13,15,0.55)'},
  featureContent:{position:'absolute',bottom:0,left:0,right:0,padding:14},
  featureMeta:{flexDirection:'row',alignItems:'center',gap:5,marginBottom:7},
  featureSrc:{fontSize:10,color:COLORS.gold,fontWeight:'600',letterSpacing:0.5,textTransform:'uppercase'},
  featureTime:{fontSize:10,color:'rgba(255,255,255,0.6)'},
  featureTitle:{fontSize:16,fontWeight:'600',color:'#fff',lineHeight:22},
  featureSaveBtn:{position:'absolute',top:12,right:12,width:32,height:32,backgroundColor:'rgba(13,13,15,0.7)',
    borderRadius:RADIUS.sm,alignItems:'center',justifyContent:'center'},

  // Regular card
  card:{flexDirection:'row',gap:12,padding:12,paddingHorizontal:14,
    borderBottomWidth:0.5,borderBottomColor:COLORS.bg2,alignItems:'flex-start'},
  thumb:{width:80,height:80,borderRadius:RADIUS.md,backgroundColor:COLORS.bg3,flexShrink:0},
  cardBody:{flex:1},
  meta:{flexDirection:'row',alignItems:'center',gap:5,marginBottom:4},
  src:{fontSize:10,color:COLORS.gold,fontWeight:'500',letterSpacing:0.4,textTransform:'uppercase'},
  dot:{width:3,height:3,borderRadius:1.5,backgroundColor:COLORS.text5},
  time:{fontSize:10,color:COLORS.text5},
  title:{fontSize:13,fontWeight:'500',color:COLORS.text2,lineHeight:18,marginBottom:6},
  cardBot:{flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
  catBadge:{backgroundColor:COLORS.bg3,paddingHorizontal:7,paddingVertical:2,borderRadius:4},
  catBadgeT:{fontSize:10,color:COLORS.text4},
  saveBtn:{width:26,height:26,borderRadius:RADIUS.sm,borderWidth:0.5,borderColor:COLORS.bg5,
    alignItems:'center',justifyContent:'center'},
  saveBtnA:{borderColor:`${COLORS.gold}50`,backgroundColor:`${COLORS.gold}15`},

  center:{flex:1,alignItems:'center',justifyContent:'center',padding:32,gap:12},
  loadingT:{fontSize:13,color:COLORS.text5,marginTop:8},
  errorT:{fontSize:14,color:COLORS.text3,textAlign:'center',fontWeight:'500'},
  errorSub:{fontSize:12,color:COLORS.text5,textAlign:'center',lineHeight:18},
  retryBtn:{marginTop:8,backgroundColor:COLORS.gold,borderRadius:RADIUS.md,paddingHorizontal:24,paddingVertical:10},
  retryT:{fontSize:13,color:COLORS.bg0,fontWeight:'500'},

  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:'rgba(0,0,0,0.5)',zIndex:10},
  drawer:{position:'absolute',top:0,right:0,bottom:0,width:DRAWER_W,backgroundColor:COLORS.bg1,
    borderLeftWidth:0.5,borderLeftColor:COLORS.bg4,zIndex:11},
  drawerClose:{position:'absolute',top:50,right:13,width:28,height:28,backgroundColor:COLORS.bg3,
    borderRadius:8,alignItems:'center',justifyContent:'center',zIndex:1},
  drawerTop:{padding:SPACING.lg,paddingTop:48,borderBottomWidth:0.5,borderBottomColor:COLORS.bg4,marginBottom:4},
  drawerSub:{fontSize:11,color:COLORS.text5,marginTop:4},
  drawerItem:{flexDirection:'row',alignItems:'center',paddingHorizontal:SPACING.lg,paddingVertical:12},
  drawerLabel:{fontSize:13,color:COLORS.text2},
  drawerSub2:{fontSize:11,color:COLORS.text5,marginTop:1},
  drawerSep:{height:0.5,backgroundColor:COLORS.bg4,marginHorizontal:SPACING.lg,marginVertical:5},
  badge:{backgroundColor:`${COLORS.gold}25`,borderRadius:4,paddingHorizontal:7,paddingVertical:2},
  badgeT:{fontSize:10,color:COLORS.gold},
});
