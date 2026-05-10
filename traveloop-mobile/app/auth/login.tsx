import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  KeyboardAvoidingView, Platform, ActivityIndicator, Dimensions, ScrollView
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useAuth } from '@/src/context/AuthContext';
import { Mail, Lock, Eye, EyeOff, ArrowRight, Compass } from 'lucide-react-native';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) return;
    setLoading(true);
    await login(email.trim(), password);
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={s.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} bounces={false} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Hero image using expo-image */}
        <View style={s.heroWrap}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&q=80&w=800' }}
            style={s.heroImg}
            contentFit="cover"
          />
          <View style={s.heroOverlay}>
            <View style={s.logoContainer}>
              <Compass color="#FFF" size={30} />
              <Text style={s.logoText}>Traveloop</Text>
            </View>
            <View style={s.heroTextContainer}>
              <Text style={s.heroTitle}>Adventure Awaits.</Text>
              <Text style={s.heroSub}>Join thousands of travelers planning unforgettable journeys.</Text>
            </View>
          </View>
        </View>

        {/* Form */}
        <View style={s.formContainer}>
          <View style={s.header}>
            <Text style={s.welcomeText}>Welcome Back</Text>
            <Text style={s.subText}>Sign in to your travel dashboard.</Text>
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>EMAIL ADDRESS</Text>
            <View style={s.inputWrapper}>
              <Mail color="#75777e" size={20} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="yourname@example.com"
                placeholderTextColor="#75777e"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={s.inputGroup}>
            <Text style={s.label}>PASSWORD</Text>
            <View style={s.inputWrapper}>
              <Lock color="#75777e" size={20} style={s.inputIcon} />
              <TextInput
                style={s.input}
                placeholder="••••••••"
                placeholderTextColor="#75777e"
                secureTextEntry={!showPass}
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity onPress={() => setShowPass(!showPass)} style={s.eyeIcon}>
                {showPass ? <EyeOff color="#75777e" size={20} /> : <Eye color="#75777e" size={20} />}
              </TouchableOpacity>
            </View>
          </View>

          <View style={s.optionsRow}>
            <View style={s.checkboxRow}>
              <View style={s.checkbox} />
              <Text style={s.rememberText}>Remember me</Text>
            </View>
            <TouchableOpacity>
              <Text style={s.forgotText}>Forgot Password?</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={s.loginBtn} onPress={handleLogin} disabled={loading} activeOpacity={0.85}>
            {loading ? <ActivityIndicator color="#FFF" /> : (
              <>
                <Text style={s.loginBtnText}>Sign In</Text>
                <ArrowRight color="#FFF" size={20} />
              </>
            )}
          </TouchableOpacity>

          <View style={s.dividerContainer}>
            <View style={s.divider} />
            <Text style={s.dividerText}>OR</Text>
            <View style={s.divider} />
          </View>

          <TouchableOpacity style={s.googleBtn} activeOpacity={0.8}>
            <Text style={s.googleBtnText}>🌐  Continue with Google</Text>
          </TouchableOpacity>

          <View style={s.footer}>
            <Text style={s.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push('/auth/signup')}>
              <Text style={s.createAccountText}>Create Account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f9fb' },
  heroWrap: { width: '100%', height: height * 0.4, position: 'relative' },
  heroImg: { width: '100%', height: '100%' },
  heroOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.42)', padding: 24, paddingTop: 60, justifyContent: 'space-between' },
  logoContainer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  logoText: { color: '#FFF', fontSize: 26, fontWeight: '800' },
  heroTextContainer: { marginBottom: 32 },
  heroTitle: { color: '#FFF', fontSize: 34, fontWeight: '800', marginBottom: 10, letterSpacing: -0.5 },
  heroSub: { color: 'rgba(255,255,255,0.85)', fontSize: 16, lineHeight: 24, maxWidth: 300 },
  formContainer: { flex: 1, padding: 28, backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, marginTop: -28 },
  header: { marginBottom: 28 },
  welcomeText: { fontSize: 28, fontWeight: '800', color: '#191c1e', marginBottom: 8 },
  subText: { fontSize: 15, color: '#44474d', lineHeight: 22 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 11, fontWeight: '700', color: '#44474d', marginBottom: 10, letterSpacing: 0.8, textTransform: 'uppercase' },
  inputWrapper: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f2f4f6', borderRadius: 16, borderBottomWidth: 2, borderBottomColor: '#c5c6ce', overflow: 'hidden' },
  inputIcon: { marginLeft: 16 },
  input: { flex: 1, paddingVertical: 16, paddingHorizontal: 12, fontSize: 15, color: '#191c1e' },
  eyeIcon: { padding: 16 },
  optionsRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 },
  checkboxRow: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  checkbox: { width: 18, height: 18, borderRadius: 5, borderWidth: 2, borderColor: '#c5c6ce' },
  rememberText: { fontSize: 14, color: '#44474d' },
  forgotText: { fontSize: 14, color: '#00696b', fontWeight: '700' },
  loginBtn: { backgroundColor: '#00696b', flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingVertical: 18, borderRadius: 18, gap: 10, shadowColor: '#00696b', shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 14, elevation: 8 },
  loginBtnText: { color: '#FFF', fontSize: 17, fontWeight: '800' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', marginVertical: 24 },
  divider: { flex: 1, height: 1, backgroundColor: '#e0e3e5' },
  dividerText: { marginHorizontal: 16, fontSize: 12, color: '#75777e', fontWeight: '600' },
  googleBtn: { backgroundColor: '#ffffff', paddingVertical: 17, borderRadius: 18, alignItems: 'center', borderWidth: 1.5, borderColor: '#e0e3e5', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  googleBtnText: { color: '#191c1e', fontSize: 16, fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 28, marginBottom: 20 },
  footerText: { color: '#44474d', fontSize: 15 },
  createAccountText: { color: '#00696b', fontSize: 15, fontWeight: '800' },
});
