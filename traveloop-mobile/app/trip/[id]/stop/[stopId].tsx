import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  ActivityIndicator, TextInput, Alert, Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, MapPin, Plus, Trash2, Clock, DollarSign, Navigation } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

export default function StopScreen() {
  const { id, stopId } = useLocalSearchParams<{ id: string; stopId: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [activities, setActivities] = useState<any[]>([]);
  const [stop, setStop] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', cost: '', location: '' });
  const [adding, setAdding] = useState(false);

  const fetchData = useCallback(async () => {
    // Fetch trip to get stop info
    const tripRes = await apiRequest(`/trips/${id}`, 'GET', undefined, token);
    if (tripRes.success) {
      const found = (tripRes.data as any).stops?.find((s: any) => s.id === stopId);
      setStop(found);
      setActivities(found?.activities || []);
    }
    setLoading(false);
  }, [id, stopId, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const addActivity = async () => {
    if (!form.title.trim()) { Alert.alert('Error', 'Activity title is required'); return; }
    setAdding(true);
    const res = await apiRequest(`/stops/${stopId}/activities`, 'POST', {
      title: form.title,
      description: form.description,
      cost: form.cost ? Number(form.cost) : 0,
      location: form.location,
    }, token);
    setAdding(false);
    if (res.success) {
      setForm({ title: '', description: '', cost: '', location: '' });
      setShowAdd(false);
      fetchData();
    }
  };

  const deleteActivity = async (actId: string) => {
    Alert.alert('Delete', 'Remove this activity?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => { await apiRequest(`/stops/${stopId}/activities/${actId}`, 'DELETE', undefined, token); fetchData(); } }
    ]);
  };

  const totalCost = activities.reduce((sum, a) => sum + (a.cost || 0), 0);

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft color="#191c1e" size={22} />
        </TouchableOpacity>
        <View style={{ flex: 1, marginLeft: 12 }}>
          <Text style={s.title}>{stop?.city?.name || 'City Stop'}</Text>
          <Text style={s.subtitle}>{stop?.city?.country}</Text>
        </View>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
          <Plus color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Stop Info */}
        {stop && (
          <View style={s.infoCard}>
            <View style={s.infoRow}>
              <Clock color="#00696b" size={16} />
              <Text style={s.infoText}>
                {new Date(stop.arrivalDate).toLocaleDateString()} → {new Date(stop.departureDate).toLocaleDateString()}
              </Text>
            </View>
            <View style={s.infoRow}>
              <DollarSign color="#d76135" size={16} />
              <Text style={s.infoText}>Total activity cost: ${totalCost.toFixed(2)}</Text>
            </View>
            <View style={s.infoRow}>
              <Navigation color="#00696b" size={16} />
              <Text style={s.infoText}>{activities.length} activities planned</Text>
            </View>
          </View>
        )}

        <Text style={s.sectionTitle}>Activities</Text>

        {loading ? <ActivityIndicator color="#00696b" style={{ marginTop: 20 }} /> : (
          <>
            {activities.length === 0 && (
              <View style={s.empty}>
                <MapPin color="#c5c6ce" size={48} />
                <Text style={s.emptyTitle}>No activities yet</Text>
                <Text style={s.emptyText}>Add tours, restaurants, attractions and more</Text>
                <TouchableOpacity style={s.emptyBtn} onPress={() => setShowAdd(true)}>
                  <Text style={s.emptyBtnText}>Add Activity</Text>
                </TouchableOpacity>
              </View>
            )}

            {activities.map((act: any, idx: number) => (
              <View key={act.id} style={s.actCard}>
                <View style={s.actNum}>
                  <Text style={s.actNumText}>{idx + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={s.actTitle}>{act.title}</Text>
                  {act.description ? <Text style={s.actDesc}>{act.description}</Text> : null}
                  <View style={s.actMeta}>
                    {act.location ? (
                      <View style={s.metaItem}>
                        <Navigation color="#75777e" size={14} />
                        <Text style={s.metaText}>{act.location}</Text>
                      </View>
                    ) : null}
                    {act.cost > 0 ? (
                      <View style={s.metaItem}>
                        <DollarSign color="#00696b" size={14} />
                        <Text style={[s.metaText, { color: '#00696b', fontWeight: '700' }]}>${act.cost}</Text>
                      </View>
                    ) : null}
                  </View>
                </View>
                <TouchableOpacity onPress={() => deleteActivity(act.id)} style={s.deleteBtn}>
                  <Trash2 color="#ba1a1a" size={18} />
                </TouchableOpacity>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Add Activity</Text>
            <Text style={s.fieldLabel}>Activity Name *</Text>
            <TextInput style={s.field} value={form.title} onChangeText={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Visit Senso-ji Temple" placeholderTextColor="#75777e" />
            <Text style={s.fieldLabel}>Description</Text>
            <TextInput style={s.field} value={form.description} onChangeText={v => setForm(f => ({ ...f, description: v }))} placeholder="Short description..." placeholderTextColor="#75777e" />
            <View style={s.rowFields}>
              <View style={{ flex: 1, marginRight: 8 }}>
                <Text style={s.fieldLabel}>Cost ($)</Text>
                <TextInput style={s.field} value={form.cost} onChangeText={v => setForm(f => ({ ...f, cost: v }))} placeholder="0" placeholderTextColor="#75777e" keyboardType="numeric" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.fieldLabel}>Location</Text>
                <TextInput style={s.field} value={form.location} onChangeText={v => setForm(f => ({ ...f, location: v }))} placeholder="Address..." placeholderTextColor="#75777e" />
              </View>
            </View>
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={addActivity} disabled={adding}>
                {adding ? <ActivityIndicator color="#FFF" /> : <Text style={s.saveBtnText}>Add</Text>}
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
  content: { padding: 20, paddingBottom: 80 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#f7f9fb' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eceef0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  title: { fontSize: 22, fontWeight: '800', color: '#191c1e' },
  subtitle: { fontSize: 14, color: '#00696b', marginTop: 2, fontWeight: '600' },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00696b', justifyContent: 'center', alignItems: 'center', shadowColor: '#00696b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  infoCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 24, borderWidth: 1, borderColor: '#eceef0', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, gap: 12 },
  infoRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  infoText: { fontSize: 15, color: '#44474d', fontWeight: '500' },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: '#191c1e', marginBottom: 16 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#191c1e', marginTop: 16, marginBottom: 6 },
  emptyText: { fontSize: 15, color: '#75777e', textAlign: 'center' },
  emptyBtn: { marginTop: 24, backgroundColor: '#00696b', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  emptyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  actCard: { flexDirection: 'row', backgroundColor: '#ffffff', borderRadius: 20, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, alignItems: 'flex-start' },
  actNum: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#e6f4f1', justifyContent: 'center', alignItems: 'center', marginRight: 14, marginTop: 2 },
  actNumText: { color: '#00696b', fontWeight: '800', fontSize: 15 },
  actTitle: { fontSize: 17, fontWeight: '700', color: '#191c1e', marginBottom: 6 },
  actDesc: { fontSize: 14, color: '#75777e', marginBottom: 10, lineHeight: 20 },
  actMeta: { flexDirection: 'row', gap: 16, flexWrap: 'wrap' },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  metaText: { fontSize: 14, color: '#44474d', fontWeight: '500' },
  deleteBtn: { padding: 10, backgroundColor: '#ffdad6', borderRadius: 12, marginLeft: 10 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,3,10,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#191c1e', marginBottom: 20 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#44474d', marginBottom: 8 },
  field: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, color: '#191c1e', fontSize: 16, marginBottom: 16, borderWidth: 1, borderColor: '#c5c6ce' },
  rowFields: { flexDirection: 'row' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 8 },
  cancelBtn: { flex: 1, backgroundColor: '#eceef0', borderRadius: 16, padding: 16, alignItems: 'center' },
  cancelText: { color: '#44474d', fontWeight: '700', fontSize: 16 },
  saveBtn: { flex: 1, backgroundColor: '#00696b', borderRadius: 16, padding: 16, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
