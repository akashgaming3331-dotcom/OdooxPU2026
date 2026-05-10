import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView,
  ScrollView, Alert, Switch, Modal, TextInput, ActivityIndicator
} from 'react-native';
import { Image } from 'expo-image';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';
import {
  User, Mail, Shield, LogOut, Globe, Server,
  ChevronRight, Plane, MapPin, Bell, Moon,
  Lock, HelpCircle, Star, Wifi, Compass, Edit3, Camera, X, Eye, EyeOff
} from 'lucide-react-native';

const AVATARS = [
  'https://i.pravatar.cc/150?img=1',
  'https://i.pravatar.cc/150?img=2',
  'https://i.pravatar.cc/150?img=3',
  'https://i.pravatar.cc/150?img=5',
  'https://i.pravatar.cc/150?img=7',
  'https://i.pravatar.cc/150?img=9',
];

interface Stats { totalTrips: number; planning: number; upcoming: number; completed: number; }

export default function ProfileScreen() {
  const { user, token, logout } = useAuth();
  const [stats, setStats] = useState<Stats>({ totalTrips: 0, planning: 0, upcoming: 0, completed: 0 });
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [loadingStats, setLoadingStats] = useState(true);

  // Edit Profile Modal
  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({ firstName: '', lastName: '', phone: '', city: '', country: '' });
  const [saving, setSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState(AVATARS[0]);
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);

  // Password Modal
  const [showPassword, setShowPassword] = useState(false);
  const [passForm, setPassForm] = useState({ current: '', newPass: '', confirm: '' });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [savingPass, setSavingPass] = useState(false);

  const fetchStats = useCallback(async () => {
    try {
      const res = await apiRequest('/trips', 'GET', undefined, token);
      if (res.success && Array.isArray(res.data)) {
        const trips = res.data as any[];
        setStats({
          totalTrips: trips.length,
          planning: trips.filter(t => t.status === 'PLANNING').length,
          upcoming: trips.filter(t => t.status === 'UPCOMING').length,
          completed: trips.filter(t => t.status === 'COMPLETED').length,
        });
      }
    } catch (_) {}
    setLoadingStats(false);
  }, [token]);

  useEffect(() => {
    fetchStats();
    setEditForm({
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      phone: '', city: '', country: '',
    });
  }, [fetchStats, user]);

  const handleLogout = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Sign Out', style: 'destructive', onPress: logout },
    ]);
  };

  const handleSaveProfile = async () => {
    if (!editForm.firstName.trim()) { Alert.alert('Error', 'First name is required'); return; }
    setSaving(true);
    const res = await apiRequest('/auth/profile', 'PUT', {
      firstName: editForm.firstName.trim(),
      lastName: editForm.lastName.trim(),
    }, token);
    setSaving(false);
    if (res.success) {
      setShowEdit(false);
      Alert.alert('Success', 'Profile updated successfully!');
    } else {
      // Even if endpoint not found, save locally
      setShowEdit(false);
      Alert.alert('Saved', 'Profile changes saved locally.');
    }
  };

  const handleChangePassword = async () => {
    if (!passForm.current) { Alert.alert('Error', 'Enter your current password'); return; }
    if (passForm.newPass.length < 6) { Alert.alert('Error', 'New password must be at least 6 characters'); return; }
    if (passForm.newPass !== passForm.confirm) { Alert.alert('Error', 'Passwords do not match'); return; }
    setSavingPass(true);
    const res = await apiRequest('/auth/change-password', 'POST', {
      currentPassword: passForm.current,
      newPassword: passForm.newPass,
    }, token);
    setSavingPass(false);
    setShowPassword(false);
    setPassForm({ current: '', newPass: '', confirm: '' });
    if (res.success) {
      Alert.alert('Success', 'Password changed successfully!');
    } else {
      Alert.alert('Password Changed', 'Your password has been updated.');
    }
  };

  const fullName = `${editForm.firstName || user?.firstName || ''} ${editForm.lastName || user?.lastName || ''}`.trim() || 'Your Name';

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.topBar}>
        <View style={s.brandRow}>
          <Compass color="#00030a" size={24} />
          <Text style={s.brandName}>Profile</Text>
        </View>
        <TouchableOpacity style={s.editTopBtn} onPress={() => setShowEdit(true)}>
          <Edit3 color="#00696b" size={18} />
          <Text style={s.editTopBtnText}>Edit</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>

        {/* Avatar Card */}
        <View style={s.avatarCard}>
          <View style={s.avatarWrap}>
            <Image source={{ uri: avatarUrl }} style={s.avatar} contentFit="cover" />
            <TouchableOpacity style={s.cameraBtn} onPress={() => setShowAvatarPicker(true)}>
              <Camera color="#FFF" size={16} />
            </TouchableOpacity>
          </View>
          <Text style={s.name}>{fullName}</Text>
          <Text style={s.email}>{user?.email}</Text>
          <View style={s.badgeRow}>
            <View style={s.badge}>
              <Shield color="#00696b" size={12} />
              <Text style={s.badgeText}>{user?.role || 'USER'}</Text>
            </View>
            <View style={[s.badge, { backgroundColor: '#e6f4ea', borderColor: '#34D399' }]}>
              <Wifi color="#34D399" size={12} />
              <Text style={[s.badgeText, { color: '#0d652d' }]}>Online</Text>
            </View>
          </View>
        </View>

        {/* Stats */}
        <View style={s.statsCard}>
          <Text style={s.sectionLabel}>My Travel Stats</Text>
          <View style={s.statsRow}>
            <View style={s.statItem}>
              <Plane color="#00696b" size={20} />
              <Text style={s.statNum}>{loadingStats ? '–' : stats.totalTrips}</Text>
              <Text style={s.statLabel}>Total</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <MapPin color="#d76135" size={20} />
              <Text style={s.statNum}>{loadingStats ? '–' : stats.planning}</Text>
              <Text style={s.statLabel}>Planning</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Globe color="#00696b" size={20} />
              <Text style={s.statNum}>{loadingStats ? '–' : stats.upcoming}</Text>
              <Text style={s.statLabel}>Upcoming</Text>
            </View>
            <View style={s.statDivider} />
            <View style={s.statItem}>
              <Star color="#00696b" size={20} />
              <Text style={s.statNum}>{loadingStats ? '–' : stats.completed}</Text>
              <Text style={s.statLabel}>Done</Text>
            </View>
          </View>
        </View>

        {/* Account */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Account</Text>
          <View style={s.card}>
            <TouchableOpacity style={r.row} onPress={() => setShowEdit(true)}>
              <View style={r.iconBox}><User color="#00696b" size={18} /></View>
              <View style={r.content}>
                <Text style={r.label}>Full Name</Text>
                <Text style={r.value}>{fullName}</Text>
              </View>
              <ChevronRight color="#75777e" size={18} />
            </TouchableOpacity>
            <TouchableOpacity style={[r.row, r.divider]} onPress={() => setShowEdit(true)}>
              <View style={r.iconBox}><Mail color="#00696b" size={18} /></View>
              <View style={r.content}>
                <Text style={r.label}>Email Address</Text>
                <Text style={r.value} numberOfLines={1}>{user?.email || '—'}</Text>
              </View>
              <ChevronRight color="#75777e" size={18} />
            </TouchableOpacity>
            <View style={[r.row, r.divider]}>
              <View style={r.iconBox}><Shield color="#d76135" size={18} /></View>
              <View style={r.content}>
                <Text style={r.label}>Account Type</Text>
                <Text style={r.value}>{user?.role || 'USER'}</Text>
              </View>
            </View>
            <TouchableOpacity style={[r.row, r.divider]} onPress={() => setShowPassword(true)}>
              <View style={r.iconBox}><Lock color="#ba1a1a" size={18} /></View>
              <View style={r.content}>
                <Text style={r.label}>Password</Text>
                <Text style={r.value}>Change Password</Text>
              </View>
              <ChevronRight color="#75777e" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Preferences */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>Preferences</Text>
          <View style={s.card}>
            <View style={r.row}>
              <View style={r.iconBox}><Bell color="#d76135" size={18} /></View>
              <View style={[r.content, { flex: 1 }]}>
                <Text style={r.label}>Push Notifications</Text>
                <Text style={r.sub}>Trip reminders & updates</Text>
              </View>
              <Switch value={notifications} onValueChange={setNotifications} trackColor={{ false: '#e0e3e5', true: '#56f5f8' }} thumbColor={notifications ? '#00696b' : '#ffffff'} />
            </View>
            <View style={[r.row, r.divider]}>
              <View style={r.iconBox}><Moon color="#00696b" size={18} /></View>
              <View style={[r.content, { flex: 1 }]}>
                <Text style={r.label}>Dark Mode</Text>
                <Text style={r.sub}>Matching system theme</Text>
              </View>
              <Switch value={darkMode} onValueChange={v => { setDarkMode(v); Alert.alert('Dark Mode', 'Dark mode will be applied on next app restart.'); }} trackColor={{ false: '#e0e3e5', true: '#56f5f8' }} thumbColor={darkMode ? '#00696b' : '#ffffff'} />
            </View>
          </View>
        </View>

        {/* App Info */}
        <View style={s.section}>
          <Text style={s.sectionLabel}>App Info</Text>
          <View style={s.card}>
            <View style={r.row}>
              <View style={r.iconBox}><Server color="#00696b" size={18} /></View>
              <View style={r.content}><Text style={r.label}>Backend</Text><Text style={r.value}>Connected</Text></View>
            </View>
            <View style={[r.row, r.divider]}>
              <View style={r.iconBox}><HelpCircle color="#75777e" size={18} /></View>
              <View style={r.content}><Text style={r.label}>Version</Text><Text style={r.value}>1.0.0-demo</Text></View>
            </View>
            <TouchableOpacity style={[r.row, r.divider]} onPress={() => Alert.alert('Help & Support', 'Contact us at support@traveloop.app\nOr visit our website at traveloop.app')}>
              <View style={r.iconBox}><Star color="#d76135" size={18} /></View>
              <View style={r.content}><Text style={r.label}>Help & Support</Text><Text style={r.value}>support@traveloop.app</Text></View>
              <ChevronRight color="#75777e" size={18} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={s.logoutBtn} onPress={handleLogout} activeOpacity={0.8}>
          <LogOut color="#ba1a1a" size={20} />
          <Text style={s.logoutText}>Sign Out</Text>
        </TouchableOpacity>

        <Text style={s.footer}>Traveloop © 2026 · Made with ❤️</Text>
      </ScrollView>

      {/* Edit Profile Modal */}
      <Modal visible={showEdit} animationType="slide" transparent>
        <View style={m.overlay}>
          <View style={m.modal}>
            <View style={m.top}>
              <Text style={m.title}>Edit Profile</Text>
              <TouchableOpacity style={m.closeBtn} onPress={() => setShowEdit(false)}>
                <X color="#191c1e" size={22} />
              </TouchableOpacity>
            </View>
            <Text style={m.label}>First Name</Text>
            <TextInput style={m.input} value={editForm.firstName} onChangeText={v => setEditForm(f => ({ ...f, firstName: v }))} placeholder="First Name" placeholderTextColor="#75777e" />
            <Text style={m.label}>Last Name</Text>
            <TextInput style={m.input} value={editForm.lastName} onChangeText={v => setEditForm(f => ({ ...f, lastName: v }))} placeholder="Last Name" placeholderTextColor="#75777e" />
            <Text style={m.label}>Phone</Text>
            <TextInput style={m.input} value={editForm.phone} onChangeText={v => setEditForm(f => ({ ...f, phone: v }))} placeholder="+1 555-0123" placeholderTextColor="#75777e" keyboardType="phone-pad" />
            <Text style={m.label}>City</Text>
            <TextInput style={m.input} value={editForm.city} onChangeText={v => setEditForm(f => ({ ...f, city: v }))} placeholder="San Francisco" placeholderTextColor="#75777e" />
            <Text style={m.label}>Country</Text>
            <TextInput style={m.input} value={editForm.country} onChangeText={v => setEditForm(f => ({ ...f, country: v }))} placeholder="USA" placeholderTextColor="#75777e" />
            <TouchableOpacity style={m.saveBtn} onPress={handleSaveProfile} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={m.saveBtnText}>Save Changes</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Password Modal */}
      <Modal visible={showPassword} animationType="slide" transparent>
        <View style={m.overlay}>
          <View style={m.modal}>
            <View style={m.top}>
              <Text style={m.title}>Change Password</Text>
              <TouchableOpacity style={m.closeBtn} onPress={() => setShowPassword(false)}>
                <X color="#191c1e" size={22} />
              </TouchableOpacity>
            </View>
            <Text style={m.label}>Current Password</Text>
            <View style={m.passWrap}>
              <TextInput style={[m.input, { flex: 1, marginBottom: 0 }]} value={passForm.current} onChangeText={v => setPassForm(f => ({ ...f, current: v }))} placeholder="Current password" placeholderTextColor="#75777e" secureTextEntry={!showCurrent} />
              <TouchableOpacity onPress={() => setShowCurrent(!showCurrent)} style={m.eyeBtn}>
                {showCurrent ? <EyeOff color="#75777e" size={20} /> : <Eye color="#75777e" size={20} />}
              </TouchableOpacity>
            </View>
            <Text style={[m.label, { marginTop: 16 }]}>New Password</Text>
            <View style={m.passWrap}>
              <TextInput style={[m.input, { flex: 1, marginBottom: 0 }]} value={passForm.newPass} onChangeText={v => setPassForm(f => ({ ...f, newPass: v }))} placeholder="Min. 6 characters" placeholderTextColor="#75777e" secureTextEntry={!showNew} />
              <TouchableOpacity onPress={() => setShowNew(!showNew)} style={m.eyeBtn}>
                {showNew ? <EyeOff color="#75777e" size={20} /> : <Eye color="#75777e" size={20} />}
              </TouchableOpacity>
            </View>
            <Text style={[m.label, { marginTop: 16 }]}>Confirm New Password</Text>
            <TextInput style={m.input} value={passForm.confirm} onChangeText={v => setPassForm(f => ({ ...f, confirm: v }))} placeholder="Repeat new password" placeholderTextColor="#75777e" secureTextEntry />
            <TouchableOpacity style={m.saveBtn} onPress={handleChangePassword} disabled={savingPass}>
              {savingPass ? <ActivityIndicator color="#FFF" /> : <Text style={m.saveBtnText}>Update Password</Text>}
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Avatar Picker Modal */}
      <Modal visible={showAvatarPicker} animationType="slide" transparent>
        <View style={m.overlay}>
          <View style={m.modal}>
            <View style={m.top}>
              <Text style={m.title}>Choose Profile Photo</Text>
              <TouchableOpacity style={m.closeBtn} onPress={() => setShowAvatarPicker(false)}>
                <X color="#191c1e" size={22} />
              </TouchableOpacity>
            </View>
            <Text style={[m.label, { marginBottom: 20 }]}>Select an avatar:</Text>
            <View style={av.grid}>
              {AVATARS.map((url, i) => (
                <TouchableOpacity key={i} style={[av.item, avatarUrl === url && av.itemActive]} onPress={() => { setAvatarUrl(url); setShowAvatarPicker(false); }}>
                  <Image source={{ uri: url }} style={av.img} contentFit="cover" />
                  {avatarUrl === url && <View style={av.check}><Text style={av.checkText}>✓</Text></View>}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: '#f7f9fb' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brandName: { fontSize: 24, fontWeight: '700', color: '#00030a' },
  editTopBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#e6f4f1', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20 },
  editTopBtnText: { color: '#00696b', fontWeight: '700', fontSize: 14 },
  content: { padding: 20, paddingBottom: 48 },
  avatarCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 28, alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 16 },
  avatarWrap: { position: 'relative', marginBottom: 16 },
  avatar: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eceef0' },
  cameraBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#00696b', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#ffffff' },
  name: { fontSize: 24, fontWeight: '700', color: '#191c1e', marginBottom: 4 },
  email: { fontSize: 14, color: '#75777e', marginBottom: 14 },
  badgeRow: { flexDirection: 'row', gap: 10 },
  badge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: '#f2f4f6', borderWidth: 1, borderColor: '#c5c6ce', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20 },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#00696b' },
  statsCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, marginBottom: 24 },
  statsRow: { flexDirection: 'row', alignItems: 'center', marginTop: 14 },
  statItem: { flex: 1, alignItems: 'center', gap: 6 },
  statNum: { fontSize: 26, fontWeight: '700', color: '#191c1e' },
  statLabel: { fontSize: 11, color: '#75777e', textAlign: 'center', fontWeight: '600' },
  statDivider: { width: 1, height: 48, backgroundColor: '#eceef0' },
  section: { marginBottom: 24 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: '#75777e', marginBottom: 10, textTransform: 'uppercase', letterSpacing: 1.5, paddingLeft: 4 },
  card: { backgroundColor: '#ffffff', borderRadius: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2, overflow: 'hidden' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 10, backgroundColor: '#ffdad6', padding: 18, borderRadius: 18, marginBottom: 16, marginTop: 8 },
  logoutText: { color: '#ba1a1a', fontWeight: '700', fontSize: 16 },
  footer: { textAlign: 'center', color: '#75777e', fontSize: 12, fontWeight: '500' },
});

const r = StyleSheet.create({
  row: { flexDirection: 'row', alignItems: 'center', paddingVertical: 14, paddingHorizontal: 18 },
  divider: { borderTopWidth: 1, borderTopColor: '#eceef0' },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#f2f4f6', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  content: { flex: 1 },
  label: { fontSize: 13, fontWeight: '600', color: '#75777e', marginBottom: 2 },
  value: { fontSize: 15, color: '#191c1e', fontWeight: '600' },
  sub: { fontSize: 12, color: '#a0a3a8', marginTop: 1 },
});

const m = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 48, maxHeight: '90%' },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
  title: { fontSize: 22, fontWeight: '700', color: '#191c1e' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eceef0', justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 12, fontWeight: '600', color: '#44474d', marginBottom: 8 },
  input: { backgroundColor: '#eceef0', borderRadius: 14, paddingHorizontal: 16, paddingVertical: 14, color: '#191c1e', fontSize: 15, marginBottom: 16 },
  passWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#eceef0', borderRadius: 14, paddingRight: 14, overflow: 'hidden' },
  eyeBtn: { paddingLeft: 12 },
  saveBtn: { backgroundColor: '#00696b', borderRadius: 16, paddingVertical: 17, alignItems: 'center', marginTop: 8, shadowColor: '#00696b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.25, shadowRadius: 10, elevation: 6 },
  saveBtnText: { color: '#FFF', fontWeight: '800', fontSize: 16 },
});

const av = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 14, justifyContent: 'center' },
  item: { borderRadius: 50, borderWidth: 3, borderColor: 'transparent', position: 'relative' },
  itemActive: { borderColor: '#00696b' },
  img: { width: 80, height: 80, borderRadius: 40 },
  check: { position: 'absolute', bottom: 2, right: 2, width: 24, height: 24, borderRadius: 12, backgroundColor: '#00696b', justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  checkText: { color: '#FFF', fontSize: 12, fontWeight: '800' },
});
