// API Configuration and Service Layer
const API_BASE_URL = 'http://127.0.0.1:8000';

// Token management
export const getAccessToken = () => localStorage.getItem('access_token');
export const getRefreshToken = () => localStorage.getItem('refresh_token');
export const setTokens = (access: string, refresh: string) => {
  localStorage.setItem('access_token', access);
  localStorage.setItem('refresh_token', refresh);
};
export const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// User management
export const getStoredUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};
export const setStoredUser = (user: User) => {
  localStorage.setItem('user', JSON.stringify(user));
};

// Types matching backend
export interface User {
  id: number;
  username: string;
  email: string;
  is_staff: boolean;
}

export interface Member {
  id: number;
  nom: string;
  prenom: string;
  age: number;
  telephone: string;
  email?: string;
  actif?: boolean;
  date_inscription?: string;
}

export interface Activity {
  id: number;
  code_act: string;
  nom_act: string;
  tarif_mensuel: number;
  capacite: number;
  photo?: string;
}

export interface Enrollment {
  id: number;
  membre_id: number;
  membre_nom: string;
  membre_prenom: string;
  activite_id: number;
  activite_nom: string;
  date_inscription: string;
}

export interface StatsOverview {
  total_members: number;
  most_popular_activity: {
    nom: string;
    inscriptions: number;
  } | null;
  least_popular_activity: {
    nom: string;
    inscriptions: number;
  } | null;
}

export interface ActivityStats {
  code_act: string;
  nom_act: string;
  tarif_mensuel: number;
  capacite: number;
  nb_inscriptions: number;
  places_disponibles: number;
}

// API Helper with automatic token refresh
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const accessToken = getAccessToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };
  
  if (accessToken) {
    (headers as Record<string, string>)['Authorization'] = `Bearer ${accessToken}`;
  }

  console.log('API Request:', {
    url: `${API_BASE_URL}${endpoint}`,
    method: options.method || 'GET',
    hasToken: !!accessToken
  });

  let response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  console.log('API Response:', {
    status: response.status,
    ok: response.ok
  });

  // If token expired, try to refresh
  if (response.status === 401 && getRefreshToken()) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      (headers as Record<string, string>)['Authorization'] = `Bearer ${getAccessToken()}`;
      response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
      });
    } else {
      clearTokens();
      window.location.href = '/login';
      throw new Error('Session expired');
    }
  }

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Request failed' }));
    console.error('API Error:', error);
    throw new Error(error.error || error.detail || `Request failed with status ${response.status}`);
  }

  return response.json();
}

async function refreshAccessToken(): Promise<boolean> {
  try {
    const refreshToken = getRefreshToken();
    const response = await fetch(`${API_BASE_URL}/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: refreshToken }),
    });
    
    if (response.ok) {
      const data = await response.json();
      localStorage.setItem('access_token', data.access);
      return true;
    }
    return false;
  } catch {
    return false;
  }
}

// Auth API
export const authAPI = {
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE_URL}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    const data = await response.json();
    
    if (!response.ok || !data.success) {
      throw new Error(data.error || 'Invalid credentials');
    }
    
    setTokens(data.tokens.access, data.tokens.refresh);
    setStoredUser(data.user);
    
    return data;
  },
  
  logout: async () => {
    try {
      await apiRequest('/auth/logout/', { method: 'POST' });
    } finally {
      clearTokens();
    }
  },
  
  getCurrentUser: () => apiRequest<User>('/auth/me/'),
  
  isAuthenticated: () => !!getAccessToken(),
};

// Members API
export const membersAPI = {
  getAll: (params?: { search?: string; id?: number; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.id) searchParams.set('id', String(params.id));
    if (params?.sort) searchParams.set('sort', params.sort);
    
    const query = searchParams.toString();
    return apiRequest<Member[]>(`/members/${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<Member>(`/members/${id}/`),
  
  create: (data: Omit<Member, 'id'>) => 
    apiRequest<{ id: number; success: boolean }>('/members/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<Member>) =>
    apiRequest<{ success: boolean }>(`/members/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<{ success: boolean }>(`/members/${id}/`, {
      method: 'DELETE',
    }),
};

// Activities API
export const activitiesAPI = {
  getAll: (params?: { search?: string; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sort) searchParams.set('sort', params.sort);
    
    const query = searchParams.toString();
    return apiRequest<Activity[]>(`/activities/${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<Activity>(`/activities/${id}/`),
  
  create: (data: Omit<Activity, 'id'>) =>
    apiRequest<{ id: number; success: boolean }>('/activities/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: Partial<Activity>) =>
    apiRequest<{ success: boolean }>(`/activities/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<{ success: boolean }>(`/activities/${id}/`, {
      method: 'DELETE',
    }),
};

// Enrollments API
export const enrollmentsAPI = {
  getAll: () => apiRequest<Enrollment[]>('/enrollments/'),
  
  getById: (id: number) => apiRequest<Enrollment>(`/enrollments/${id}/`),
  
  create: (data: { membre_id: number; activite_id: number }) =>
    apiRequest<{ id: number; success: boolean }>('/enrollments/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: { membre_id?: number; activite_id?: number }) =>
    apiRequest<{ success: boolean }>(`/enrollments/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<{ success: boolean }>(`/enrollments/${id}/`, {
      method: 'DELETE',
    }),
};

// Statistics API
export const statsAPI = {
  getOverview: () => apiRequest<StatsOverview>('/stats/'),
  
  getActivities: () => apiRequest<ActivityStats[]>('/stats/activities/'),
  
  getMembersPerActivity: () => 
    apiRequest<Record<string, { nom: string; prenom: string }[]>>('/stats/members-per-activity/'),
};

// Subscriptions API
export interface Subscription {
  id: number;
  membre_id: number;
  membre_nom: string;
  type_abonnement: 'MONTHLY' | '3_MONTHS' | '6_MONTHS' | 'ANNUAL';
  type_abonnement_display: string;
  date_debut: string;
  date_fin: string;
  actif: boolean;
}

export const subscriptionsAPI = {
  getAll: (params?: { member_id?: number; actif?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.member_id) searchParams.set('member_id', String(params.member_id));
    if (params?.actif !== undefined) searchParams.set('actif', String(params.actif));
    
    const query = searchParams.toString();
    return apiRequest<Subscription[]>(`/subscriptions/${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<Subscription>(`/subscriptions/${id}/`),
  
  create: (data: { membre_id: number; type_abonnement: string; date_debut: string; actif?: boolean }) =>
    apiRequest<{ id: number; date_fin: string }>('/subscriptions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: { type_abonnement?: string; date_debut?: string; actif?: boolean }) =>
    apiRequest<{ success: boolean; date_fin: string }>(`/subscriptions/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<{ success: boolean }>(`/subscriptions/${id}/`, {
      method: 'DELETE',
    }),
};

// Class Sessions API
export interface ClassSession {
  id: number;
  activite: {
    id: number;
    nom_act: string;
    code_act: string;
  };
  date: string;
  heure_debut: string;
  heure_fin: string;
}

export const classSessionsAPI = {
  getAll: (params?: { activite_id?: number; date?: string; sort?: string }) => {
    const searchParams = new URLSearchParams();
    if (params?.activite_id) searchParams.set('activite_id', String(params.activite_id));
    if (params?.date) searchParams.set('date', params.date);
    if (params?.sort) searchParams.set('sort', params.sort);
    
    const query = searchParams.toString();
    return apiRequest<ClassSession[]>(`/class-sessions/${query ? `?${query}` : ''}`);
  },
  
  getById: (id: number) => apiRequest<ClassSession>(`/class-sessions/${id}/`),
  
  create: (data: { activite_id: string; date: string; heure_debut: string; heure_fin: string }) =>
    apiRequest<{ id: number; success: boolean }>('/class-sessions/', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: number, data: { activite_id?: string; date?: string; heure_debut?: string; heure_fin?: string }) =>
    apiRequest<{ success: boolean }>(`/class-sessions/${id}/`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: number) =>
    apiRequest<{ success: boolean }>(`/class-sessions/${id}/`, {
      method: 'DELETE',
    }),
};
