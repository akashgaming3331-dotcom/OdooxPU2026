import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  TextInput, ActivityIndicator, Alert, RefreshControl, Dimensions
} from 'react-native';
import { Image } from 'expo-image';
import { Link, useRouter } from 'expo-router';
import {
  Search, SlidersHorizontal, Plus, MapPin, ChevronRight,
  Globe, Compass, Calendar, TrendingUp
} from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

const { width } = Dimensions.get('window');

const STATUS_COLOR: Record<string, { bg: string; text: string }> = {
  PLANNING:  { bg: '#b6c7e9', text: '#081c36' },
  UPCOMING:  { bg: '#56f5f8', text: '#002020' },
  ONGOING:   { bg: '#ffb59c', text: '#380c00' },
  COMPLETED: { bg: '#e0e3e5', text: '#44474d' },
};

const REGIONS = [
  { name: 'Rajasthan', dests: '42 Destinations', img: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?auto=format&fit=crop&q=80&w=400', route: 'India' },
  { name: 'Kerala', dests: '56 Destinations', img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=400', route: 'India' },
  { name: 'Goa', dests: '34 Destinations', img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=400', route: 'India' },
  { name: 'Himachal', dests: '28 Destinations', img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400', route: 'India' },
  { name: 'Maharashtra', dests: '19 Destinations', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=400', route: 'India' },
  { name: 'Uttarakhand', dests: '24 Destinations', img: 'https://images.unsplash.com/photo-1561361058-c24e018f2e48?auto=format&fit=crop&q=80&w=400', route: 'India' },
];

const COVERS = [
  'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1514222134-b57cbb8ce073?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1561361058-c24e018f2e48?auto=format&fit=crop&q=80&w=700',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=700',
];

export default function HomeScreen() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const fetchTrips = useCallback(async () => {
    try {
      const res = await apiRequest('/trips', 'GET', undefined, token);
      if (res.success) setTrips(res.data as any[]);
    } catch (_) {}
    finally { setLoading(false); setRefreshing(false); }
  }, [token]);

  useEffect(() => { fetchTrips(); }, [fetchTrips]);

  const filtered = trips.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase())
  );
  const active = filtered.filter(t => t.status !== 'COMPLETED');
  const previous = filtered.filter(t => t.status === 'COMPLETED');

  return (
    <SafeAreaView style={s.safe}>
      {/* Top bar */}
      <View style={s.topBar}>
        <View style={s.brandRow}>
          <Compass color="#00030a" size={24} />
          <Text style={s.brandName}>Traveloop</Text>
        </View>
        <TouchableOpacity onPress={() => router.push('/(tabs)/profile')} style={s.avatarBtn}>
          <Text style={s.avatarText}>{user?.firstName?.[0] || 'U'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); fetchTrips(); }} tintColor="#00696b" />}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Banner */}
        <View style={s.hero}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800' }}
            style={s.heroImg}
            contentFit="cover"
          />
          <View style={s.heroOverlay}>
            <Text style={s.heroTitle}>Adventure Awaits</Text>
            <Text style={s.heroSub}>Discover curated experiences and plan your dream escape.</Text>
            <TouchableOpacity style={s.heroCta} onPress={() => router.push('/create-trip')}>
              <Text style={s.heroCtaText}>Start Planning →</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
          <Search color="#75777e" size={20} style={{ marginRight: 12 }} />
          <TextInput
            style={s.searchInput}
            value={search}
            onChangeText={setSearch}
            placeholder="Search your trips..."
            placeholderTextColor="#75777e"
          />
          <TouchableOpacity onPress={() => router.push('/(tabs)/search')} style={s.discoverBtn}>
            <SlidersHorizontal color="#00696b" size={18} />
          </TouchableOpacity>
        </View>

        {/* Quick Actions */}
        <View style={s.quickActions}>
          <TouchableOpacity style={s.qBtn} onPress={() => router.push('/create-trip')}>
            <View style={[s.qIcon, { backgroundColor: '#e6f4f1' }]}><Plus color="#00696b" size={20} /></View>
            <Text style={s.qLabel}>New Trip</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.qBtn} onPress={() => router.push('/(tabs)/search')}>
            <View style={[s.qIcon, { backgroundColor: '#eef2ff' }]}><MapPin color="#6366f1" size={20} /></View>
            <Text style={s.qLabel}>Discover</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.qBtn} onPress={() => router.push('/(tabs)/community')}>
            <View style={[s.qIcon, { backgroundColor: '#fff7ed' }]}><Globe color="#f97316" size={20} /></View>
            <Text style={s.qLabel}>Community</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.qBtn} onPress={fetchTrips}>
            <View style={[s.qIcon, { backgroundColor: '#fef9e7' }]}><TrendingUp color="#f59e0b" size={20} /></View>
            <Text style={s.qLabel}>Refresh</Text>
          </TouchableOpacity>
        </View>

        {/* Top States */}
        <View style={s.section}>
          <View style={s.sectionHeader}>
            <Text style={s.sectionTitle}>Explore States</Text>
            <TouchableOpacity onPress={() => router.push('/(tabs)/search')}>
              <Text style={s.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {REGIONS.map((r, i) => (
              <TouchableOpacity key={i} style={s.regionCard} activeOpacity={0.85}
                onPress={() => {
                  if (r.route === 'India') {
                    router.push('/india-trips');
                  } else {
                    router.push('/(tabs)/search');
                  }
                }}>
                <Image source={{ uri: r.img }} style={s.regionImg} contentFit="cover" />
                <View style={s.regionOverlay}>
                  {r.route === 'India' && (
                    <View style={s.regionHotBadge}><Text style={s.regionHotText}>HOT 🔥</Text></View>
                  )}
                  <Text style={s.regionName}>{r.name}</Text>
                  <Text style={s.regionDests}>{r.dests}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Loading */}
        {loading && <ActivityIndicator color="#00696b" style={{ marginTop: 40 }} />}

        {/* Empty state */}
        {!loading && trips.length === 0 && (
          <View style={s.empty}>
            <Globe color="#c5c6ce" size={64} />
            <Text style={s.emptyTitle}>No trips yet</Text>
            <Text style={s.emptyText}>Tap "New Trip" to start your adventure</Text>
            <TouchableOpacity style={s.emptyBtn} onPress={() => router.push('/create-trip')}>
              <Plus color="#FFF" size={18} />
              <Text style={s.emptyBtnText}>Plan a Trip</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Active Journeys */}
        {active.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Active Journeys</Text>
              <TouchableOpacity onPress={fetchTrips}>
                <Text style={s.viewAllText}>Refresh</Text>
              </TouchableOpacity>
            </View>
            {active.map((trip, idx) => (
              <TripCard key={trip.id} trip={trip} idx={idx} />
            ))}
          </View>
        )}

        {/* Past Trips */}
        {previous.length > 0 && (
          <View style={s.section}>
            <View style={s.sectionHeader}>
              <Text style={s.sectionTitle}>Past Journeys</Text>
            </View>
            {previous.map((trip) => (
              <PastTripCard key={trip.id} trip={trip} />
            ))}
          </View>
        )}
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity style={s.fab} onPress={() => router.push('/create-trip')} activeOpacity={0.8}>
        <Plus color="#FFF" size={24} />
        <Text style={s.fabText}>PLAN A TRIP</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

function TripCard({ trip, idx }: { trip: any; idx: number }) {
  const router = useRouter();
  const status = STATUS_COLOR[trip.status] || STATUS_COLOR.PLANNING;
  const dur = Math.max(1, Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000));

  return (
    <TouchableOpacity activeOpacity={0.9} style={c.mainCard} onPress={() => router.push(`/trip/${trip.id}`)}>
      <Image source={{ uri: COVERS[idx % COVERS.length] }} style={c.mainImg} contentFit="cover" />
      <View style={c.mainOverlay}>
        <View style={c.badgeRow}>
          <View style={[c.badge, { backgroundColor: status.bg }]}>
            <Text style={[c.badgeText, { color: status.text }]}>{trip.status}</Text>
          </View>
          <Text style={c.dateText}>
            {new Date(trip.startDate).toLocaleDateString('en', { month: 'short', year: 'numeric' })}
          </Text>
        </View>
        <View>
          <Text style={c.mainTitle} numberOfLines={1}>{trip.title}</Text>
          <Text style={c.mainDesc}>{dur} day{dur > 1 ? 's' : ''} · {trip.stops?.length || 0} locations</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function PastTripCard({ trip }: { trip: any }) {
  const router = useRouter();
  return (
    <TouchableOpacity activeOpacity={0.9} style={c.pastCard} onPress={() => router.push(`/trip/${trip.id}`)}>
      <View style={c.pastContent}>
        <View style={c.pastBadgeRow}>
          <View style={[c.badge, { backgroundColor: '#e0e3e5' }]}>
            <Text style={[c.badgeText, { color: '#44474d' }]}>Completed</Text>
          </View>
        </View>
        <Text style={c.pastTitle} numberOfLines={1}>{trip.title}</Text>
        <Text style={c.pastDesc}>{trip.stops?.length || 0} locations</Text>
      </View>
      <View style={c.pastRight}>
        <ChevronRight color="#00696b" size={22} />
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#f7f9fb' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { fontSize: 24, fontWeight: '700', color: '#00030a' },
  avatarBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#00696b', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
  scroll: { flex: 1 },
  content: { paddingBottom: 120 },
  hero: { width: '100%', height: 220, position: 'relative', marginBottom: 20 },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,3,10,0.35)', padding: 24, justifyContent: 'flex-end' },
  heroTitle: { color: '#FFF', fontSize: 28, fontWeight: '800', marginBottom: 8 },
  heroSub: { color: 'rgba(255,255,255,0.9)', fontSize: 15, lineHeight: 22, marginBottom: 16 },
  heroCta: { alignSelf: 'flex-start', backgroundColor: '#00696b', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 20 },
  heroCtaText: { color: '#FFF', fontWeight: '700', fontSize: 14 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginHorizontal: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  searchInput: { flex: 1, color: '#191c1e', fontSize: 16 },
  discoverBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e6f4f1', justifyContent: 'center', alignItems: 'center' },
  quickActions: { flexDirection: 'row', paddingHorizontal: 20, gap: 12, marginBottom: 28 },
  qBtn: { flex: 1, alignItems: 'center', gap: 8 },
  qIcon: { width: 52, height: 52, borderRadius: 18, justifyContent: 'center', alignItems: 'center' },
  qLabel: { fontSize: 12, fontWeight: '600', color: '#44474d' },
  section: { marginBottom: 32, paddingHorizontal: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#191c1e' },
  viewAllText: { color: '#00696b', fontSize: 14, fontWeight: '600' },
  regionCard: { width: 150, borderRadius: 18, overflow: 'hidden', height: 200 },
  regionImg: { width: '100%', height: '100%' },
  regionOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end', padding: 14 },
  regionName: { fontSize: 17, fontWeight: '700', color: '#FFF' },
  regionDests: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 2 },
  regionHotBadge: { position: 'absolute', top: 10, right: 10, backgroundColor: '#FF6B35', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  regionHotText: { fontSize: 10, fontWeight: '800', color: '#FFF' },
  empty: { alignItems: 'center', paddingVertical: 60, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 24, fontWeight: '700', color: '#191c1e', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#75777e', textAlign: 'center', marginBottom: 24 },
  emptyBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#00696b', paddingHorizontal: 24, paddingVertical: 14, borderRadius: 24 },
  emptyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  fab: { position: 'absolute', bottom: 80, right: 20, backgroundColor: '#00696b', flexDirection: 'row', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 30, gap: 12, shadowColor: '#00696b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 12, elevation: 8 },
  fabText: { color: '#FFF', fontWeight: '700', fontSize: 13, letterSpacing: 0.5 },
});

const c = StyleSheet.create({
  mainCard: { height: 260, borderRadius: 20, marginBottom: 16, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 8, elevation: 4 },
  mainImg: { width: '100%', height: '100%' },
  mainOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 20, padding: 24, justifyContent: 'flex-end' },
  badgeRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 14 },
  badge: { paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700' },
  dateText: { color: 'rgba(255,255,255,0.85)', fontSize: 13 },
  mainTitle: { color: '#FFF', fontSize: 24, fontWeight: '800', marginBottom: 4 },
  mainDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  pastCard: { backgroundColor: '#ffffff', borderRadius: 18, padding: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  pastContent: { flex: 1 },
  pastBadgeRow: { marginBottom: 10 },
  pastTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e', marginBottom: 4 },
  pastDesc: { fontSize: 14, color: '#75777e' },
  pastRight: { paddingLeft: 12 },
});
