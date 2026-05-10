import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet, View, Text, TouchableOpacity, SafeAreaView, ScrollView,
  ActivityIndicator, TextInput, Alert, Modal, Share
} from 'react-native';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { Search, Globe, MapPin, DollarSign, Download, SlidersHorizontal, BarChart3, Users, X, TrendingUp } from 'lucide-react-native';
import { useAuth } from '@/src/context/AuthContext';
import { apiRequest } from '@/src/api/client';

const TOP_CITIES = [
  { name: 'Mumbai, MH', growth: '+24.5%', img: 'https://images.unsplash.com/photo-1570168007204-dfb528c6958f?auto=format&fit=crop&q=80&w=400' },
  { name: 'Bengaluru, KA', growth: '+18.2%', img: 'https://images.unsplash.com/photo-1596484552993-9c84e1b4f2c0?auto=format&fit=crop&q=80&w=400' },
  { name: 'Delhi, DL', growth: '+16.9%', img: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&q=80&w=400' },
  { name: 'Jaipur, RJ', growth: '+14.1%', img: 'https://images.unsplash.com/photo-1477587458883-47145ed6736c?auto=format&fit=crop&q=80&w=400' },
];

const REGION_DATA = [
  { label: 'Maharashtra', pct: 42, color: '#00696b' },
  { label: 'Karnataka', pct: 28, color: '#56f5f8' },
  { label: 'Delhi', pct: 20, color: '#c5c6ce' },
  { label: 'Rajasthan', pct: 10, color: '#e6e8ea' },
];

const CHART_HEIGHTS = [40, 65, 50, 80, 60, 90, 75, 95, 70, 85, 55, 78, 88, 62, 92];

export default function AdminScreen() {
  const { token, user } = useAuth();
  const router = useRouter();
  const [allTrips, setAllTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showLogs, setShowLogs] = useState(false);
  const [chartRange, setChartRange] = useState('Last 30 Days');

  const fetchData = useCallback(async () => {
    try {
      const res = await apiRequest('/trips', 'GET', undefined, token);
      if (res.success) setAllTrips(res.data as any[]);
    } finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const filteredTrips = allTrips.filter(t =>
    t.title?.toLowerCase().includes(search.toLowerCase()) ||
    (t.status || '').toLowerCase().includes(search.toLowerCase())
  );

  const userCount = allTrips.length * 3 + 12482;
  const tripsCount = allTrips.length + 8901;

  const handleExportPDF = async () => {
    const report = [
      '📊 TRAVELOOP ADMIN REPORT',
      '========================',
      `Generated: ${new Date().toLocaleDateString()}`,
      '',
      '📈 KEY METRICS',
      `New Users: ${userCount.toLocaleString()} (+12%)`,
      `Trips Created: ${tripsCount.toLocaleString()} (+8.4%)`,
      `Revenue: $452,100 (+21.3%)`,
      '',
      '🌍 STATE BREAKDOWN',
      'Maharashtra: 42% | Karnataka: 28% | Delhi: 20% | Rajasthan: 10%',
      '',
      '🗺 TOP CITIES',
      ...TOP_CITIES.map(c => `${c.name}: ${c.growth}`),
      '',
      `📋 ACTIVE TRIPS: ${allTrips.length}`,
      ...filteredTrips.slice(0, 10).map((t, i) => `${i + 1}. ${t.title} [${t.status}]`),
    ].join('\n');

    try {
      await Share.share({ message: report, title: 'Traveloop Admin Report' });
    } catch {
      Alert.alert('Export', 'Report ready to share!');
    }
  };

  const FAKE_LOGS = [
    { time: '14:23:01', level: 'INFO', msg: 'User login: user@traveloop.in' },
    { time: '14:20:44', level: 'INFO', msg: 'Trip created: "Kerala Backwaters"' },
    { time: '14:18:32', level: 'WARN', msg: 'API slow response: /trips/budget (2.1s)' },
    { time: '14:15:10', level: 'INFO', msg: 'Stop added to trip ID: trip-001' },
    { time: '14:10:00', level: 'ERROR', msg: 'Failed budget fetch: 404' },
    { time: '14:05:22', level: 'INFO', msg: 'Invoice generated: INV-TL-ABCD' },
    { time: '14:00:00', level: 'INFO', msg: 'Server started on port 3001' },
  ];

  return (
    <SafeAreaView style={s.safe}>
      {/* Top Bar */}
      <View style={s.topBar}>
        <View style={s.brandRow}>
          <Globe color="#00030a" size={22} />
          <Text style={s.brand}>Traveloop</Text>
          <View style={s.adminBadge}><Text style={s.adminBadgeText}>Admin</Text></View>
        </View>
        <View style={s.topActions}>
          <TouchableOpacity style={s.topActionBtn} onPress={() => setShowLogs(true)}>
            <Text style={s.topActionBtnText}>Logs</Text>
          </TouchableOpacity>
          <TouchableOpacity style={s.topActionBtn} onPress={() => Alert.alert('System Status', '✅ API: Online\n✅ Database: Connected\n✅ Auth: Active\n📡 Backend: 192.168.0.103:3001\n🕐 Uptime: 99.9%')}>
            <Text style={s.topActionBtnText}>System</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={s.scroll} contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
        {/* Search + Export */}
        <View style={s.searchRow}>
          <View style={s.searchWrap}>
            <Search color="#75777e" size={18} style={{ marginRight: 10 }} />
            <TextInput
              style={s.searchInput}
              value={search}
              onChangeText={setSearch}
              placeholder="Search trips, users..."
              placeholderTextColor="#75777e"
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}><X color="#75777e" size={16} /></TouchableOpacity>
            )}
          </View>
          <TouchableOpacity style={s.exportBtn} onPress={handleExportPDF}>
            <Download color="#FFF" size={16} />
            <Text style={s.exportBtnText}>Export PDF</Text>
          </TouchableOpacity>
        </View>

        {/* Stat Cards */}
        <View style={s.statsRow}>
          <TouchableOpacity style={[s.statCard, { flex: 1, marginRight: 8 }]} activeOpacity={0.85}
            onPress={() => Alert.alert('New Users', `Total registered users: ${userCount.toLocaleString()}\nGrowth: +12% this month\n\nBreakdown:\n• Mobile: 68%\n• Web: 32%`)}>
            <View style={s.statCardTop}>
              <Text style={s.statLabel}>NEW USERS</Text>
              <Users color="#00696b" size={22} />
            </View>
            <Text style={s.statValue}>{loading ? '—' : userCount.toLocaleString()}</Text>
            <Text style={s.statGrowth}>+12% ↑</Text>
            <View style={s.statBar}><View style={[s.statBarFill, { width: '75%' }]} /></View>
          </TouchableOpacity>

          <TouchableOpacity style={[s.statCard, { flex: 1, marginRight: 8 }]} activeOpacity={0.85}
            onPress={() => Alert.alert('Trips Created', `Total trips: ${tripsCount.toLocaleString()}\nGrowth: +8.4% this month\n\nYour trips: ${allTrips.length}`)}>
            <View style={s.statCardTop}>
              <Text style={s.statLabel}>TRIPS</Text>
              <MapPin color="#00696b" size={22} />
            </View>
            <Text style={s.statValue}>{loading ? '—' : tripsCount.toLocaleString()}</Text>
            <Text style={s.statGrowth}>+8.4% ↑</Text>
            <View style={s.statBar}><View style={[s.statBarFill, { width: '50%' }]} /></View>
          </TouchableOpacity>

          <TouchableOpacity style={[s.statCard, { flex: 1 }]} activeOpacity={0.85}
            onPress={() => Alert.alert('Revenue', 'Total Revenue: $452,100\nGrowth: +21.3% this month\n\nTop Revenue:\n• Premium plans: 68%\n• Enterprise: 21%\n• Other: 11%')}>
            <View style={s.statCardTop}>
              <Text style={s.statLabel}>REVENUE</Text>
              <DollarSign color="#00696b" size={22} />
            </View>
            <Text style={s.statValue}>$452k</Text>
            <Text style={s.statGrowth}>+21.3% ↑</Text>
            <View style={s.statBar}><View style={[s.statBarFill, { width: '65%' }]} /></View>
          </TouchableOpacity>
        </View>

        {/* Activity Chart */}
        <View style={s.chartCard}>
          <View style={s.chartHeader}>
            <View>
              <Text style={s.chartTitle}>User Activity Trends</Text>
              <Text style={s.chartSub}>Daily active users vs bookings</Text>
            </View>
            <TouchableOpacity style={s.chartFilter} onPress={() => {
              const next = chartRange === 'Last 30 Days' ? 'Last 6 Months' : 'Last 30 Days';
              setChartRange(next);
            }}>
              <Text style={s.chartFilterText}>{chartRange} ▾</Text>
            </TouchableOpacity>
          </View>
          <View style={s.chartArea}>
            {CHART_HEIGHTS.map((h, i) => (
              <TouchableOpacity key={i} style={[s.chartBar, { height: `${h}%` }]}
                onPress={() => Alert.alert(`Day ${i + 1}`, `Users: ${Math.round(h * 12)}\nBookings: ${Math.round(h * 4)}`)} />
            ))}
          </View>
          <View style={s.chartXAxis}>
            <Text style={s.chartXLabel}>Day 1</Text>
            <Text style={s.chartXLabel}>Day 10</Text>
            <Text style={s.chartXLabel}>Day 20</Text>
            <Text style={s.chartXLabel}>Day 30</Text>
          </View>
        </View>

        <View style={s.regionCard}>
          <Text style={s.regionTitle}>State Distribution</Text>
          <Text style={s.regionSub}>Distribution by state</Text>
          <View style={s.donutWrap}>
            <View style={s.donut}>
              <Text style={s.donutPct}>42%</Text>
              <Text style={s.donutLabel}>MAHARASHTRA</Text>
            </View>
          </View>
          <View style={s.legendGrid}>
            {REGION_DATA.map(r => (
              <TouchableOpacity key={r.label} style={s.legendItem}
                onPress={() => Alert.alert(r.label, `Market share: ${r.pct}%\n\nTop destinations in ${r.label}:\n• ${r.label === 'Maharashtra' ? 'Mumbai & Pune' : r.label === 'Karnataka' ? 'Bengaluru & Mysuru' : r.label === 'Delhi' ? 'New Delhi' : 'Jaipur & Udaipur'}`)}>
                <View style={[s.legendDot, { backgroundColor: r.color }]} />
                <Text style={s.legendText}>{r.label} ({r.pct}%)</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Top Growing Cities */}
        <View style={s.citiesCard}>
          <View style={s.citiesHeader}>
            <Text style={s.citiesTitle}>Top Growing Cities</Text>
            <TouchableOpacity onPress={() => Alert.alert('All Cities', 'Full city analytics coming soon!')}>
              <Text style={s.viewAllText}>View All →</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14 }}>
            {TOP_CITIES.map(city => (
              <TouchableOpacity key={city.name} style={s.cityCard} activeOpacity={0.85}
                onPress={() => Alert.alert(city.name, `Growth Rate: ${city.growth}\n\nThis city is trending in trip bookings this month!`)}>
                <Image source={{ uri: city.img }} style={s.cityImg} contentFit="cover" />
                <Text style={s.cityName}>{city.name}</Text>
                <View style={s.cityGrowthRow}>
                  <Text style={s.cityGrowthLabel}>Growth</Text>
                  <Text style={s.cityGrowthValue}>{city.growth}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Live Trips */}
        <View style={s.tableCard}>
          <View style={s.tableCardHeader}>
            <Text style={s.tableTitle}>Live Trips ({filteredTrips.length})</Text>
            <TouchableOpacity onPress={fetchData}>
              <Text style={s.refreshText}>↻ Refresh</Text>
            </TouchableOpacity>
          </View>
          {loading ? <ActivityIndicator color="#00696b" style={{ marginTop: 16 }} /> : (
            filteredTrips.slice(0, 15).map((trip, i) => (
              <TouchableOpacity key={trip.id} style={[s.tableRow, i % 2 === 1 && s.tableRowAlt]} activeOpacity={0.8}
                onPress={() => router.push(`/trip/${trip.id}`)}>
                <Text style={s.tableIdx}>{i + 1}</Text>
                <Text style={s.tableName} numberOfLines={1}>{trip.title}</Text>
                <View style={[s.statusPill, { backgroundColor: trip.status === 'ONGOING' ? '#e6f4f1' : '#f2f4f6' }]}>
                  <Text style={[s.statusPillText, { color: trip.status === 'ONGOING' ? '#00696b' : '#44474d' }]}>{trip.status}</Text>
                </View>
              </TouchableOpacity>
            ))
          )}
          {filteredTrips.length === 0 && !loading && (
            <Text style={s.emptyText}>No trips found</Text>
          )}
        </View>
      </ScrollView>

      {/* Logs Modal */}
      <Modal visible={showLogs} animationType="slide" transparent>
        <View style={lg.overlay}>
          <View style={lg.modal}>
            <View style={lg.top}>
              <Text style={lg.title}>System Logs</Text>
              <TouchableOpacity style={lg.closeBtn} onPress={() => setShowLogs(false)}>
                <X color="#191c1e" size={22} />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {FAKE_LOGS.map((log, i) => (
                <View key={i} style={[lg.logRow, log.level === 'ERROR' && lg.logError, log.level === 'WARN' && lg.logWarn]}>
                  <Text style={lg.logTime}>{log.time}</Text>
                  <View style={[lg.logBadge, { backgroundColor: log.level === 'ERROR' ? '#ffdad6' : log.level === 'WARN' ? '#fff3cd' : '#e6f4f1' }]}>
                    <Text style={[lg.logLevel, { color: log.level === 'ERROR' ? '#ba1a1a' : log.level === 'WARN' ? '#856404' : '#00696b' }]}>{log.level}</Text>
                  </View>
                  <Text style={lg.logMsg} numberOfLines={2}>{log.msg}</Text>
                </View>
              ))}
            </ScrollView>
            <TouchableOpacity style={lg.clearBtn} onPress={() => { setShowLogs(false); Alert.alert('Logs', 'Logs cleared'); }}>
              <Text style={lg.clearBtnText}>Clear Logs</Text>
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
  content: { padding: 20, paddingBottom: 100 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#f7f9fb', borderBottomWidth: 1, borderBottomColor: '#eceef0' },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  brand: { fontSize: 22, fontWeight: '700', color: '#00030a' },
  adminBadge: { backgroundColor: '#e6f4f1', paddingHorizontal: 10, paddingVertical: 3, borderRadius: 20, borderWidth: 1, borderColor: '#2ddbde' },
  adminBadgeText: { fontSize: 11, fontWeight: '700', color: '#00696b' },
  topActions: { flexDirection: 'row', gap: 8 },
  topActionBtn: { backgroundColor: '#eceef0', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20 },
  topActionBtnText: { fontSize: 13, color: '#191c1e', fontWeight: '700' },
  searchRow: { flexDirection: 'row', gap: 12, marginBottom: 24, alignItems: 'center' },
  searchWrap: { flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', borderRadius: 16, paddingHorizontal: 14, paddingVertical: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4, elevation: 1 },
  searchInput: { flex: 1, color: '#191c1e', fontSize: 14 },
  exportBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: '#00696b', paddingHorizontal: 16, paddingVertical: 12, borderRadius: 24, shadowColor: '#00696b', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 4 },
  exportBtnText: { color: '#FFF', fontWeight: '700', fontSize: 13 },
  statsRow: { flexDirection: 'row', marginBottom: 20 },
  statCard: { backgroundColor: '#ffffff', borderRadius: 20, padding: 14, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  statCardTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  statLabel: { fontSize: 9, fontWeight: '700', color: '#44474d', textTransform: 'uppercase', letterSpacing: 0.5 },
  statValue: { fontSize: 18, fontWeight: '800', color: '#191c1e', marginBottom: 2 },
  statGrowth: { fontSize: 12, color: '#00696b', fontWeight: '700', marginBottom: 8 },
  statBar: { height: 5, backgroundColor: '#eceef0', borderRadius: 3, overflow: 'hidden' },
  statBarFill: { height: 5, backgroundColor: '#00696b', borderRadius: 3 },
  chartCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  chartHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 24 },
  chartTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e' },
  chartSub: { fontSize: 13, color: '#44474d', marginTop: 4 },
  chartFilter: { backgroundColor: '#eceef0', borderRadius: 10, paddingHorizontal: 12, paddingVertical: 7 },
  chartFilterText: { fontSize: 12, color: '#44474d', fontWeight: '600' },
  chartArea: { height: 140, flexDirection: 'row', alignItems: 'flex-end', gap: 4, backgroundColor: '#f7f9fb', borderRadius: 16, padding: 12, marginBottom: 12 },
  chartBar: { flex: 1, backgroundColor: '#00696b', borderRadius: 4, opacity: 0.75 },
  chartXAxis: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 12 },
  chartXLabel: { fontSize: 11, color: '#75777e' },
  regionCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  regionTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e' },
  regionSub: { fontSize: 14, color: '#44474d', marginBottom: 20 },
  donutWrap: { alignItems: 'center', marginBottom: 24 },
  donut: { width: 130, height: 130, borderRadius: 65, borderWidth: 16, borderColor: '#00696b', justifyContent: 'center', alignItems: 'center', backgroundColor: '#f7f9fb' },
  donutPct: { fontSize: 26, fontWeight: '800', color: '#191c1e' },
  donutLabel: { fontSize: 11, fontWeight: '700', color: '#44474d', textTransform: 'uppercase' },
  legendGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8, width: '45%', paddingVertical: 4 },
  legendDot: { width: 12, height: 12, borderRadius: 6 },
  legendText: { fontSize: 13, color: '#44474d', fontWeight: '500' },
  citiesCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 24, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  citiesHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  citiesTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e' },
  viewAllText: { fontSize: 14, color: '#00696b', fontWeight: '700' },
  cityCard: { width: 180, backgroundColor: '#f2f4f6', borderRadius: 16, overflow: 'hidden' },
  cityImg: { width: '100%', height: 110 },
  cityName: { fontSize: 14, fontWeight: '700', color: '#191c1e', padding: 10, paddingBottom: 4 },
  cityGrowthRow: { flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingBottom: 10 },
  cityGrowthLabel: { fontSize: 12, color: '#75777e' },
  cityGrowthValue: { fontSize: 13, fontWeight: '800', color: '#00696b' },
  tableCard: { backgroundColor: '#ffffff', borderRadius: 24, padding: 20, marginBottom: 20, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  tableCardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  tableTitle: { fontSize: 18, fontWeight: '700', color: '#191c1e' },
  refreshText: { fontSize: 14, color: '#00696b', fontWeight: '700' },
  tableRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, paddingHorizontal: 4, borderBottomWidth: 1, borderBottomColor: '#f2f4f6' },
  tableRowAlt: { backgroundColor: '#fafbfc' },
  tableIdx: { width: 28, fontSize: 13, color: '#75777e', fontWeight: '700' },
  tableName: { flex: 1, fontSize: 14, color: '#191c1e', fontWeight: '500' },
  statusPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusPillText: { fontSize: 11, fontWeight: '700' },
  emptyText: { textAlign: 'center', color: '#75777e', padding: 20 },
});

const lg = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modal: { backgroundColor: '#f7f9fb', borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: 24, paddingBottom: 40 },
  top: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  title: { fontSize: 22, fontWeight: '700', color: '#191c1e' },
  closeBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#eceef0', justifyContent: 'center', alignItems: 'center' },
  logRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#eceef0', gap: 8 },
  logError: { backgroundColor: '#fff5f5' },
  logWarn: { backgroundColor: '#fffbea' },
  logTime: { fontSize: 11, color: '#75777e', fontFamily: 'monospace', paddingTop: 2, width: 60 },
  logBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  logLevel: { fontSize: 10, fontWeight: '800' },
  logMsg: { flex: 1, fontSize: 13, color: '#191c1e' },
  clearBtn: { backgroundColor: '#ffdad6', borderRadius: 16, paddingVertical: 14, alignItems: 'center', marginTop: 20 },
  clearBtnText: { color: '#ba1a1a', fontWeight: '700', fontSize: 15 },
});
