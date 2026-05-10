import Constants from 'expo-constants';
import { Platform } from 'react-native';

let backendHost = '192.168.0.103';
const debuggerHost = Constants.expoConfig?.hostUri || (Constants as any).manifest?.debuggerHost || (Constants as any).manifest2?.extra?.expoGo?.debuggerHost;

if (debuggerHost) {
  backendHost = debuggerHost.split(':')[0];
}
// Fallback is already initialized to '192.168.0.103' which works for real devices on LAN.
// Emulator/Simulator specific overrides can be added if needed, but LAN IP is generally safer for Expo Go.

export const API_BASE = `http://${backendHost}:3001/api/v1`;

export async function apiRequest<T = any>(
  endpoint: string,
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
  body?: any,
  token?: string | null
): Promise<{ success: boolean; data?: T; message?: string; statusCode?: number }> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();

    // Log for debugging
    if (!res.ok) {
      console.warn(`[API ${res.status}] ${method} ${endpoint}:`, text);
    }

    try {
      const json = JSON.parse(text);
      // NestJS 401/403 shape: { statusCode, message, error }
      if (!res.ok && !json.success) {
        return {
          success: false,
          message: json.message || `Request failed with status ${res.status}`,
          statusCode: res.status,
        };
      }
      return json;
    } catch {
      return {
        success: false,
        message: `Server error (${res.status}): ${text.slice(0, 100)}`,
        statusCode: res.status,
      };
    }
  } catch (error: any) {
    console.error(`[API] Network error on ${method} ${endpoint}:`, error.message);
    return { success: false, message: 'Cannot connect to backend. Check your Wi-Fi and that the server is running.', statusCode: 0 };
  }
}
