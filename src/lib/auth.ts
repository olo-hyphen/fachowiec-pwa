export interface User {
  id: string;
  email: string;
  full_name?: string;
  created_at: string;
}

export interface Session {
  user: User;
  access_token: string;
  expires_at: number;
}

const STORAGE_KEYS = {
  SESSION: 'fachowiec_session',
  USERS: 'fachowiec_users',
};

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getUsers(): Record<string, { email: string; password: string; full_name?: string; created_at: string }> {
  const users = localStorage.getItem(STORAGE_KEYS.USERS);
  return users ? JSON.parse(users) : {};
}

function saveUsers(users: Record<string, { email: string; password: string; full_name?: string; created_at: string }>): void {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

export function getSession(): Session | null {
  const sessionStr = localStorage.getItem(STORAGE_KEYS.SESSION);
  if (!sessionStr) return null;

  const session = JSON.parse(sessionStr);
  
  if (session.expires_at < Date.now()) {
    localStorage.removeItem(STORAGE_KEYS.SESSION);
    return null;
  }

  return session;
}

function setSession(session: Session): void {
  localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(session));
}

export function clearSession(): void {
  localStorage.removeItem(STORAGE_KEYS.SESSION);
}

export async function signUp(email: string, password: string, fullName?: string): Promise<{ error: Error | null }> {
  const users = getUsers();

  if (users[email]) {
    return { error: new Error('Użytkownik z tym adresem email już istnieje') };
  }

  const userId = generateId();
  const now = new Date().toISOString();

  users[email] = {
    email,
    password,
    full_name: fullName,
    created_at: now,
  };

  saveUsers(users);

  return { error: null };
}

export async function signIn(email: string, password: string): Promise<{ session: Session | null; error: Error | null }> {
  const users = getUsers();
  const user = users[email];

  if (!user) {
    return { session: null, error: new Error('Nieprawidłowy email lub hasło') };
  }

  if (user.password !== password) {
    return { session: null, error: new Error('Nieprawidłowy email lub hasło') };
  }

  const session: Session = {
    user: {
      id: email,
      email: user.email,
      full_name: user.full_name,
      created_at: user.created_at,
    },
    access_token: generateId(),
    expires_at: Date.now() + 7 * 24 * 60 * 60 * 1000,
  };

  setSession(session);

  return { session, error: null };
}

export async function signOut(): Promise<void> {
  clearSession();
}

export function getCurrentUser(): User | null {
  const session = getSession();
  return session?.user ?? null;
}
