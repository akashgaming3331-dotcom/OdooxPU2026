import React, { useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  TextInput, ActivityIndicator, Alert, Modal, Linking
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Search, SlidersHorizontal, MapPin, Star, Clock, CheckCircle, Calendar, X, Filter } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

type SortMode = 'trending' | 'recent' | 'price_low' | 'price_high';

const ALL_ACTIVITIES = [
  { id: 'feat', title: 'Taj Mahal Sunrise Tour', location: 'Agra, India', price: 45, duration: '4h', rating: 4.9, reviews: 5200, category: 'Culture', featured: true, img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800' },
  { id: 'in2', title: 'Kerala Houseboat Cruise', location: 'Alleppey, India', price: 85, duration: '1 Day', rating: 4.8, reviews: 2100, category: 'Nature', featured: false, img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=400' },
  { id: 'in3', title: 'Goa Beach & Nightlife', location: 'Goa, India', price: 30, duration: '1 Day', rating: 4.7, reviews: 4100, category: 'Leisure', featured: false, img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=400' },
  { id: 'in4', title: 'Varanasi Ganga Aarti', location: 'Varanasi, India', price: 20, duration: '3h', rating: 4.9, reviews: 3800, category: 'Spiritual', featured: false, img: 'https://images.unsplash.com/photo-1561361058-c24e018f2e48?auto=format&fit=crop&q=80&w=400' },
  { id: 'in5', title: 'Himachal Trekking', location: 'Manali, India', price: 120, duration: '3 Days', rating: 4.8, reviews: 1600, category: 'Adventure', featured: false, img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400' },
  { id: 'in6', title: 'Rajasthan Desert Safari', location: 'Jaisalmer, India', price: 65, duration: '1 Day', rating: 4.8, reviews: 2400, category: 'Adventure', featured: false, img: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?auto=format&fit=crop&q=80&w=400' },
  { id: 'in7', title: 'Ranthambore Tiger Safari', location: 'Sawai Madhopur, India', price: 90, duration: '4h', rating: 4.7, reviews: 1800, category: 'Nature', featured: false, img: 'https://images.unsplash.com/photo-1588693836171-87c2b3e80f1d?auto=format&fit=crop&q=80&w=400' },
  { id: 'in8', title: 'Mumbai Bollywood Tour', location: 'Mumbai, India', price: 40, duration: '6h', rating: 4.6, reviews: 3100, category: 'Culture', featured: false, img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=400' },
];

const FILTER_CHIPS = ['All', 'Culture', 'Adventure', 'Sports', 'Luxury', 'Nature', 'Leisure', 'Spiritual'];

export default function SearchScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [sortMode, setSortMode] = useState<SortMode>('trending');
  const [showSort, setShowSort] = useState(false);
  const [showCreateTrip, setShowCreateTrip] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [creating, setCreating] = useState(false);

  const getSorted = () => {
    let items = ALL_ACTIVITIES.filter(a => {
      const matchesQuery = query === '' || a.title.toLowerCase().includes(query.toLowerCase()) || a.location.toLowerCase().includes(query.toLowerCase());
      const matchesCat = activeCategory === 'All' || a.category === activeCategory;
      return matchesQuery && matchesCat;
    });
    switch (sortMode) {
      case 'price_low': return [...items].sort((a, b) => a.price - b.price);
      case 'price_high': return [...items].sort((a, b) => b.price - a.price);
      case 'recent': return [...items].sort((a, b) => b.reviews - a.reviews);
      case 'trending': default: return [...items].sort((a, b) => b.rating - a.rating);
    }
  };

  const results = getSorted();
  const featured = results.find(r => r.featured);
  const grid = results.filter(r => !r.featured);

  const openMaps = () => {
    const query = activeCategory !== 'All' ? activeCategory + ' activities' : 'travel destinations';
    Linking.openURL(`https://www.google.com/maps/search/${encodeURIComponent(query)}`).catch(() =>
      Alert.alert('Maps', 'Could not open maps app.')
    );
  };

  const sortLabels: Record<SortMode, string> = {
    trending: 'Trending', recent: 'Most Reviewed',
    price_low: 'Price: Low to High', price_high: 'Price: High to Low'
  };

  const createTrip = async () => {
    if (!form.title || !form.startDate || !form.endDate) {
      Alert.alert('Error', 'Title, start and end date required'); return;
    }

    let parsedStart, parsedEnd;
    try {
      parsedStart = new Date(form.startDate).toISOString();
      parsedEnd = new Date(form.endDate).toISOString();
    } catch (e) {
      Alert.alert('Invalid Date', 'Please ensure dates are in YYYY-MM-DD format.');
      return;
    }

    setCreating(true);
    const res = await apiRequest('/trips', 'POST', {
      title: form.title, description: form.description,
      startDate: parsedStart,
      endDate: parsedEnd,
    }, token);
    setCreating(false);
    
    if (res.success && res.data) {
      setShowCreateTrip(false);
      setForm({ title: '', description: '', startDate: '', endDate: '' });
      router.push(`/trip/${(res.data as any).id}`);
    } else {
      Alert.alert('Error', res.message || 'Could not create trip');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Search bar */}
      <View style={s.searchSection}>
        <View style={s.searchWrap}>
          <Search color="#75777e" size={20} style={{ marginRight: 12 }} />
          <TextInput
            style={s.searchInput}
            value={query}
            onChangeText={setQuery}
            placeholder="Search activities, cities..."
            placeholderTextColor="#75777e"
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={() => setQuery('')}>
              <X color="#75777e" size={18} />
            </TouchableOpacity>
          )}
        </View>

        {/* Category filter chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          <TouchableOpacity style={s.sortChip} onPress={() => setShowSort(true)}>
            <SlidersHorizontal color="#002020" size={14} />
            <Text style={s.sortChipText}>{sortLabels[sortMode]}</Text>
          </TouchableOpacity>
          {FILTER_CHIPS.map(f => (
            <TouchableOpacity
              key={f}
              style={[s.chip, activeCategory === f && s.chipActive]}
              onPress={() => setActiveCategory(f)}
            >
              <Text style={[s.chipText, activeCategory === f && s.chipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* India Promo Banner */}
        {!query && activeCategory === 'All' && (
          <TouchableOpacity
            style={[s.featuredCard, { height: 160, marginBottom: 20 }]}
            activeOpacity={0.9}
            onPress={() => router.push('/india-trips')}
          >
            <Image source={{ uri: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800' }} style={s.featuredImg} contentFit="cover" />
            <View style={[s.featuredOverlay, { justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' }]}>
              <Text style={{ fontSize: 32, marginBottom: 4 }}>🇮🇳</Text>
              <Text style={{ color: '#FFF', fontSize: 24, fontWeight: '800', letterSpacing: 1 }}>EXPLORE INDIA</Text>
              <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 14, marginTop: 4 }}>Tap to view 8 Curated Trip Templates</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Results header */}
        <View style={s.resultsHeader}>
          <Text style={s.resultsCount}>{results.length} {activeCategory !== 'All' ? activeCategory : ''} Results</Text>
          <TouchableOpacity style={s.mapBtn} onPress={openMaps}>
            <MapPin color="#00696b" size={16} />
            <Text style={s.mapBtnText}>View on Map</Text>
          </TouchableOpacity>
        </View>

        {/* Featured card */}
        {featured && !query && (
          <TouchableOpacity
            style={s.featuredCard}
            activeOpacity={0.9}
            onPress={() => Alert.alert(featured.title, `📍 ${featured.location}\n⭐ ${featured.rating} (${featured.reviews.toLocaleString()} reviews)\n⏱ ${featured.duration}\n💰 $${featured.price}/person\n\nTap "Plan a Trip" to add this to your itinerary!`, [
              { text: 'Close', style: 'cancel' },
              { text: 'Plan a Trip', onPress: () => setShowCreateTrip(true) }
            ])}
          >
            <Image source={{ uri: featured.img }} style={s.featuredImg} contentFit="cover" />
            <View style={s.featuredOverlay}>
              <View style={s.featuredTag}><Text style={s.featuredTagText}>FEATURED</Text></View>
              <Text style={s.featuredTitle}>{featured.title}</Text>
              <View style={s.featuredMeta}>
                <MapPin color="rgba(255,255,255,0.85)" size={14} />
                <Text style={s.featuredMetaText}>{featured.location}</Text>
                <Star color="#FFD700" size={14} fill="#FFD700" />
                <Text style={s.featuredMetaText}>{featured.rating} ({(featured.reviews / 1000).toFixed(1)}k reviews)</Text>
              </View>
            </View>
            <View style={s.featuredPrice}>
              <Text style={s.featuredPriceAmt}>${featured.price}</Text>
              <Text style={s.featuredPriceSub}>per person</Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Empty state */}
        {results.length === 0 && (
          <View style={s.empty}>
            <Text style={s.emptyIcon}>🔍</Text>
            <Text style={s.emptyTitle}>No results</Text>
            <Text style={s.emptyText}>Try a different search or category</Text>
            <TouchableOpacity onPress={() => { setQuery(''); setActiveCategory('All'); }}>
              <Text style={s.clearText}>Clear filters</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Result grid */}
        <View style={s.grid}>
          {grid.map(item => (
            <TouchableOpacity
              key={item.id}
              style={s.resultCard}
              activeOpacity={0.88}
              onPress={() => Alert.alert(item.title, `📍 ${item.location}\n⭐ ${item.rating} (${item.reviews} reviews)\n⏱ ${item.duration}\n💰 $${item.price}/person\n🏷 ${item.category}`, [
                { text: 'Close', style: 'cancel' },
                { text: 'Plan a Trip', onPress: () => setShowCreateTrip(true) }
              ])}
            >
              <View style={s.resultImgWrap}>
                <Image source={{ uri: item.img }} style={s.resultImg} contentFit="cover" />
                <View style={s.resultDurationBadge}>
                  <Clock color="#191c1e" size={12} />
                  <Text style={s.resultDurationText}>{item.duration}</Text>
                </View>
              </View>
              <View style={s.resultBody}>
                <Text style={s.resultTitle} numberOfLines={2}>{item.title}</Text>
                <Text style={s.resultLocation}>{item.location}</Text>
                <View style={s.resultFooter}>
                  <View style={s.resultTagPill}>
                    <CheckCircle color="#00696b" size={12} />
                    <Text style={s.resultTagText}>{item.category}</Text>
                  </View>
                  <Text style={s.resultPrice}>${item.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Sort Modal */}
      <Modal visible={showSort} transparent animationType="fade">
        <TouchableOpacity style={s.sortOverlay} activeOpacity={1} onPress={() => setShowSort(false)}>
          <View style={s.sortModal}>
            <Text style={s.sortModalTitle}>Sort By</Text>
            {(Object.entries(sortLabels) as [SortMode, string][]).map(([mode, label]) => (
              <TouchableOpacity
                key={mode}
                style={[s.sortOption, sortMode === mode && s.sortOptionActive]}
                onPress={() => { setSortMode(mode); setShowSort(false); }}
              >
                <Text style={[s.sortOptionText, sortMode === mode && s.sortOptionTextActive]}>{label}</Text>
                {sortMode === mode && <CheckCircle color="#00696b" size={18} />}
              </TouchableOpacity>
            ))}
          </View>
        </TouchableOpacity>
      </Modal>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => setShowCreateTrip(true)}>
        <Calendar color="#FFF" size={24} />
      </TouchableOpacity>

      {/* Create Trip Modal */}
      <Modal visible={showCreateTrip} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalTop}>
              <Text style={s.modalTitle}>Plan a new trip</Text>
              <TouchableOpacity onPress={() => setShowCreateTrip(false)} style={s.closeBtn}>
                <X color="#191c1e" size={22} />
              </TouchableOpacity>
            </View>
            <Text style={s.fieldLabel}>Trip Name *</Text>
            <TextInput style={s.mInput} value={form.title} onChangeText={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Europe Summer 2024" placeholderTextColor="#75777e" />
            <Text style={s.fieldLabel}>Description</Text>
            <TextInput style={[s.mInput, { height: 70, textAlignVertical: 'top' }]} value={form.description} onChangeText={v => setForm(f => ({ ...f, description: v }))} placeholder="What's this trip about?" placeholderTextColor="#75777e" multiline />
            <View style={s.dateRow}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={s.fieldLabel}>Start (YYYY-MM-DD)</Text>
                <TextInput style={s.mInput} value={form.startDate} onChangeText={v => setForm(f => ({ ...f, startDate: v }))} placeholder="2024-07-01" placeholderTextColor="#75777e" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>End (YYYY-MM-DD)</Text>
                <TextInput style={s.mInput} value={form.endDate} onChangeText={v => setForm(f => ({ ...f, endDate: v }))} placeholder="2024-07-15" placeholderTextColor="#75777e" />
              </View>
            </View>
            <TouchableOpacity style={s.createBtn} onPress={createTrip} disabled={creating}>
              {creating ? <ActivityIndicator color="#FFF" /> : <Text style={s.createBtnText}>Create Trip 🚀</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 100 },
  searchSection: { backgroundColor: '#f7f9fb', paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4, borderBottomWidth: 1, borderBottomColor: '#eceef0' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  searchInput: { flex: 1, color: '#191c1e', fontSize: 16 },
  filterRow: { flexDirection: 'row', gap: 8, paddingBottom: 12 },
  sortChip: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: '#56f5f8', gap: 6 },
  sortChipText: { fontSize: 13, color: '#002020', fontWeight: '700' },
  chip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eceef0' },
  chipActive: { backgroundColor: '#e6f4f1', borderColor: '#00696b' },
  chipText: { fontSize: 13, color: '#44474d', fontWeight: '600' },
  chipTextActive: { color: '#00696b', fontWeight: '700' },
  resultsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  resultsCount: { fontSize: 20, fontWeight: '700', color: '#191c1e' },
  mapBtn: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  mapBtnText: { color: '#00696b', fontSize: 14, fontWeight: '600' },
  featuredCard: { borderRadius: 20, overflow: 'hidden', height: 260, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.1, shadowRadius: 12, elevation: 5 },
  featuredImg: { width: '100%', height: '100%' },
  featuredOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', padding: 20, justifyContent: 'flex-end' },
  featuredTag: { position: 'absolute', top: 20, left: 20, backgroundColor: '#191c1e', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 8 },
  featuredTagText: { color: '#FFF', fontSize: 11, fontWeight: '800', letterSpacing: 0.5 },
  featuredTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', marginBottom: 8 },
  featuredMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  featuredMetaText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  featuredPrice: { position: 'absolute', top: 16, right: 16, backgroundColor: 'rgba(0,0,0,0.6)', borderRadius: 12, padding: 10, alignItems: 'center' },
  featuredPriceAmt: { color: '#FFF', fontSize: 20, fontWeight: '800' },
  featuredPriceSub: { color: 'rgba(255,255,255,0.7)', fontSize: 11 },
  empty: { alignItems: 'center', paddingVertical: 48 },
  emptyIcon: { fontSize: 48, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#191c1e', marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#75777e', marginBottom: 16 },
  clearText: { fontSize: 15, color: '#00696b', fontWeight: '700' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 16 },
  resultCard: { width: '47%', backgroundColor: '#ffffff', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  resultImgWrap: { width: '100%', height: 140, position: 'relative' },
  resultImg: { width: '100%', height: '100%' },
  resultDurationBadge: { position: 'absolute', bottom: 10, left: 10, flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  resultDurationText: { fontSize: 11, color: '#191c1e', fontWeight: '600' },
  resultBody: { padding: 14 },
  resultTitle: { fontSize: 15, fontWeight: '700', color: '#191c1e', marginBottom: 4, lineHeight: 20 },
  resultLocation: { fontSize: 13, color: '#75777e', marginBottom: 12 },
  resultFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  resultTagPill: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  resultTagText: { fontSize: 12, color: '#00696b', fontWeight: '600' },
  resultPrice: { fontSize: 17, fontWeight: '800', color: '#00696b' },
  sortOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.4)', justifyContent: 'center', alignItems: 'center' },
  sortModal: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, width: '80%' },
  sortModalTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e', marginBottom: 20 },
  sortOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f2f4f6' },
  sortOptionActive: { },
  sortOptionText: { fontSize: 16, color: '#44474d', fontWeight: '500' },
  sortOptionTextActive: { color: '#00696b', fontWeight: '700' },
  fab: { position: 'absolute', bottom: 100, right: 20, width: 56, height: 56, borderRadius: 20, backgroundColor: '#00696b', justifyContent: 'center', alignItems: 'center', shadowColor: '#00696b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 22, fontWeight: '700', color: '#191c1e' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eceef0', justifyContent: 'center', alignItems: 'center' },
  fieldLabel: { fontSize: 12, fontWeight: '600', color: '#44474d', marginBottom: 8 },
  mInput: { backgroundColor: '#eceef0', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, color: '#191c1e', fontSize: 15, marginBottom: 16 },
  dateRow: { flexDirection: 'row' },
  createBtn: { backgroundColor: '#00696b', borderRadius: 16, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  createBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
