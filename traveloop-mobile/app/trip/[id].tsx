import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  ActivityIndicator, Alert, Modal, TextInput
} from 'react-native';
import { useLocalSearchParams, useRouter, Link } from 'expo-router';
import { MapPin, ArrowLeft, Plus, Trash2, DollarSign, Package, FileText, ChevronRight, SlidersHorizontal, ChevronDown, Calendar } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

const STATUS_OPTS = ['PLANNING', 'UPCOMING', 'ONGOING', 'COMPLETED'];
const STATUS_COLOR: Record<string, { bg: string; border: string; text: string }> = {
  PLANNING:  { bg: '#d6e3ff', border: '#b6c7e9', text: '#081c36' },
  UPCOMING:  { bg: '#56f5f8', border: '#2ddbde', text: '#002020' },
  ONGOING:   { bg: '#ffdbcf', border: '#ffb59c', text: '#380c00' },
  COMPLETED: { bg: '#eceef0', border: '#e0e3e5', text: '#44474d' },
};

export default function TripDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'itinerary' | 'budget' | 'packing' | 'notes'>('itinerary');
  const [showAddStop, setShowAddStop] = useState(false);
  const [stopForm, setStopForm] = useState({ cityName: '', country: '', arrivalDate: '', departureDate: '' });
  const [addingStop, setAddingStop] = useState(false);

  const fetchTrip = useCallback(async () => {
    const res = await apiRequest(`/trips/${id}`, 'GET', undefined, token);
    if (res.success) setTrip(res.data);
    setLoading(false);
  }, [id, token]);

  useEffect(() => { fetchTrip(); }, [fetchTrip]);

  const updateStatus = async (status: string) => {
    await apiRequest(`/trips/${id}`, 'PUT', { status }, token);
    fetchTrip();
  };

  const addStop = async () => {
    if (!stopForm.cityName || !stopForm.country || !stopForm.arrivalDate || !stopForm.departureDate) {
      Alert.alert('Error', 'All fields required'); return;
    }
    setAddingStop(true);
    await apiRequest(`/trips/${id}/stops`, 'POST', {
      cityName: stopForm.cityName, country: stopForm.country,
      arrivalDate: new Date(stopForm.arrivalDate).toISOString(),
      departureDate: new Date(stopForm.departureDate).toISOString(),
    }, token);
    setAddingStop(false);
    setShowAddStop(false);
    setStopForm({ cityName: '', country: '', arrivalDate: '', departureDate: '' });
    fetchTrip();
  };

  if (loading) return (
    <SafeAreaView style={s.safe}><ActivityIndicator size="large" color="#00696b" style={{ flex: 1 }} /></SafeAreaView>
  );
  if (!trip) return null;

  const dur = Math.ceil((new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) / 86400000);
  const statusStyle = STATUS_COLOR[trip.status] || STATUS_COLOR.PLANNING;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft color="#191c1e" size={20} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.headerTitle}>Trip Details</Text>
        </View>
        <View style={[s.statusPill, { backgroundColor: statusStyle.bg, borderColor: statusStyle.border }]}>
          <Text style={[s.statusText, { color: statusStyle.text }]}>{trip.status}</Text>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Trip Title Banner */}
        <View style={s.banner}>
          <Text style={s.tripTitle}>{trip.title}</Text>
          {trip.description ? <Text style={s.tripDesc}>{trip.description}</Text> : null}
          <View style={s.tripMeta}>
            <View style={s.metaChip}>
              <Calendar color="#00696b" size={14} />
              <Text style={s.metaChipText}>{new Date(trip.startDate).toLocaleDateString('en', { month: 'short', day: 'numeric' })} – {new Date(trip.endDate).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
            </View>
            <View style={s.metaChip}>
              <MapPin color="#d76135" size={14} />
              <Text style={s.metaChipText}>{trip.stops?.length || 0} cities</Text>
            </View>
            <View style={s.metaChip}>
              <Text style={s.metaChipText}>⏱ {dur} days</Text>
            </View>
          </View>
        </View>

        {/* Status Switcher */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.statusRow}>
          {STATUS_OPTS.map(st => {
            const sc = STATUS_COLOR[st];
            const active = trip.status === st;
            return (
              <TouchableOpacity
                key={st}
                style={[s.statusChip, active && { backgroundColor: sc.bg, borderColor: sc.border }]}
                onPress={() => updateStatus(st)}
              >
                <Text style={[s.statusChipText, active && { color: sc.text }]}>{st}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Tab Navigation */}
        <View style={s.tabs}>
          {(['itinerary', 'budget', 'packing', 'notes'] as const).map(tab => (
            <TouchableOpacity key={tab} style={[s.tab, activeTab === tab && s.tabActive]} onPress={() => setActiveTab(tab)}>
              <Text style={[s.tabText, activeTab === tab && s.tabTextActive]}>
                {tab === 'itinerary' ? '🗺 Itinerary' : tab === 'budget' ? '💰 Budget' : tab === 'packing' ? '🎒 Packing' : '📝 Notes'}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── ITINERARY TAB ── */}
        {activeTab === 'itinerary' && (
          <View>
            <View style={s.controls}>
              <TouchableOpacity style={s.controlChip}><Text style={s.controlText}>Group by</Text><ChevronDown color="#75777e" size={13} /></TouchableOpacity>
              <TouchableOpacity style={s.controlChip}><SlidersHorizontal color="#75777e" size={13} /><Text style={s.controlText}>Filter</Text></TouchableOpacity>
              <TouchableOpacity style={s.controlChip}><Text style={s.controlText}>Sort by...</Text><ChevronDown color="#75777e" size={13} /></TouchableOpacity>
            </View>

            <TouchableOpacity style={s.addStopBtn} onPress={() => setShowAddStop(true)}>
              <Plus color="#00696b" size={18} />
              <Text style={s.addStopText}>Add City Stop</Text>
            </TouchableOpacity>

            {trip.stops?.length === 0 && (
              <View style={s.empty}>
                <MapPin color="#c5c6ce" size={48} />
                <Text style={s.emptyTitle}>No stops yet</Text>
                <Text style={s.emptyText}>Add cities to build your itinerary</Text>
              </View>
            )}

            {trip.stops?.map((stop: any, idx: number) => (
              <View key={stop.id} style={s.dayCard}>
                <View style={s.dayHeader}>
                  <View style={s.dayBadge}>
                    <Text style={s.dayBadgeText}>Day {idx + 1}</Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.dayCity}>{stop.city?.name}, {stop.city?.country}</Text>
                    <Text style={s.dayDates}>
                      {new Date(stop.arrivalDate).toLocaleDateString()} → {new Date(stop.departureDate).toLocaleDateString()}
                    </Text>
                  </View>
                  <TouchableOpacity onPress={() => Alert.alert('Delete', 'Remove stop?', [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Remove', style: 'destructive', onPress: async () => { await apiRequest(`/trips/${id}/stops/${stop.id}`, 'DELETE', undefined, token); fetchTrip(); } }
                  ])}>
                    <Trash2 color="#ba1a1a" size={18} />
                  </TouchableOpacity>
                </View>

                <View style={s.colHeader}>
                  <Text style={s.colHeaderText}>Physical Activity</Text>
                  <Text style={s.colHeaderText}>Expense</Text>
                </View>

                {stop.activities?.length === 0 ? (
                  <Text style={s.noActs}>No activities yet</Text>
                ) : stop.activities?.map((act: any) => (
                  <View key={act.id} style={s.actRow}>
                    <Text style={s.actName} numberOfLines={1}>{act.title}</Text>
                    <Text style={s.actCost}>{act.cost > 0 ? `$${act.cost}` : '–'}</Text>
                  </View>
                ))}

                <Link href={`/trip/${id}/stop/${stop.id}`} asChild>
                  <TouchableOpacity style={s.viewBtn}>
                    <Text style={s.viewBtnText}>Manage</Text>
                    <ChevronRight color="#FFF" size={14} />
                  </TouchableOpacity>
                </Link>
              </View>
            ))}
          </View>
        )}

        {/* ── BUDGET TAB ── */}
        {activeTab === 'budget' && (
          <Link href={`/trip/${id}/budget`} asChild>
            <TouchableOpacity style={s.tabRouteCard}>
              <View style={[s.iconBox, { backgroundColor: '#e6f4ea' }]}><DollarSign color="#0d652d" size={24} /></View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={s.tabRouteTitle}>Budget & Cost Tracker</Text>
                <Text style={s.tabRouteSub}>{trip.budget ? `$${trip.budget.totalLimit} total budget` : 'No budget set yet'}</Text>
              </View>
              <ChevronRight color="#c5c6ce" size={20} />
            </TouchableOpacity>
          </Link>
        )}

        {/* ── PACKING TAB ── */}
        {activeTab === 'packing' && (
          <Link href={`/trip/${id}/packing`} asChild>
            <TouchableOpacity style={s.tabRouteCard}>
              <View style={[s.iconBox, { backgroundColor: '#fef7e0' }]}><Package color="#f29900" size={24} /></View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={s.tabRouteTitle}>Packing Checklist</Text>
                <Text style={s.tabRouteSub}>{trip.checklists?.length || 0} items · Track what to pack</Text>
              </View>
              <ChevronRight color="#c5c6ce" size={20} />
            </TouchableOpacity>
          </Link>
        )}

        {/* ── NOTES TAB ── */}
        {activeTab === 'notes' && (
          <Link href={`/trip/${id}/notes`} asChild>
            <TouchableOpacity style={s.tabRouteCard}>
              <View style={[s.iconBox, { backgroundColor: '#f3e8fd' }]}><FileText color="#9333ea" size={24} /></View>
              <View style={{ marginLeft: 16, flex: 1 }}>
                <Text style={s.tabRouteTitle}>Trip Notes & Journal</Text>
                <Text style={s.tabRouteSub}>{trip.notes?.length || 0} notes</Text>
              </View>
              <ChevronRight color="#c5c6ce" size={20} />
            </TouchableOpacity>
          </Link>
        )}
      </ScrollView>

      {/* Add Stop Modal */}
      <Modal visible={showAddStop} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Add City Stop</Text>
            <Text style={s.fieldLabel}>City Name *</Text>
            <TextInput style={s.mInput} value={stopForm.cityName} onChangeText={v => setStopForm(f => ({ ...f, cityName: v }))} placeholder="e.g. Paris" placeholderTextColor="#75777e" />
            <Text style={s.fieldLabel}>Country *</Text>
            <TextInput style={s.mInput} value={stopForm.country} onChangeText={v => setStopForm(f => ({ ...f, country: v }))} placeholder="e.g. France" placeholderTextColor="#75777e" />
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>Arrival (YYYY-MM-DD)</Text>
                <TextInput style={s.mInput} value={stopForm.arrivalDate} onChangeText={v => setStopForm(f => ({ ...f, arrivalDate: v }))} placeholder="2024-07-01" placeholderTextColor="#75777e" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>Departure (YYYY-MM-DD)</Text>
                <TextInput style={s.mInput} value={stopForm.departureDate} onChangeText={v => setStopForm(f => ({ ...f, departureDate: v }))} placeholder="2024-07-05" placeholderTextColor="#75777e" />
              </View>
            </View>
            <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowAddStop(false)}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.confirmBtn} onPress={addStop} disabled={addingStop}>
                {addingStop ? <ActivityIndicator color="#FFF" /> : <Text style={s.confirmText}>Add Stop</Text>}
              </TouchableOpacity>
            </View>
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
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#f7f9fb' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eceef0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#191c1e' },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  statusText: { fontSize: 12, fontWeight: '700', letterSpacing: 0.5 },
  banner: { backgroundColor: '#ffffff', borderRadius: 20, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3 },
  tripTitle: { fontSize: 26, fontWeight: '800', color: '#191c1e', marginBottom: 8, letterSpacing: -0.5 },
  tripDesc: { fontSize: 15, color: '#44474d', marginBottom: 16, lineHeight: 22 },
  tripMeta: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f2f4f6', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  metaChipText: { fontSize: 13, color: '#44474d', fontWeight: '500' },
  statusRow: { flexDirection: 'row', gap: 8, marginBottom: 24 },
  statusChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 24, borderWidth: 1, borderColor: '#e0e3e5', backgroundColor: '#ffffff' },
  statusChipText: { fontSize: 13, fontWeight: '600', color: '#75777e' },
  tabs: { flexDirection: 'row', backgroundColor: '#eceef0', borderRadius: 16, padding: 4, marginBottom: 24 },
  tab: { flex: 1, paddingVertical: 12, borderRadius: 14, alignItems: 'center' },
  tabActive: { backgroundColor: '#ffffff', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
  tabText: { fontSize: 13, color: '#75777e', fontWeight: '600' },
  tabTextActive: { color: '#00696b', fontWeight: '700' },
  controls: { flexDirection: 'row', gap: 8, marginBottom: 16 },
  controlChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#eceef0' },
  controlText: { color: '#44474d', fontSize: 13, fontWeight: '600' },
  addStopBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e6f4f1', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 14, marginBottom: 20, borderWidth: 1, borderColor: '#00696b', alignSelf: 'flex-start' },
  addStopText: { color: '#00696b', fontWeight: '700', fontSize: 14 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e', marginTop: 16, marginBottom: 6 },
  emptyText: { fontSize: 14, color: '#75777e', textAlign: 'center' },
  dayCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  dayHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  dayBadge: { backgroundColor: '#f2f4f6', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 8, borderWidth: 1, borderColor: '#eceef0' },
  dayBadgeText: { color: '#00696b', fontWeight: '700', fontSize: 14 },
  dayCity: { fontSize: 18, fontWeight: '700', color: '#191c1e' },
  dayDates: { fontSize: 13, color: '#75777e', marginTop: 2, fontWeight: '500' },
  colHeader: { flexDirection: 'row', justifyContent: 'space-between', paddingBottom: 8, borderBottomWidth: 1, borderBottomColor: '#eceef0', marginBottom: 10 },
  colHeaderText: { fontSize: 12, fontWeight: '700', color: '#75777e', textTransform: 'uppercase', letterSpacing: 0.5 },
  noActs: { fontSize: 14, color: '#a0a3a8', textAlign: 'center', paddingVertical: 16, fontStyle: 'italic' },
  actRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f2f4f6' },
  actName: { flex: 1, fontSize: 15, color: '#191c1e', fontWeight: '500' },
  actCost: { fontSize: 15, color: '#00696b', fontWeight: '700' },
  viewBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#00696b', alignSelf: 'flex-end', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, marginTop: 16 },
  viewBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  tabRouteCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, marginTop: 8 },
  iconBox: { width: 48, height: 48, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  tabRouteTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e', marginBottom: 4 },
  tabRouteSub: { fontSize: 14, color: '#75777e', fontWeight: '500' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,3,10,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#191c1e', marginBottom: 20 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#44474d', marginBottom: 8 },
  mInput: { backgroundColor: '#ffffff', borderRadius: 14, padding: 14, color: '#191c1e', fontSize: 15, marginBottom: 16, borderWidth: 1, borderColor: '#c5c6ce' },
  cancelBtn: { flex: 1, backgroundColor: '#eceef0', borderRadius: 16, padding: 16, alignItems: 'center' },
  cancelText: { color: '#44474d', fontWeight: '700', fontSize: 15 },
  confirmBtn: { flex: 1, backgroundColor: '#00696b', borderRadius: 16, padding: 16, alignItems: 'center' },
  confirmText: { color: '#FFF', fontWeight: '700', fontSize: 15 },
});
