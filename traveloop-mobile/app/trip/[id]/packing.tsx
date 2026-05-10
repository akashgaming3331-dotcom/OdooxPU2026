import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  ActivityIndicator, TextInput, Alert, Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Package, Plus, Trash2, Check } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

const CATEGORIES = ['Clothing', 'Toiletries', 'Electronics', 'Documents', 'Medical', 'Other'];

export default function PackingScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Other');
  const [adding, setAdding] = useState(false);

  const fetchItems = useCallback(async () => {
    const res = await apiRequest(`/trips/${id}/packing`, 'GET', undefined, token);
    if (res.success) setItems(res.data as any[]);
    setLoading(false);
  }, [id, token]);

  useEffect(() => { fetchItems(); }, [fetchItems]);

  const addItem = async () => {
    if (!itemName.trim()) { Alert.alert('Error', 'Item name required'); return; }
    setAdding(true);
    await apiRequest(`/trips/${id}/packing`, 'POST', { itemName: itemName.trim(), category }, token);
    setItemName('');
    await fetchItems();
    setAdding(false);
    setShowAdd(false);
  };

  const toggleItem = async (itemId: string, isPacked: boolean) => {
    await apiRequest(`/trips/${id}/packing/${itemId}/toggle`, 'PATCH', { isPacked: !isPacked }, token);
    fetchItems();
  };

  const deleteItem = async (itemId: string) => {
    await apiRequest(`/trips/${id}/packing/${itemId}`, 'DELETE', undefined, token);
    fetchItems();
  };

  const packed = items.filter(i => i.isPacked).length;
  const grouped = CATEGORIES.map(cat => ({
    cat,
    items: items.filter(i => i.category === cat),
  })).filter(g => g.items.length > 0);
  const otherItems = items.filter(i => !CATEGORIES.includes(i.category));
  if (otherItems.length > 0) grouped.push({ cat: 'Other', items: otherItems });

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft color="#191c1e" size={22} />
        </TouchableOpacity>
        <Text style={s.title}>Packing List</Text>
        <TouchableOpacity style={s.addBtn} onPress={() => setShowAdd(true)}>
          <Plus color="#ffffff" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Progress */}
        {items.length > 0 && (
          <View style={s.progress}>
            <View style={s.progressTop}>
              <Text style={s.progressText}>{packed}/{items.length} packed</Text>
              <Text style={s.progressPct}>{Math.round((packed / items.length) * 100)}%</Text>
            </View>
            <View style={s.barBg}>
              <View style={[s.barFill, { width: `${(packed / items.length) * 100}%` }]} />
            </View>
          </View>
        )}

        {loading ? <ActivityIndicator color="#00696b" style={{ marginTop: 40 }} /> : (
          <>
            {items.length === 0 && (
              <View style={s.empty}>
                <Package color="#00696b" size={56} />
                <Text style={s.emptyTitle}>Nothing packed yet</Text>
                <Text style={s.emptyText}>Add items to track what you need to bring</Text>
              </View>
            )}

            {grouped.map(({ cat, items: catItems }) => (
              <View key={cat} style={s.group}>
                <Text style={s.groupTitle}>{cat}</Text>
                {catItems.map((item: any) => (
                  <View key={item.id} style={s.item}>
                    <TouchableOpacity style={[s.checkbox, item.isPacked && s.checkboxDone]} onPress={() => toggleItem(item.id, item.isPacked)}>
                      {item.isPacked && <Check color="#FFF" size={14} />}
                    </TouchableOpacity>
                    <Text style={[s.itemText, item.isPacked && s.itemTextDone]}>{item.itemName}</Text>
                    <TouchableOpacity onPress={() => deleteItem(item.id)} style={s.delBtn}>
                      <Trash2 color="#ba1a1a" size={18} />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            ))}
          </>
        )}
      </ScrollView>

      <Modal visible={showAdd} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <Text style={s.modalTitle}>Add Item</Text>
            <TextInput style={s.field} value={itemName} onChangeText={setItemName} placeholder="e.g. Sunscreen" placeholderTextColor="#75777e" autoFocus />
            <Text style={s.catLabel}>Category</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
              {CATEGORIES.map(c => (
                <TouchableOpacity key={c} style={[s.catChip, category === c && s.catChipActive]} onPress={() => setCategory(c)}>
                  <Text style={[s.catChipText, category === c && s.catChipTextActive]}>{c}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            <View style={s.modalBtns}>
              <TouchableOpacity style={s.cancelBtn} onPress={() => setShowAdd(false)}>
                <Text style={s.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={s.saveBtn} onPress={addItem} disabled={adding}>
                {adding ? <ActivityIndicator color="#FFF" /> : <Text style={s.saveBtnText}>Add Item</Text>}
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
  title: { flex: 1, fontSize: 20, fontWeight: '700', color: '#191c1e', marginLeft: 12 },
  addBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#00696b', justifyContent: 'center', alignItems: 'center', shadowColor: '#00696b', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 4 },
  progress: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  progressTop: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  progressText: { fontSize: 14, color: '#44474d', fontWeight: '600' },
  progressPct: { fontSize: 16, color: '#00696b', fontWeight: '800' },
  barBg: { height: 10, backgroundColor: '#eceef0', borderRadius: 5, overflow: 'hidden' },
  barFill: { height: 10, backgroundColor: '#00696b', borderRadius: 5 },
  empty: { alignItems: 'center', paddingVertical: 80 },
  emptyTitle: { fontSize: 22, fontWeight: '700', color: '#191c1e', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#75777e', textAlign: 'center' },
  group: { marginBottom: 24 },
  groupTitle: { fontSize: 13, fontWeight: '700', color: '#00696b', marginBottom: 12, textTransform: 'uppercase', letterSpacing: 1 },
  item: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, padding: 16, marginBottom: 10, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 3, elevation: 1 },
  checkbox: { width: 26, height: 26, borderRadius: 8, borderWidth: 2, borderColor: '#c5c6ce', justifyContent: 'center', alignItems: 'center', marginRight: 14, backgroundColor: '#f2f4f6' },
  checkboxDone: { backgroundColor: '#00696b', borderColor: '#00696b' },
  itemText: { flex: 1, fontSize: 16, color: '#191c1e', fontWeight: '500' },
  itemTextDone: { textDecorationLine: 'line-through', color: '#a0a3a8' },
  delBtn: { padding: 8, backgroundColor: '#ffdad6', borderRadius: 12 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,3,10,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#191c1e', marginBottom: 20 },
  field: { backgroundColor: '#ffffff', borderRadius: 14, padding: 16, color: '#191c1e', fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#c5c6ce' },
  catLabel: { fontSize: 14, fontWeight: '600', color: '#44474d', marginBottom: 12 },
  catChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, borderWidth: 1, borderColor: '#eceef0', backgroundColor: '#ffffff' },
  catChipActive: { backgroundColor: '#e6f4f1', borderColor: '#00696b' },
  catChipText: { color: '#75777e', fontSize: 14, fontWeight: '600' },
  catChipTextActive: { color: '#00696b', fontWeight: '700' },
  modalBtns: { flexDirection: 'row', gap: 12, marginTop: 12 },
  cancelBtn: { flex: 1, backgroundColor: '#eceef0', borderRadius: 16, padding: 16, alignItems: 'center' },
  cancelText: { color: '#44474d', fontWeight: '700', fontSize: 16 },
  saveBtn: { flex: 1, backgroundColor: '#00696b', borderRadius: 16, padding: 16, alignItems: 'center' },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
