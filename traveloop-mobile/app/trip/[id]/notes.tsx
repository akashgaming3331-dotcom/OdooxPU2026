import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  ActivityIndicator, TextInput, Alert, Modal
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ArrowLeft, Plus, Search, ChevronDown, SlidersHorizontal, Edit2, Trash2, X, MapPin, FileText } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

const FILTERS = ['All', 'by Day', 'by stop'];

export default function NotesScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any>(null);
  const [form, setForm] = useState({ title: '', content: '' });
  const [saving, setSaving] = useState(false);
  const [tripTitle, setTripTitle] = useState('');

  const fetchData = useCallback(async () => {
    const [notesRes, tripRes] = await Promise.all([
      apiRequest(`/trips/${id}/notes`, 'GET', undefined, token),
      apiRequest(`/trips/${id}`, 'GET', undefined, token),
    ]);
    if (notesRes.success) setNotes(notesRes.data as any[]);
    if (tripRes.success) setTripTitle((tripRes.data as any).title);
    setLoading(false);
  }, [id, token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const openCreate = () => { setEditing(null); setForm({ title: '', content: '' }); setShowForm(true); };
  const openEdit = (n: any) => { setEditing(n); setForm({ title: n.title, content: n.content }); setShowForm(true); };

  const save = async () => {
    if (!form.title || !form.content) { Alert.alert('Error', 'Both fields required'); return; }
    setSaving(true);
    if (editing) await apiRequest(`/trips/${id}/notes/${editing.id}`, 'PUT', form, token);
    else await apiRequest(`/trips/${id}/notes`, 'POST', form, token);
    await fetchData();
    setSaving(false);
    setShowForm(false);
  };

  const del = (noteId: string) => Alert.alert('Delete', 'Delete this note?', [
    { text: 'Cancel', style: 'cancel' },
    { text: 'Delete', style: 'destructive', onPress: async () => { await apiRequest(`/trips/${id}/notes/${noteId}`, 'DELETE', undefined, token); fetchData(); } }
  ]);

  const filtered = notes.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.content.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.headerRow}>
        <TouchableOpacity onPress={() => router.back()} style={s.backBtn}>
          <ArrowLeft color="#191c1e" size={20} />
        </TouchableOpacity>
        <Text style={s.brand}>Trip notes</Text>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View style={s.titleSection}>
          <Text style={s.pageTitle}>Trip notes</Text>
          <Text style={s.tripLabel}>Trip: {tripTitle}</Text>
        </View>

        {/* Search */}
        <View style={s.searchWrap}>
          <Search color="#75777e" size={20} style={{ marginRight: 12 }} />
          <TextInput style={s.searchInput} value={search} onChangeText={setSearch} placeholder="Search your notes..." placeholderTextColor="#75777e" />
        </View>

        {/* Filter chips - wireframe: All | by Day | by stop */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={s.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f} style={[s.filterChip, filter === f && s.filterChipActive]} onPress={() => setFilter(f)}>
              <Text style={[s.filterChipText, filter === f && s.filterChipTextActive]}>{f}</Text>
            </TouchableOpacity>
          ))}
          <View style={s.divider} />
          <TouchableOpacity style={s.controlChip}><Text style={s.controlText}>Group by</Text><ChevronDown color="#75777e" size={14} /></TouchableOpacity>
          <TouchableOpacity style={s.controlChip}><SlidersHorizontal color="#75777e" size={14} /><Text style={s.controlText}>Filter</Text></TouchableOpacity>
        </ScrollView>

        {loading ? <ActivityIndicator color="#00696b" style={{ marginTop: 32 }} /> : (
          <>
            {filtered.length === 0 && (
              <View style={s.empty}>
                <FileText color="#c5c6ce" size={56} />
                <Text style={s.emptyTitle}>No notes yet</Text>
                <Text style={s.emptyText}>Tap "+ Add Note" to start your trip journal</Text>
              </View>
            )}

            {/* Note cards */}
            {filtered.map((note: any) => (
              <View key={note.id} style={s.noteCard}>
                <View style={s.noteCardHeader}>
                  <View style={s.noteIcon}>
                    <FileText color="#9333ea" size={18} />
                  </View>
                  <View style={{ flex: 1, marginLeft: 12 }}>
                    <Text style={s.noteTitle}>{note.title}</Text>
                    <Text style={s.noteDate}>{new Date(note.updatedAt).toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' })}</Text>
                  </View>
                  <View style={s.noteActions}>
                    <TouchableOpacity onPress={() => openEdit(note)} style={s.actionBtn}><Edit2 color="#00696b" size={16} /></TouchableOpacity>
                    <TouchableOpacity onPress={() => del(note.id)} style={[s.actionBtn, { backgroundColor: '#ffdad6' }]}><Trash2 color="#ba1a1a" size={16} /></TouchableOpacity>
                  </View>
                </View>
                <Text style={s.noteContent}>{note.content}</Text>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Add Note FAB */}
      <TouchableOpacity style={s.fab} onPress={openCreate}>
        <Plus color="#FFF" size={20} />
        <Text style={s.fabText}>Add Note</Text>
      </TouchableOpacity>

      {/* Note Form Modal */}
      <Modal visible={showForm} animationType="slide" transparent>
        <View style={s.overlay}>
          <View style={s.modal}>
            <View style={s.modalHeader}>
              <Text style={s.modalTitle}>{editing ? 'Edit Note' : 'New Note'}</Text>
              <TouchableOpacity onPress={() => setShowForm(false)} style={s.closeBtn}><X color="#191c1e" size={22} /></TouchableOpacity>
            </View>
            <Text style={s.fieldLabel}>Title</Text>
            <TextInput style={s.mInput} value={form.title} onChangeText={v => setForm(f => ({ ...f, title: v }))} placeholder="e.g. Hotel check-in details" placeholderTextColor="#75777e" />
            <Text style={s.fieldLabel}>Content</Text>
            <TextInput
              style={[s.mInput, { height: 160, textAlignVertical: 'top' }]}
              value={form.content}
              onChangeText={v => setForm(f => ({ ...f, content: v }))}
              placeholder="e.g. check in after 2pm, room 302..."
              placeholderTextColor="#75777e"
              multiline
            />
            <TouchableOpacity style={s.saveBtn} onPress={save} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={s.saveBtnText}>{editing ? 'Update Note' : 'Save Note'}</Text>}
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
  content: { padding: 20, paddingBottom: 120 },
  headerRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#f7f9fb' },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#ffffff', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#eceef0', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2, marginRight: 12 },
  brand: { fontSize: 20, fontWeight: '700', color: '#191c1e' },
  titleSection: { marginBottom: 20 },
  pageTitle: { fontSize: 32, fontWeight: '800', color: '#191c1e', letterSpacing: -0.5 },
  tripLabel: { fontSize: 16, color: '#00696b', marginTop: 6, fontWeight: '600' },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eceef0', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 12, marginBottom: 16 },
  searchInput: { flex: 1, color: '#191c1e', fontSize: 16 },
  filterRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 24 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 20, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#eceef0' },
  filterChipActive: { backgroundColor: '#56f5f8', borderColor: '#2ddbde' },
  filterChipText: { fontSize: 14, color: '#75777e', fontWeight: '600' },
  filterChipTextActive: { color: '#002020', fontWeight: '700' },
  divider: { width: 1, height: 24, backgroundColor: '#c5c6ce', marginHorizontal: 4 },
  controlChip: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#ffffff', borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, borderWidth: 1, borderColor: '#eceef0' },
  controlText: { color: '#44474d', fontSize: 13, fontWeight: '600' },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#191c1e', marginTop: 20, marginBottom: 8 },
  emptyText: { fontSize: 15, color: '#75777e', textAlign: 'center' },
  noteCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  noteCardHeader: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 },
  noteIcon: { width: 44, height: 44, borderRadius: 14, backgroundColor: '#f3e8fd', justifyContent: 'center', alignItems: 'center' },
  noteTitle: { fontSize: 16, fontWeight: '700', color: '#191c1e', marginBottom: 4 },
  noteDate: { fontSize: 13, color: '#75777e', fontWeight: '500' },
  noteActions: { flexDirection: 'row', gap: 8 },
  actionBtn: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#e6f4f1', justifyContent: 'center', alignItems: 'center' },
  noteContent: { fontSize: 15, color: '#44474d', lineHeight: 24 },
  fab: { position: 'absolute', bottom: 30, right: 20, flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#00696b', paddingHorizontal: 24, paddingVertical: 16, borderRadius: 32, shadowColor: '#00696b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 10 },
  fabText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
  overlay: { flex: 1, backgroundColor: 'rgba(0,3,10,0.6)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  modalTitle: { fontSize: 24, fontWeight: '800', color: '#191c1e' },
  closeBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#eceef0', justifyContent: 'center', alignItems: 'center' },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#44474d', marginBottom: 8 },
  mInput: { backgroundColor: '#ffffff', borderRadius: 16, padding: 16, color: '#191c1e', fontSize: 16, marginBottom: 20, borderWidth: 1, borderColor: '#c5c6ce' },
  saveBtn: { backgroundColor: '#00696b', borderRadius: 16, padding: 18, alignItems: 'center', marginTop: 8 },
  saveBtnText: { color: '#FFF', fontWeight: '700', fontSize: 16 },
});
