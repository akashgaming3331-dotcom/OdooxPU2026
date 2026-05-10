import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  ActivityIndicator, TextInput, Alert, Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, DollarSign, TrendingUp, TrendingDown, Edit2 } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

export default function BudgetScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [budget, setBudget] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showEdit, setShowEdit] = useState(false);
  const [limit, setLimit] = useState('');
  const [saving, setSaving] = useState(false);

  const fetchBudget = useCallback(async () => {
    const res = await apiRequest(`/trips/${id}/budget`, 'GET', undefined, token);
    if (res.success) setBudget(res.data);
    setLoading(false);
  }, [id, token]);

  useEffect(() => { fetchBudget(); }, [fetchBudget]);

  const saveBudget = async () => {
    if (!limit || isNaN(Number(limit))) { Alert.alert('Error', 'Enter a valid amount'); return; }
    setSaving(true);
    await apiRequest(`/trips/${id}/budget`, 'POST', { totalLimit: Number(limit) }, token);
    await fetchBudget();
    setSaving(false);
    setShowEdit(false);
  };

  const spent = budget?.spent || 0;
  const total = budget?.totalLimit || 0;
  const remaining = total - spent;
  const pct = total > 0 ? Math.min((spent / total) * 100, 100) : 0;

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft color="#191c1e" size={22} />
        </TouchableOpacity>
        <Text style={s.title}>Budget & Costs</Text>
        <TouchableOpacity style={s.editBtn} onPress={() => { setLimit(String(total)); setShowEdit(true); }}>
          <Edit2 color="#00696b" size={18} />
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {loading ? <ActivityIndicator color="#00696b" style={{ marginTop: 40 }} /> : (
          <>
            {!budget?.id ? (
              <View style={s.empty}>
                <DollarSign color="#00696b" size={56} />
                <Text style={s.emptyTitle}>No budget set</Text>
                <Text style={s.emptyText}>Set a total budget to track your spending</Text>
                <TouchableOpacity style={s.emptyBtn} onPress={() => setShowEdit(true)}>
                  <Text style={s.emptyBtnText}>Set Budget</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {/* Budget Ring */}
                <View style={s.budgetCard}>
                  <View style={s.budgetCircle}>
                    <Text style={s.budgetPct}>{Math.round(pct)}%</Text>
                    <Text style={s.budgetPctLabel}>spent</Text>
                  </View>
                  <View style={s.barBg}>
                    <View style={[s.barFill, { width: `${pct}%`, backgroundColor: pct > 80 ? '#ba1a1a' : '#00696b' }]} />
                  </View>
                </View>

                {/* Stats */}
                <View style={s.statsGrid}>
                  <View style={s.statCard}>
                    <TrendingUp color="#00696b" size={24} />
                    <Text style={s.statAmt}>${total.toFixed(2)}</Text>
                    <Text style={s.statLabel}>Total Budget</Text>
                  </View>
                  <View style={s.statCard}>
                    <TrendingDown color="#d76135" size={24} />
                    <Text style={s.statAmt}>${spent.toFixed(2)}</Text>
                    <Text style={s.statLabel}>Spent (Activities)</Text>
                  </View>
                  <View style={[s.statCard, { borderColor: remaining >= 0 ? '#00696b' : '#ba1a1a', borderWidth: 2 }]}>
                    <DollarSign color={remaining >= 0 ? '#00696b' : '#ba1a1a'} size={24} />
                    <Text style={[s.statAmt, { color: remaining >= 0 ? '#00696b' : '#ba1a1a' }]}>${Math.abs(remaining).toFixed(2)}</Text>
                    <Text style={s.statLabel}>{remaining >= 0 ? 'Remaining' : 'Over budget!'}</Text>
                  </View>
                </View>

                <Text style={s.note}>💡 Activity costs are tracked automatically when you add them in each city stop.</Text>
              </>
            )}
          </>
        )}
      </ScrollView>

      <Modal visible={showEdit} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Set Total Budget</Text>
            <TextInput style={s.field} value={limit} onChangeText={setLimit} placeholder="e.g. 3000" placeholderTextColor="#75777e" keyboardType="numeric" />
            <TouchableOpacity style={s.saveBtn} onPress={saveBudget} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={s.saveBtnText}>Save Budget</Text>}
            </TouchableOpacity>
            <TouchableOpacity style={s.cancelBtn} onPress={() => setShowEdit(false)}>
              <Text style={s.cancelBtnText}>Cancel</Text>
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
  content: { padding: 20, paddingBottom: 80 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#f7f9fb' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eceef0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 },
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: '#191c1e', marginLeft: 12 },
  editBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#e6f4f1', justifyContent: 'center', alignItems: 'center' },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#191c1e', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#75777e', textAlign: 'center' },
  emptyBtn: { marginTop: 24, backgroundColor: '#00696b', borderRadius: 16, paddingVertical: 14, paddingHorizontal: 28 },
  emptyBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  budgetCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 32, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 3, alignItems: 'center', marginBottom: 24 },
  budgetCircle: { width: 140, height: 140, borderRadius: 70, backgroundColor: '#f2f4f6', justifyContent: 'center', alignItems: 'center', marginBottom: 24, borderWidth: 4, borderColor: '#00696b' },
  budgetPct: { fontSize: 32, fontWeight: '800', color: '#191c1e' },
  budgetPctLabel: { fontSize: 14, color: '#75777e', fontWeight: '600' },
  barBg: { width: '100%', height: 12, backgroundColor: '#eceef0', borderRadius: 6, overflow: 'hidden' },
  barFill: { height: 12, borderRadius: 6 },
  statsGrid: { flexDirection: 'row', gap: 12, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#ffffff', borderRadius: 20, padding: 20, alignItems: 'center', gap: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statAmt: { fontSize: 18, fontWeight: '700', color: '#191c1e' },
  statLabel: { fontSize: 12, color: '#75777e', textAlign: 'center', fontWeight: '600' },
  note: { fontSize: 14, color: '#44474d', textAlign: 'center', backgroundColor: '#e6f4ea', borderRadius: 16, padding: 16, lineHeight: 22, borderWidth: 1, borderColor: '#34D399' },
  overlay: { flex: 1, backgroundColor: 'rgba(0,3,10,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#191c1e', marginBottom: 20 },
  field: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, color: '#191c1e', fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#c5c6ce' },
  saveBtn: { backgroundColor: '#00696b', borderRadius: 16, padding: 16, alignItems: 'center', marginBottom: 12 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  cancelBtn: { alignItems: 'center', padding: 14 },
  cancelBtnText: { color: '#44474d', fontSize: 16, fontWeight: '600' },
});
