import React, { useState } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  TextInput, ActivityIndicator, Alert
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Calendar, DollarSign, Gem, PiggyBank } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

const SUGGESTIONS = [
  {
    id: '1', label: 'TRENDING', title: 'Jaipur: The Pink City', desc: 'Majestic forts & palaces', fullSpan: true,
    img: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: '2', label: '', title: 'Kerala Backwaters', desc: '', fullSpan: false,
    img: 'https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3', label: '', title: 'Himalayan Escapes', desc: '', fullSpan: false,
    img: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&q=80&w=400',
  },
];

const BUDGETS = [
  { id: 'economic', label: 'Economic', icon: PiggyBank },
  { id: 'moderate', label: 'Moderate', icon: DollarSign },
  { id: 'luxury', label: 'Luxury', icon: Gem },
];

export default function CreateTripScreen() {
  const { token } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ title: '', description: '', startDate: '', endDate: '' });
  const [budget, setBudget] = useState('moderate');
  const [creating, setCreating] = useState(false);

  const createTrip = async () => {
    if (!form.title || !form.startDate || !form.endDate) {
      Alert.alert('Error', 'Trip name, start date and end date are required'); return;
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
      title: form.title,
      description: form.description,
      startDate: parsedStart,
      endDate: parsedEnd,
    }, token);
    setCreating(false);
    
    if (res.success && res.data) {
      router.replace(`/trip/${(res.data as any).id}`);
    } else {
      Alert.alert('Error', res.message || 'Could not create trip. Please try again.');
    }
  };

  const useSuggestion = (title: string) => {
    setForm(f => ({ ...f, title }));
  };

  return (
    <SafeAreaView style={s.safe}>
      {/* Header */}
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft color="#191c1e" size={22} />
        </TouchableOpacity>
        <Text style={s.headerTitle}>Traveloop</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Title */}
        <View style={s.titleSection}>
          <Text style={s.pageTitle}>Create a New Trip</Text>
          <Text style={s.pageSub}>Start your next adventure by filling in the details below.</Text>
        </View>

        {/* Form card */}
        <View style={s.formCard}>
          {/* Destination */}
          <View style={s.field}>
            <Text style={s.label}>DESTINATION</Text>
            <View style={s.iconInput}>
              <MapPin color="#75777e" size={20} style={{ marginRight: 12 }} />
              <TextInput
                style={s.iconInputText}
                value={form.title}
                onChangeText={v => setForm(f => ({ ...f, title: v }))}
                placeholder="Where do you want to go?"
                placeholderTextColor="#75777e"
              />
            </View>
          </View>

          {/* Description */}
          <View style={s.field}>
            <Text style={s.label}>DESCRIPTION</Text>
            <TextInput
              style={[s.textArea]}
              value={form.description}
              onChangeText={v => setForm(f => ({ ...f, description: v }))}
              placeholder="What's this trip about?"
              placeholderTextColor="#75777e"
              multiline
            />
          </View>

          {/* Date range */}
          <View style={s.dateRow}>
            <View style={{ flex: 1, marginRight: 10 }}>
              <Text style={s.label}>START DATE</Text>
              <View style={s.iconInput}>
                <Calendar color="#75777e" size={18} style={{ marginRight: 10 }} />
                <TextInput
                  style={s.iconInputText}
                  value={form.startDate}
                  onChangeText={v => setForm(f => ({ ...f, startDate: v }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#75777e"
                />
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={s.label}>END DATE</Text>
              <View style={s.iconInput}>
                <Calendar color="#75777e" size={18} style={{ marginRight: 10 }} />
                <TextInput
                  style={s.iconInputText}
                  value={form.endDate}
                  onChangeText={v => setForm(f => ({ ...f, endDate: v }))}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor="#75777e"
                />
              </View>
            </View>
          </View>

          {/* Budget level */}
          <View style={s.field}>
            <Text style={s.label}>BUDGET LEVEL</Text>
            <View style={s.budgetRow}>
              {BUDGETS.map(b => {
                const Icon = b.icon;
                const active = budget === b.id;
                return (
                  <TouchableOpacity
                    key={b.id}
                    style={[s.budgetBtn, active && s.budgetBtnActive]}
                    onPress={() => setBudget(b.id)}
                  >
                    <Icon color={active ? '#002020' : '#75777e'} size={24} />
                    <Text style={[s.budgetLabel, active && s.budgetLabelActive]}>{b.label}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Create button */}
          <TouchableOpacity style={s.createBtn} onPress={createTrip} disabled={creating} activeOpacity={0.85}>
            {creating ? <ActivityIndicator color="#FFF" /> : <Text style={s.createBtnText}>Create Itinerary</Text>}
          </TouchableOpacity>
        </View>

        {/* Inspiration section */}
        <View style={s.suggestionsSection}>
          <View style={s.suggestionsHeader}>
            <Text style={s.suggestionsTitle}>Inspiration for you</Text>
            <TouchableOpacity><Text style={s.viewAllText}>View all</Text></TouchableOpacity>
          </View>

          {/* Featured suggestion */}
          <TouchableOpacity onPress={() => useSuggestion(SUGGESTIONS[0].title)} style={s.featuredSugg} activeOpacity={0.9}>
            <Image source={{ uri: SUGGESTIONS[0].img }} style={s.featuredSuggImg} contentFit="cover" />
            <View style={s.featuredSuggOverlay}>
              <View style={s.trendingBadge}><Text style={s.trendingBadgeText}>TRENDING</Text></View>
              <Text style={s.featuredSuggTitle}>{SUGGESTIONS[0].title}</Text>
              <Text style={s.featuredSuggDesc}>{SUGGESTIONS[0].desc}</Text>
            </View>
          </TouchableOpacity>

          {/* 2-column suggestions */}
          <View style={s.suggRow}>
            {SUGGESTIONS.slice(1).map(s2 => (
              <TouchableOpacity key={s2.id} style={s.suggCard} onPress={() => useSuggestion(s2.title)} activeOpacity={0.9}>
                <Image source={{ uri: s2.img }} style={s.suggCardImg} contentFit="cover" />
                <View style={s.suggCardOverlay}>
                  <Text style={s.suggCardTitle}>{s2.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },
  scroll: { flex: 1 },
  content: { padding: 20, paddingBottom: 60 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 12, backgroundColor: '#f7f9fb', borderBottomWidth: 1, borderBottomColor: '#eceef0' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eceef0', marginRight: 14 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#00030a' },
  titleSection: { marginBottom: 24, marginTop: 12 },
  pageTitle: { fontSize: 34, fontWeight: '800', color: '#191c1e', letterSpacing: -0.5, marginBottom: 8 },
  pageSub: { fontSize: 16, color: '#44474d', lineHeight: 24 },
  formCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 12, elevation: 3, marginBottom: 32, borderWidth: 1, borderColor: '#e6e8ea' },
  field: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '700', color: '#191c1e', marginBottom: 10, letterSpacing: 0.5, textTransform: 'uppercase' },
  iconInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eceef0', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14 },
  iconInputText: { flex: 1, color: '#191c1e', fontSize: 15 },
  textArea: { backgroundColor: '#eceef0', borderRadius: 16, padding: 16, color: '#191c1e', fontSize: 15, minHeight: 80, textAlignVertical: 'top' },
  dateRow: { flexDirection: 'row', marginBottom: 20 },
  budgetRow: { flexDirection: 'row', gap: 12 },
  budgetBtn: { flex: 1, alignItems: 'center', paddingVertical: 16, borderRadius: 16, borderWidth: 2, borderColor: '#eceef0', backgroundColor: '#f2f4f6', gap: 8 },
  budgetBtnActive: { borderColor: '#2ddbde', backgroundColor: '#56f5f8' },
  budgetLabel: { fontSize: 13, fontWeight: '600', color: '#75777e' },
  budgetLabelActive: { color: '#002020', fontWeight: '700' },
  createBtn: { backgroundColor: '#FF6B35', borderRadius: 32, paddingVertical: 18, alignItems: 'center', marginTop: 8, shadowColor: '#FF6B35', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.3, shadowRadius: 14, elevation: 8 },
  createBtnText: { color: '#FFF', fontWeight: '800', fontSize: 17, letterSpacing: 0.3 },
  suggestionsSection: { marginBottom: 20 },
  suggestionsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  suggestionsTitle: { fontSize: 22, fontWeight: '700', color: '#191c1e' },
  viewAllText: { fontSize: 14, color: '#00696b', fontWeight: '600' },
  featuredSugg: { borderRadius: 24, overflow: 'hidden', height: 200, marginBottom: 16 },
  featuredSuggImg: { width: '100%', height: '100%' },
  featuredSuggOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', padding: 20, justifyContent: 'flex-end' },
  trendingBadge: { position: 'absolute', top: 16, left: 16, backgroundColor: '#56f5f8', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  trendingBadgeText: { fontSize: 10, fontWeight: '800', color: '#002020' },
  featuredSuggTitle: { color: '#FFF', fontSize: 22, fontWeight: '700', marginBottom: 4 },
  featuredSuggDesc: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  suggRow: { flexDirection: 'row', gap: 14 },
  suggCard: { flex: 1, height: 160, borderRadius: 20, overflow: 'hidden' },
  suggCardImg: { width: '100%', height: '100%' },
  suggCardOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end', padding: 14 },
  suggCardTitle: { color: '#FFF', fontSize: 15, fontWeight: '700' },
});
