import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  Alert, ActivityIndicator, Modal, TextInput
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, Clock, Star, Users, Wallet, X, CheckCircle } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

// 8 curated India trip templates
const INDIA_TEMPLATES = [
  {
    id: 't1',
    badge: '🏆 MOST POPULAR',
    badgeColor: '#FF6B35',
    title: 'Golden Triangle',
    subtitle: 'Delhi · Agra · Jaipur',
    desc: 'The classic India itinerary — Taj Mahal, Amber Fort, Qutub Minar, and India Gate. Perfect for first-timers.',
    duration: '7 Days',
    budget: '₹35,000',
    rating: 4.9,
    reviews: 3200,
    season: 'Oct – Mar',
    img: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=800',
    preStart: '2025-11-01',
    preEnd: '2025-11-08',
    description: 'Classic Golden Triangle tour: New Delhi sightseeing, Taj Mahal sunrise at Agra, and the Pink City of Jaipur. Includes Amber Fort, Hawa Mahal & local cuisine.',
  },
  {
    id: 't2',
    badge: '🌴 TRENDING',
    badgeColor: '#00696b',
    title: 'Kerala Backwaters',
    subtitle: 'Kochi · Alleppey · Munnar',
    desc: 'Houseboat rides on tranquil backwaters, spice plantations, and misty tea gardens.',
    duration: '6 Days',
    budget: '₹28,000',
    rating: 4.8,
    reviews: 2100,
    season: 'Sep – Feb',
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=800',
    preStart: '2025-10-15',
    preEnd: '2025-10-21',
    description: 'Explore God\'s Own Country — cruise Kerala backwaters on a traditional houseboat, visit Munnar\'s tea estates, and enjoy Kochi\'s colonial heritage.',
  },
  {
    id: 't3',
    badge: '🏖 BEACH ESCAPE',
    badgeColor: '#6366f1',
    title: 'Goa Sun & Sand',
    subtitle: 'North Goa · South Goa · Panjim',
    desc: 'Beautiful beaches, Portuguese architecture, vibrant nightlife and fresh seafood.',
    duration: '5 Days',
    budget: '₹22,000',
    rating: 4.7,
    reviews: 4100,
    season: 'Nov – Feb',
    img: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&q=80&w=800',
    preStart: '2025-12-20',
    preEnd: '2025-12-25',
    description: 'Sun, sand, and spice — explore Baga & Anjuna beaches, Old Goa churches, spice plantations, and the Goa Carnival vibe.',
  },
  {
    id: 't4',
    badge: '🏔 ADVENTURE',
    badgeColor: '#0ea5e9',
    title: 'Himachal Pradesh',
    subtitle: 'Shimla · Manali · Spiti',
    desc: 'Snow-capped peaks, mountain passes, Buddhist monasteries, and adventure sports.',
    duration: '10 Days',
    budget: '₹45,000',
    rating: 4.9,
    reviews: 1800,
    season: 'May – Jun / Sep – Oct',
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=800',
    preStart: '2025-06-01',
    preEnd: '2025-06-11',
    description: 'Trek through the mighty Himalayas — explore Rohtang Pass, Spiti Valley monasteries, and enjoy paragliding in Bir Billing.',
  },
  {
    id: 't5',
    badge: '🕌 SPIRITUAL',
    badgeColor: '#f59e0b',
    title: 'Varanasi & Rishikesh',
    subtitle: 'Varanasi · Prayagraj · Rishikesh',
    desc: 'The spiritual heart of India — Ganga Aarti, ghats, yoga, and Ganga rafting.',
    duration: '5 Days',
    budget: '₹18,000',
    rating: 4.8,
    reviews: 980,
    season: 'Oct – Mar',
    img: 'https://images.unsplash.com/photo-1561361058-c24e018f2e48?auto=format&fit=crop&q=80&w=800',
    preStart: '2025-11-10',
    preEnd: '2025-11-15',
    description: 'Experience India\'s spiritual soul — witness the Ganga Aarti at Varanasi\'s ancient ghats, then rejuvenate with yoga and meditation in Rishikesh.',
  },
  {
    id: 't6',
    badge: '🏙 CITY VIBES',
    badgeColor: '#ec4899',
    title: 'Mumbai City Break',
    subtitle: 'South Mumbai · Bandra · Juhu',
    desc: 'Gateway of India, Bollywood studios, street food, Marine Drive sunset.',
    duration: '4 Days',
    budget: '₹15,000',
    rating: 4.6,
    reviews: 2700,
    season: 'Nov – Feb',
    img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=800',
    preStart: '2025-12-01',
    preEnd: '2025-12-05',
    description: 'Discover the Maximum City — visit Gateway of India, Elephanta Caves, Dharavi, Juhu Beach and enjoy authentic Vada Pav & Pav Bhaji.',
  },
  {
    id: 't7',
    badge: '🏝 ISLAND PARADISE',
    badgeColor: '#14b8a6',
    title: 'Andaman Islands',
    subtitle: 'Port Blair · Havelock · Neil Island',
    desc: 'Crystal-clear waters, coral reefs, white sand beaches and scuba diving.',
    duration: '7 Days',
    budget: '₹38,000',
    rating: 4.9,
    reviews: 1200,
    season: 'Oct – May',
    img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&q=80&w=800',
    preStart: '2025-01-10',
    preEnd: '2025-01-17',
    description: 'Explore India\'s island paradise — snorkel at Elephant Beach, visit Cellular Jail, and relax on Radhanagar Beach (Asia\'s best beach).',
  },
  {
    id: 't8',
    badge: '🐯 WILDLIFE',
    badgeColor: '#84cc16',
    title: 'Rajasthan Royal Tour',
    subtitle: 'Jodhpur · Udaipur · Ranthambore',
    desc: 'Majestic palaces, tiger safari, blue city, Lake Palace — royal India.',
    duration: '9 Days',
    budget: '₹55,000',
    rating: 4.8,
    reviews: 1600,
    season: 'Oct – Mar',
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?auto=format&fit=crop&q=80&w=800',
    preStart: '2025-02-01',
    preEnd: '2025-02-10',
    description: 'Royal Rajasthan experience — explore the Blue City of Jodhpur, romantic Udaipur lake palaces, Ranthambore tiger reserve, and desert camel safari.',
  },
];

export default function IndiaTripsScreen() {
  const router = useRouter();
  const { token } = useAuth();
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [creating, setCreating] = useState(false);
  const [customForm, setCustomForm] = useState({ startDate: '', endDate: '' });

  const openTemplate = (t: any) => {
    setSelectedTemplate(t);
    setCustomForm({ startDate: t.preStart, endDate: t.preEnd });
  };

  const createFromTemplate = async () => {
    if (!customForm.startDate || !customForm.endDate) {
      Alert.alert('Error', 'Please enter start and end dates'); return;
    }
    
    let parsedStart, parsedEnd;
    try {
      parsedStart = new Date(customForm.startDate).toISOString();
      parsedEnd = new Date(customForm.endDate).toISOString();
    } catch (e) {
      Alert.alert('Invalid Date', 'Please ensure dates are in YYYY-MM-DD format.');
      return;
    }

    setCreating(true);
    const res = await apiRequest('/trips', 'POST', {
      title: `India: ${selectedTemplate.title}`,
      description: selectedTemplate.description,
      startDate: parsedStart,
      endDate: parsedEnd,
    }, token);
    setCreating(false);
    
    if (res.success && res.data) {
      setSelectedTemplate(null);
      Alert.alert('Trip Created! 🎉', `"India: ${selectedTemplate.title}" is ready. Start adding stops!`, [
        { text: 'View Trip', onPress: () => router.push(`/trip/${(res.data as any).id}`) },
        { text: 'Stay here', style: 'cancel' },
      ]);
    } else {
      Alert.alert('Error', res.message || 'Could not create trip. Check backend connection.');
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft color="#191c1e" size={22} />
        </TouchableOpacity>
        <View style={s.headerTitle}>
          <Text style={s.headerText}>🇮🇳 Explore India</Text>
          <Text style={s.headerSub}>Tap any template to plan your trip</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Hero */}
        <View style={s.hero}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=900' }}
            style={s.heroImg}
            contentFit="cover"
          />
          <View style={s.heroOverlay}>
            <Text style={s.heroFlag}>🇮🇳</Text>
            <Text style={s.heroTitle}>Incredible India</Text>
            <Text style={s.heroSub}>38 curated destinations across India's most iconic regions</Text>
            <View style={s.heroStats}>
              <View style={s.heroStat}><Text style={s.heroStatNum}>8</Text><Text style={s.heroStatLabel}>Templates</Text></View>
              <View style={s.heroStatDivider} />
              <View style={s.heroStat}><Text style={s.heroStatNum}>28+</Text><Text style={s.heroStatLabel}>States</Text></View>
              <View style={s.heroStatDivider} />
              <View style={s.heroStat}><Text style={s.heroStatNum}>4.8★</Text><Text style={s.heroStatLabel}>Avg Rating</Text></View>
            </View>
          </View>
        </View>

        <Text style={s.sectionTitle}>Choose a Trip Template</Text>
        <Text style={s.sectionSub}>One tap to pre-fill everything. Customize dates then create!</Text>

        {INDIA_TEMPLATES.map(t => (
          <TouchableOpacity key={t.id} style={s.card} activeOpacity={0.88} onPress={() => openTemplate(t)}>
            <View style={s.cardImgWrap}>
              <Image source={{ uri: t.img }} style={s.cardImg} contentFit="cover" />
              <View style={[s.cardBadge, { backgroundColor: t.badgeColor }]}>
                <Text style={s.cardBadgeText}>{t.badge}</Text>
              </View>
              <View style={s.cardDuration}>
                <Clock color="#191c1e" size={12} />
                <Text style={s.cardDurationText}>{t.duration}</Text>
              </View>
            </View>

            <View style={s.cardBody}>
              <Text style={s.cardTitle}>{t.title}</Text>
              <View style={s.cardLocationRow}>
                <MapPin color="#00696b" size={14} />
                <Text style={s.cardLocation}>{t.subtitle}</Text>
              </View>
              <Text style={s.cardDesc} numberOfLines={2}>{t.desc}</Text>

              <View style={s.cardMeta}>
                <View style={s.cardMetaItem}>
                  <Star color="#f59e0b" size={14} fill="#f59e0b" />
                  <Text style={s.cardMetaText}>{t.rating} ({(t.reviews / 1000).toFixed(1)}k)</Text>
                </View>
                <View style={s.cardMetaItem}>
                  <Calendar color="#75777e" size={14} />
                  <Text style={s.cardMetaText}>{t.season}</Text>
                </View>
                <View style={s.cardMetaItem}>
                  <Wallet color="#00696b" size={14} />
                  <Text style={s.cardMetaText}>{t.budget}</Text>
                </View>
              </View>

              <TouchableOpacity style={s.useTemplateBtn} onPress={() => openTemplate(t)}>
                <Text style={s.useTemplateBtnText}>Use this Template →</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Template Confirm Modal */}
      <Modal visible={!!selectedTemplate} animationType="slide" transparent>
        <View style={m.overlay}>
          <View style={m.modal}>
            {selectedTemplate && (
              <>
                <View style={m.top}>
                  <View style={{ flex: 1 }}>
                    <Text style={m.title}>{selectedTemplate.title}</Text>
                    <Text style={m.subtitle}>{selectedTemplate.subtitle}</Text>
                  </View>
                  <TouchableOpacity style={m.closeBtn} onPress={() => setSelectedTemplate(null)}>
                    <X color="#191c1e" size={22} />
                  </TouchableOpacity>
                </View>

                {/* Trip preview */}
                <View style={m.previewCard}>
                  <View style={m.previewRow}>
                    <Clock color="#00696b" size={16} />
                    <Text style={m.previewText}>Duration: {selectedTemplate.duration}</Text>
                  </View>
                  <View style={m.previewRow}>
                    <Wallet color="#00696b" size={16} />
                    <Text style={m.previewText}>Est. Budget: {selectedTemplate.budget}</Text>
                  </View>
                  <View style={m.previewRow}>
                    <Star color="#f59e0b" size={16} />
                    <Text style={m.previewText}>Rating: {selectedTemplate.rating} ★ ({selectedTemplate.reviews.toLocaleString()} reviews)</Text>
                  </View>
                  <View style={m.previewRow}>
                    <CheckCircle color="#00696b" size={16} />
                    <Text style={m.previewText}>Best season: {selectedTemplate.season}</Text>
                  </View>
                </View>

                <Text style={m.descText}>{selectedTemplate.description}</Text>

                {/* Date pickers */}
                <View style={m.dateRow}>
                  <View style={{ flex: 1, marginRight: 8 }}>
                    <Text style={m.label}>Start Date</Text>
                    <TextInput
                      style={m.input}
                      value={customForm.startDate}
                      onChangeText={v => setCustomForm(f => ({ ...f, startDate: v }))}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#75777e"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={m.label}>End Date</Text>
                    <TextInput
                      style={m.input}
                      value={customForm.endDate}
                      onChangeText={v => setCustomForm(f => ({ ...f, endDate: v }))}
                      placeholder="YYYY-MM-DD"
                      placeholderTextColor="#75777e"
                    />
                  </View>
                </View>

                <TouchableOpacity style={m.createBtn} onPress={createFromTemplate} disabled={creating}>
                  {creating
                    ? <ActivityIndicator color="#FFF" />
                    : <Text style={m.createBtnText}>🚀 Create India Trip</Text>}
                </TouchableOpacity>

                <TouchableOpacity style={m.customBtn} onPress={() => {
                  setSelectedTemplate(null);
                  router.push('/create-trip');
                }}>
                  <Text style={m.customBtnText}>Customize from scratch instead</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#f7f9fb', borderBottomWidth: 1, borderBottomColor: '#eceef0' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eceef0', marginRight: 14 },
  headerTitle: { flex: 1 },
  headerText: { fontSize: 22, fontWeight: '800', color: '#191c1e' },
  headerSub: { fontSize: 13, color: '#75777e', marginTop: 2 },
  content: { paddingBottom: 60 },
  hero: { width: '100%', height: 240, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)', padding: 24, justifyContent: 'flex-end' },
  heroFlag: { fontSize: 40, marginBottom: 8 },
  heroTitle: { fontSize: 36, fontWeight: '900', color: '#FFF', letterSpacing: -0.5, marginBottom: 8 },
  heroSub: { fontSize: 15, color: 'rgba(255,255,255,0.85)', lineHeight: 22, marginBottom: 20 },
  heroStats: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 16, padding: 14, gap: 8 },
  heroStat: { flex: 1, alignItems: 'center' },
  heroStatNum: { fontSize: 20, fontWeight: '800', color: '#FFF' },
  heroStatLabel: { fontSize: 11, color: 'rgba(255,255,255,0.75)', marginTop: 2 },
  heroStatDivider: { width: 1, height: 32, backgroundColor: 'rgba(255,255,255,0.3)' },
  sectionTitle: { fontSize: 26, fontWeight: '800', color: '#191c1e', paddingHorizontal: 20, paddingTop: 28, marginBottom: 6 },
  sectionSub: { fontSize: 15, color: '#75777e', paddingHorizontal: 20, marginBottom: 24, lineHeight: 22 },
  card: { marginHorizontal: 20, marginBottom: 20, backgroundColor: '#ffffff', borderRadius: 24, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
  cardImgWrap: { height: 200, position: 'relative' },
  cardImg: { width: '100%', height: '100%' },
  cardBadge: { position: 'absolute', top: 16, left: 16, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  cardBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '800' },
  cardDuration: { position: 'absolute', bottom: 14, right: 14, flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(255,255,255,0.92)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  cardDurationText: { fontSize: 12, fontWeight: '700', color: '#191c1e' },
  cardBody: { padding: 20 },
  cardTitle: { fontSize: 22, fontWeight: '800', color: '#191c1e', marginBottom: 6 },
  cardLocationRow: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 10 },
  cardLocation: { fontSize: 14, color: '#00696b', fontWeight: '600' },
  cardDesc: { fontSize: 14, color: '#44474d', lineHeight: 22, marginBottom: 16 },
  cardMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20, paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: '#eceef0' },
  cardMetaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  cardMetaText: { fontSize: 13, color: '#44474d', fontWeight: '500' },
  useTemplateBtn: { backgroundColor: '#00696b', borderRadius: 16, paddingVertical: 15, alignItems: 'center', shadowColor: '#00696b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 5 },
  useTemplateBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 44, maxHeight: '92%' },
  top: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 20 },
  title: { fontSize: 24, fontWeight: '800', color: '#191c1e' },
  subtitle: { fontSize: 14, color: '#00696b', fontWeight: '600', marginTop: 4 },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eceef0', justifyContent: 'center', alignItems: 'center', marginLeft: 12 },
  previewCard: { backgroundColor: '#e6f4f1', borderRadius: 18, padding: 16, marginBottom: 16, gap: 10 },
  previewRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  previewText: { fontSize: 14, color: '#002020', fontWeight: '500', flex: 1 },
  descText: { fontSize: 14, color: '#44474d', lineHeight: 22, marginBottom: 20 },
  dateRow: { flexDirection: 'row', marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '700', color: '#44474d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#eceef0', borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, color: '#191c1e', fontSize: 15 },
  createBtn: { backgroundColor: '#FF6B35', borderRadius: 18, paddingVertical: 18, alignItems: 'center', marginBottom: 12, shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 8 },
  createBtnText: { color: '#FFF', fontWeight: '800', fontSize: 17 },
  customBtn: { alignItems: 'center', paddingVertical: 10 },
  customBtnText: { color: '#75777e', fontSize: 14, fontWeight: '500' },
});
