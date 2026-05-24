// src/screens/SavedScreen.tsx
import React from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS, RADIUS, SPACING } from '../utils/theme';
import { useStore } from '../store/useStore';

export default function SavedScreen({ navigation }: any) {
  const { savedArticles, toggleSave, savedIds } = useStore();

  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={s.card} onPress={() => navigation.navigate('Article', { article: item })} activeOpacity={0.85}>
      <Image source={{ uri: item.image }} style={s.thumb} resizeMode="cover" />
      <View style={s.info}>
        <Text style={s.src}>{item.source}</Text>
        <Text style={s.title} numberOfLines={2}>{item.title}</Text>
        <Text style={s.cat}>{item.category}</Text>
      </View>
      <TouchableOpacity style={s.unsaveBtn} onPress={() => toggleSave(item)} hitSlop={{top:8,bottom:8,left:8,right:8}}>
        <Text style={{ fontSize:15, color:COLORS.gold }}>🔖</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <View style={s.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.bg0} />
      <SafeAreaView style={s.safe} edges={['top']}>
        <View style={s.header}>
          <TouchableOpacity style={s.back} onPress={() => navigation.goBack()}>
            <Text style={{ color:COLORS.text3, fontSize:18 }}>←</Text>
          </TouchableOpacity>
          <Text style={s.headerTitle}>Saved</Text>
          <Text style={s.headerCount}>{savedArticles.length} articles</Text>
        </View>

        {savedArticles.length === 0 ? (
          <View style={s.empty}>
            <Text style={{ fontSize:40 }}>🔖</Text>
            <Text style={s.emptyT}>Nothing saved yet</Text>
            <Text style={s.emptySub}>Tap the bookmark icon on any article to save it here for later.</Text>
          </View>
        ) : (
          <FlatList
            data={savedArticles}
            keyExtractor={i => i.id}
            renderItem={renderItem}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          />
        )}
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root:{flex:1,backgroundColor:COLORS.bg0},
  safe:{flex:1},
  header:{flexDirection:'row',alignItems:'center',justifyContent:'space-between',
    paddingHorizontal:SPACING.lg,paddingVertical:12,borderBottomWidth:0.5,borderBottomColor:COLORS.bg4},
  back:{width:34,height:34,backgroundColor:COLORS.bg3,borderRadius:RADIUS.md,alignItems:'center',justifyContent:'center'},
  headerTitle:{fontSize:18,fontWeight:'500',color:COLORS.text1},
  headerCount:{fontSize:12,color:COLORS.text5},
  card:{flexDirection:'row',gap:12,padding:12,paddingHorizontal:14,
    borderBottomWidth:0.5,borderBottomColor:COLORS.bg2,alignItems:'center'},
  thumb:{width:70,height:70,borderRadius:RADIUS.md,backgroundColor:COLORS.bg3,flexShrink:0},
  info:{flex:1},
  src:{fontSize:10,color:COLORS.gold,fontWeight:'500',letterSpacing:0.4,textTransform:'uppercase',marginBottom:3},
  title:{fontSize:13,fontWeight:'500',color:COLORS.text2,lineHeight:18,marginBottom:4},
  cat:{fontSize:10,color:COLORS.text5},
  unsaveBtn:{width:30,height:30,alignItems:'center',justifyContent:'center'},
  empty:{flex:1,alignItems:'center',justifyContent:'center',padding:40,gap:12},
  emptyT:{fontSize:16,fontWeight:'500',color:COLORS.text3},
  emptySub:{fontSize:13,color:COLORS.text5,textAlign:'center',lineHeight:19},
});
