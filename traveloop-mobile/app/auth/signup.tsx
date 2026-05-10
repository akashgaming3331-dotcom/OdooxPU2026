import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, SafeAreaView,
  KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { Link } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Compass, User, Mail, Phone, Globe, Eye, EyeOff, Camera, MapPin } from 'lucide-react-native';

export default function SignupScreen() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', phone: '', city: '', country: '', password: '', info: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const set = (k: keyof typeof form) => (v: string) => setForm(f => ({ ...f, [k]: v }));

  const handleSignup = async () => {
    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      Alert.alert('Error', 'Please fill in all required fields'); return;
    }
    if (form.password.length < 6) { Alert.alert('Error', 'Password must be at least 6 characters'); return; }
    setLoading(true);
    const result = await signup(form.email.trim(), form.password, form.firstName.trim(), form.lastName.trim());
    setLoading(false);
    if (!result.success) Alert.alert('Signup Failed', result.error || 'Unknown error');
  };

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>

          {/* Top Nav */}
          <View style={s.topBar}>
            <View style={s.brandRow}>
              <Compass color="#00030a" size={24} />
              <Text style={s.brand}>Traveloop</Text>
            </View>
          </View>

          {/* Hero section */}
          <View style={s.hero}>
            <Text style={s.heroTitle}>Join the Loop</Text>
            <Text style={s.heroSub}>Design your perfect itinerary and connect with explorers worldwide.</Text>
          </View>

          {/* Form card */}
          <View style={s.card}>

            {/* Profile photo picker */}
            <View style={s.photoPicker}>
              <View style={s.photoCircle}>
                <Camera color="#75777e" size={32} />
              </View>
              <View style={s.photoEditBadge}>
                <User color="#FFF" size={14} />
              </View>
              <Text style={s.photoLabel}>Upload profile photo</Text>
            </View>

            {/* Name row */}
            <View style={s.row}>
              <View style={[s.field, { flex: 1, marginRight: 10 }]}>
                <Text style={s.label}>First Name</Text>
                <TextInput style={s.input} value={form.firstName} onChangeText={set('firstName')} placeholder="John" placeholderTextColor="#75777e" />
              </View>
              <View style={[s.field, { flex: 1 }]}>
                <Text style={s.label}>Last Name</Text>
                <TextInput style={s.input} value={form.lastName} onChangeText={set('lastName')} placeholder="Doe" placeholderTextColor="#75777e" />
              </View>
            </View>

            {/* Email */}
            <View style={s.field}>
              <Text style={s.label}>Email Address</Text>
              <View style={s.iconInput}>
                <Mail color="#75777e" size={18} style={{ marginRight: 10 }} />
                <TextInput style={s.iconInputText} value={form.email} onChangeText={set('email')} placeholder="john.doe@explorer.com" placeholderTextColor="#75777e" keyboardType="email-address" autoCapitalize="none" />
              </View>
            </View>

            {/* Phone */}
            <View style={s.field}>
              <Text style={s.label}>Phone Number</Text>
              <View style={s.iconInput}>
                <View style={s.phonePre}><Text style={s.phonePreText}>+1</Text></View>
                <TextInput style={[s.iconInputText, { flex: 1 }]} value={form.phone} onChangeText={set('phone')} placeholder="555-0123" placeholderTextColor="#75777e" keyboardType="phone-pad" />
              </View>
            </View>

            {/* City & Country */}
            <View style={s.row}>
              <View style={[s.field, { flex: 1, marginRight: 10 }]}>
                <Text style={s.label}>City</Text>
                <View style={s.iconInput}>
                  <MapPin color="#75777e" size={16} style={{ marginRight: 8 }} />
                  <TextInput style={s.iconInputText} value={form.city} onChangeText={set('city')} placeholder="San Francisco" placeholderTextColor="#75777e" />
                </View>
              </View>
              <View style={[s.field, { flex: 1 }]}>
                <Text style={s.label}>Country</Text>
                <View style={s.iconInput}>
                  <Globe color="#75777e" size={16} style={{ marginRight: 8 }} />
                  <TextInput style={s.iconInputText} value={form.country} onChangeText={set('country')} placeholder="USA" placeholderTextColor="#75777e" />
                </View>
              </View>
            </View>

            {/* Password */}
            <View style={s.field}>
              <Text style={s.label}>Password</Text>
              <View style={s.iconInput}>
                <TextInput style={[s.iconInputText, { flex: 1 }]} value={form.password} onChangeText={set('password')} placeholder="Min. 6 characters" placeholderTextColor="#75777e" secureTextEntry={!showPass} />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  {showPass ? <EyeOff color="#75777e" size={20} /> : <Eye color="#75777e" size={20} />}
                </TouchableOpacity>
              </View>
            </View>

            {/* Additional Info */}
            <View style={s.field}>
              <Text style={s.label}>Additional Information</Text>
              <TextInput
                style={[s.input, { height: 90, textAlignVertical: 'top', paddingTop: 14 }]}
                value={form.info}
                onChangeText={set('info')}
                placeholder="Tell us about your travel style, interests..."
                placeholderTextColor="#75777e"
                multiline
              />
            </View>

            {/* Register button */}
            <TouchableOpacity style={s.registerBtn} onPress={handleSignup} disabled={loading} activeOpacity={0.85}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={s.registerBtnText}>Register →</Text>}
            </TouchableOpacity>

            <View style={s.loginRow}>
              <Text style={s.loginText}>Already have an account? </Text>
              <Link href="/auth/login" asChild>
                <TouchableOpacity><Text style={s.loginLink}>Sign in</Text></TouchableOpacity>
              </Link>
            </View>
          </View>

          {/* Feature bento preview */}
          <View style={s.bentoGrid}>
            {[
              { icon: '🗺️', title: 'Smart Planning', desc: 'AI-powered suggestions based on your travel style.' },
              { icon: '👥', title: 'Community', desc: 'Connect with local experts and fellow travelers.' },
              { icon: '🧾', title: 'All-in-one Hub', desc: 'Manage bookings, expenses, and itinerary in one place.' },
            ].map((f, i) => (
              <View key={i} style={s.bentoCard}>
                <Text style={s.bentoIcon}>{f.icon}</Text>
                <Text style={s.bentoTitle}>{f.title}</Text>
                <Text style={s.bentoDesc}>{f.desc}</Text>
              </View>
            ))}
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f7f9fb' },
  scroll: { flexGrow: 1, paddingBottom: 48 },
  topBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#f7f9fb', borderBottomWidth: 1, borderBottomColor: '#eceef0' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brand: { fontSize: 24, fontWeight: '700', color: '#00030a' },
  hero: { alignItems: 'center', paddingHorizontal: 24, paddingVertical: 36 },
  heroTitle: { fontSize: 36, fontWeight: '800', color: '#191c1e', letterSpacing: -0.5, marginBottom: 10, textAlign: 'center' },
  heroSub: { fontSize: 16, color: '#44474d', textAlign: 'center', lineHeight: 24 },
  card: { backgroundColor: '#ffffff', borderRadius: 24, marginHorizontal: 20, padding: 24, shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.07, shadowRadius: 16, elevation: 4, borderWidth: 1, borderColor: '#e6e8ea', marginBottom: 24 },
  photoPicker: { alignItems: 'center', marginBottom: 28 },
  photoCircle: { width: 96, height: 96, borderRadius: 48, backgroundColor: '#eceef0', borderWidth: 2, borderColor: '#c5c6ce', borderStyle: 'dashed', justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  photoEditBadge: { position: 'absolute', bottom: 34, right: '50%', marginRight: -56, backgroundColor: '#00696b', width: 28, height: 28, borderRadius: 14, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: '#FFF' },
  photoLabel: { fontSize: 13, color: '#75777e', fontWeight: '500' },
  row: { flexDirection: 'row' },
  field: { marginBottom: 20 },
  label: { fontSize: 12, fontWeight: '600', color: '#44474d', marginBottom: 8, textTransform: 'uppercase', letterSpacing: 0.5 },
  input: { backgroundColor: '#f2f4f6', borderRadius: 12, paddingHorizontal: 16, paddingVertical: 14, color: '#191c1e', fontSize: 15, borderWidth: 1, borderColor: '#eceef0' },
  iconInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f4f6', borderRadius: 12, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1, borderColor: '#eceef0' },
  iconInputText: { color: '#191c1e', fontSize: 15 },
  phonePre: { backgroundColor: '#e6e8ea', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, marginRight: 10 },
  phonePreText: { color: '#44474d', fontSize: 14, fontWeight: '600' },
  registerBtn: { backgroundColor: '#00696b', borderRadius: 18, paddingVertical: 18, alignItems: 'center', marginTop: 8, marginBottom: 20, shadowColor: '#00696b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 10 },
  registerBtnText: { color: '#FFF', fontWeight: '800', fontSize: 17 },
  loginRow: { flexDirection: 'row', justifyContent: 'center' },
  loginText: { color: '#44474d', fontSize: 15 },
  loginLink: { color: '#00696b', fontWeight: '700', fontSize: 15 },
  bentoGrid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 20, gap: 12, marginBottom: 20 },
  bentoCard: { flex: 1, minWidth: '28%', backgroundColor: '#ffffff', borderRadius: 20, padding: 20, borderWidth: 1, borderColor: '#eceef0', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.04, shadowRadius: 4, elevation: 1 },
  bentoIcon: { fontSize: 28, marginBottom: 10 },
  bentoTitle: { fontSize: 14, fontWeight: '700', color: '#191c1e', marginBottom: 6, textAlign: 'center' },
  bentoDesc: { fontSize: 12, color: '#75777e', textAlign: 'center', lineHeight: 18 },
});
