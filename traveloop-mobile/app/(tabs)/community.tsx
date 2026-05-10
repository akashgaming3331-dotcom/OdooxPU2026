import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView,
  ScrollView, TextInput, Alert, Modal
} from 'react-native';
import { Image } from 'expo-image';
import { Search, SlidersHorizontal, Globe, MapPin, Star, Users, Heart, Compass, X, TrendingUp, Clock, Award } from 'lucide-react-native';

type SortType = 'Trending' | 'Recent' | 'Top Rated';

const SAMPLE_POSTS = [
  { id: '1', user: 'Rohan A.', avatar: 'https://i.pravatar.cc/100?img=11', trip: 'Golden Triangle Explorer', city: 'Jaipur, India', rating: 5, text: 'Absolutely stunning! The Amber Fort at sunset is a must. Highly recommend the local Rajasthani thali too!', likes: 142, date: 'May 15, 2025', trending: true },
  { id: '2', user: 'Kavya M.', avatar: 'https://i.pravatar.cc/100?img=5', trip: 'Kerala Backwaters', city: 'Alleppey, India', rating: 5, text: 'The houseboat experience was beyond beautiful. Book during monsoon for the best greenery! Morning tea on the deck is magical.', likes: 98, date: 'Apr 28, 2025', trending: true },
  { id: '3', user: 'Arjun K.', avatar: 'https://i.pravatar.cc/100?img=3', trip: 'Goa Beach Escape', city: 'Goa, India', rating: 4, text: 'Great food, friendly locals. Skip Baga beach — head to South Goa instead for a better, relaxing vibe.', likes: 76, date: 'Mar 10, 2025', trending: false },
  { id: '4', user: 'Vikram L.', avatar: 'https://i.pravatar.cc/100?img=14', trip: 'Himalayan Trek', city: 'Manali, India', rating: 5, text: 'The mountains are breathtaking. Did the Rohtang pass day trip — worth every rupee! Paragliding was incredible.', likes: 184, date: 'Jun 2, 2025', trending: false },
  { id: '5', user: 'Priya S.', avatar: 'https://i.pravatar.cc/100?img=9', trip: 'Varanasi Spiritual Journey', city: 'Varanasi, India', rating: 5, text: 'The Ganga Aarti is an absolutely divine experience. The boat ride at sunrise was incredible and the energy is amazing.', likes: 237, date: 'May 30, 2025', trending: false },
];

export default function CommunityScreen() {
  const [search, setSearch] = useState('');
  const [liked, setLiked] = useState<string[]>([]);
  const [sortType, setSortType] = useState<SortType>('Trending');
  const [selectedPost, setSelectedPost] = useState<any>(null);

  const toggleLike = (id: string) => {
    setLiked(l => l.includes(id) ? l.filter(x => x !== id) : [...l, id]);
  };

  const getSorted = () => {
    let posts = SAMPLE_POSTS.filter(p =>
      p.trip.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase()) ||
      p.text.toLowerCase().includes(search.toLowerCase())
    );
    switch (sortType) {
      case 'Trending': return [...posts].sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));
      case 'Recent': return [...posts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
      case 'Top Rated': return [...posts].sort((a, b) => b.rating - a.rating || b.likes - a.likes);
    }
  };

  const filtered = getSorted();

  const sortIcons: Record<SortType, React.ReactNode> = {
    'Trending': <TrendingUp color={sortType === 'Trending' ? '#002020' : '#44474d'} size={14} />,
    'Recent': <Clock color={sortType === 'Recent' ? '#002020' : '#44474d'} size={14} />,
    'Top Rated': <Award color={sortType === 'Top Rated' ? '#002020' : '#44474d'} size={14} />,
  };

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <View style={s.brandRow}>
          <Compass color="#00030a" size={24} />
          <Text style={s.brandName}>Community</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        <View style={s.titleSection}>
          <Text style={s.pageTitle}>Traveler Feed</Text>
          <Text style={s.pageSub}>Discover experiences, tips, and reviews from the global Traveloop community.</Text>
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
          <Search color="#75777e" size={20} style={{ marginRight: 12 }} />
          <TextInput style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Search destinations or reviews..." placeholderTextColor="#75777e" />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <X color="#75777e" size={18} />
            </TouchableOpacity>
          )}
        </View>

        {/* Sort Controls */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.controls}>
          <TouchableOpacity style={s.filterBtn} onPress={() => Alert.alert('Filter', 'Filter by country, rating, or date range coming soon!')}>
            <SlidersHorizontal color="#006e70" size={16} />
            <Text style={s.filterText}>Filter</Text>
          </TouchableOpacity>
          {(['Trending', 'Recent', 'Top Rated'] as SortType[]).map(type => (
            <TouchableOpacity
              key={type}
              style={[s.controlBtn, sortType === type && s.controlBtnActive]}
              onPress={() => setSortType(type)}
            >
              {sortIcons[type]}
              <Text style={[s.controlText, sortType === type && s.controlTextActive]}>{type}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Stats Banner */}
        <View style={s.statsBanner}>
          <View style={s.statItem}>
            <Users color="#00696b" size={24} />
            <Text style={s.statNum}>2.4k</Text>
            <Text style={s.statLabel}>Travelers</Text>
          </View>
          <View style={s.statDiv} />
          <View style={s.statItem}>
            <Globe color="#00696b" size={24} />
            <Text style={s.statNum}>28</Text>
            <Text style={s.statLabel}>States</Text>
          </View>
          <View style={s.statDiv} />
          <View style={s.statItem}>
            <Star color="#00696b" size={24} />
            <Text style={s.statNum}>1.8k</Text>
            <Text style={s.statLabel}>Reviews</Text>
          </View>
        </View>

        {/* Sort label */}
        <Text style={s.sectionTitle}>{sortType} Experiences {search ? `· "${search}"` : ''}</Text>

        {filtered.length === 0 && (
          <View style={s.empty}>
            <Text style={s.emptyText}>No results found. Try different keywords.</Text>
            <TouchableOpacity onPress={() => setSearch('')}><Text style={s.clearText}>Clear search</Text></TouchableOpacity>
          </View>
        )}

        {filtered.map(post => (
          <View key={post.id} style={s.postCard}>
            <View style={s.postHeader}>
              <Image source={{ uri: post.avatar }} style={s.avatar} contentFit="cover" />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={s.postUser}>{post.user}</Text>
                <Text style={s.postDate}>{post.date}</Text>
              </View>
              <View style={s.starsRow}>
                {Array(5).fill(0).map((_, i) => (
                  <Star key={i} color={i < post.rating ? '#d76135' : '#c5c6ce'} size={14} fill={i < post.rating ? '#d76135' : 'none'} />
                ))}
              </View>
            </View>

            <View style={s.postTrip}>
              <Text style={s.postTripName}>{post.trip}</Text>
              <View style={s.postCityRow}>
                <MapPin color="#00696b" size={12} />
                <Text style={s.postCity}>{post.city}</Text>
                {post.trending && (
                  <View style={s.trendingBadge}>
                    <TrendingUp color="#002020" size={10} />
                    <Text style={s.trendingText}>Trending</Text>
                  </View>
                )}
              </View>
            </View>

            <Text style={s.postContent}>{post.text}</Text>

            <View style={s.postActions}>
              <TouchableOpacity style={s.likeBtn} onPress={() => toggleLike(post.id)}>
                <Heart color={liked.includes(post.id) ? '#ba1a1a' : '#75777e'} size={18} fill={liked.includes(post.id) ? '#ba1a1a' : 'none'} />
                <Text style={[s.likeBtnText, liked.includes(post.id) && { color: '#ba1a1a' }]}>
                  {post.likes + (liked.includes(post.id) ? 1 : 0)}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={s.viewTripBtn}
                onPress={() => Alert.alert(post.trip, `✈️ Trip: ${post.trip}\n📍 City: ${post.city}\n⭐ Rating: ${'★'.repeat(post.rating)}\n👤 By: ${post.user}\n\n"${post.text}"`, [
                  { text: 'Close', style: 'cancel' },
                ])}
              >
                <Text style={s.viewTripText}>View Trip →</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#f7f9fb' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { fontSize: 24, fontWeight: '700', color: '#00030a' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  titleSection: { marginBottom: 24 },
  pageTitle: { fontSize: 32, fontWeight: '700', color: '#191c1e', letterSpacing: -0.5, marginBottom: 8 },
  pageSub: { fontSize: 16, color: '#44474d', lineHeight: 24 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, color: '#191c1e', fontSize: 16 },
  controls: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  filterBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#56f5f8', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20 },
  filterText: { color: '#006e70', fontSize: 13, fontWeight: '700' },
  controlBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#eceef0' },
  controlBtnActive: { backgroundColor: '#56f5f8', borderColor: '#2ddbde' },
  controlText: { color: '#44474d', fontSize: 13, fontWeight: '600' },
  controlTextActive: { color: '#002020', fontWeight: '700' },
  statsBanner: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statItem: { flex: 1, alignItems: 'center', gap: 8 },
  statNum: { fontSize: 24, fontWeight: '700', color: '#191c1e' },
  statLabel: { fontSize: 12, color: '#75777e', textAlign: 'center', fontWeight: '600' },
  statDiv: { width: 1, backgroundColor: '#e0e3e5', marginHorizontal: 8 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e', marginBottom: 16 },
  empty: { alignItems: 'center', paddingVertical: 32 },
  emptyText: { fontSize: 15, color: '#75777e', marginBottom: 12 },
  clearText: { fontSize: 15, color: '#00696b', fontWeight: '700' },
  postCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  postHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  avatar: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#e0e3e5' },
  postUser: { fontSize: 16, fontWeight: '700', color: '#191c1e' },
  postDate: { fontSize: 12, color: '#75777e', marginTop: 2 },
  starsRow: { flexDirection: 'row', gap: 2 },
  postTrip: { backgroundColor: '#f2f4f6', borderRadius: 14, padding: 14, marginBottom: 14 },
  postTripName: { fontSize: 15, fontWeight: '700', color: '#191c1e', marginBottom: 6 },
  postCityRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  postCity: { fontSize: 13, color: '#00696b', fontWeight: '600' },
  trendingBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#56f5f8', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 12, marginLeft: 4 },
  trendingText: { fontSize: 10, fontWeight: '700', color: '#002020' },
  postContent: { fontSize: 15, color: '#44474d', lineHeight: 24, marginBottom: 16 },
  postActions: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#eceef0', paddingTop: 16 },
  likeBtn: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  likeBtnText: { fontSize: 14, color: '#75777e', fontWeight: '600' },
  viewTripBtn: { backgroundColor: '#e6f4f1', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 20 },
  viewTripText: { color: '#00696b', fontWeight: '700', fontSize: 14 },
});
