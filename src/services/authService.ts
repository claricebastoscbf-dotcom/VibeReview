import { supabase, isSupabaseConfigured } from './supabase';
import { User } from '../types';
import { INITIAL_USER } from '../data/mockData';

export interface AuthCredentials {
  email: string;
  password?: string;
  name?: string;
  username?: string;
}

export interface AuthResponse {
  user: User | null;
  error: string | null;
}

const LOCAL_STORAGE_USER_KEY = 'vibereview_current_user';
const LOCAL_STORAGE_SESSION_KEY = 'vibereview_session_token';

/**
 * Initializes and retrieves the current authenticated user session
 */
export async function getInitialSession(): Promise<User | null> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session?.user) {
        return null;
      }

      // Fetch user profile from public.users table
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profile) {
        return {
          id: profile.id,
          name: profile.name,
          username: profile.username,
          email: profile.email,
          avatar: profile.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          bio: profile.bio || '',
          location: profile.location || '',
          favoriteGenres: [],
          favoriteArtists: [],
          followersCount: profile.followers_count || 0,
          followingCount: profile.following_count || 0,
          reviewsCount: profile.reviews_count || 0,
          albumsListenedCount: profile.albums_listened_count || 0,
          joinedDate: new Date(profile.created_at).toLocaleDateString('pt-BR'),
        };
      }

      return {
        id: session.user.id,
        name: session.user.user_metadata?.name || session.user.email?.split('@')[0] || 'Usuário',
        username: session.user.user_metadata?.username || session.user.email?.split('@')[0] || 'user',
        email: session.user.email || '',
        avatar: session.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        favoriteGenres: [],
        favoriteArtists: [],
        followersCount: 0,
        followingCount: 0,
        reviewsCount: 0,
        albumsListenedCount: 0,
        joinedDate: 'Hoje',
      };
    } catch (err) {
      console.warn('[AuthService] Supabase getSession error:', err);
    }
  }

  // Local storage session fallback
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_USER_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch {
    // ignore
  }

  return INITIAL_USER;
}

/**
 * Real Supabase sign up with email and password
 */
export async function signUpUser({
  email,
  password,
  name,
  username,
}: AuthCredentials): Promise<AuthResponse> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password: password || 'Default123!',
        options: {
          data: {
            name: name || email.split('@')[0],
            username: username || email.split('@')[0],
          },
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      const newUser: User = {
        id: data.user?.id || `user_${Date.now()}`,
        name: name || email.split('@')[0],
        username: username || email.split('@')[0],
        email,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        favoriteGenres: [],
        favoriteArtists: [],
        followersCount: 0,
        followingCount: 0,
        reviewsCount: 0,
        albumsListenedCount: 0,
        joinedDate: 'Hoje',
      };

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(newUser));
      return { user: newUser, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Erro no cadastro com Supabase' };
    }
  }

  // Local persistent simulation
  const localUser: User = {
    id: `user_${Date.now()}`,
    name: name || email.split('@')[0],
    username: username || email.split('@')[0].toLowerCase(),
    email,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    favoriteGenres: [],
    favoriteArtists: [],
    followersCount: 0,
    followingCount: 0,
    reviewsCount: 0,
    albumsListenedCount: 0,
    joinedDate: 'Hoje',
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(localUser));
  return { user: localUser, error: null };
}

/**
 * Real Supabase sign in with email/password
 */
export async function signInUser({
  email,
  password,
}: AuthCredentials): Promise<AuthResponse> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password: password || '',
      });

      if (error) {
        return { user: null, error: error.message };
      }

      const user: User = {
        id: data.user.id,
        name: data.user.user_metadata?.name || email.split('@')[0],
        username: data.user.user_metadata?.username || email.split('@')[0],
        email,
        avatar: data.user.user_metadata?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
        favoriteGenres: [],
        favoriteArtists: [],
        followersCount: 12,
        followingCount: 24,
        reviewsCount: 4,
        albumsListenedCount: 18,
        joinedDate: 'Recentemente',
      };

      localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
      return { user, error: null };
    } catch (err: any) {
      return { user: null, error: err.message || 'Falha na autenticação com Supabase' };
    }
  }

  // Local demo sign in
  const isEmail = email.includes('@');
  const user: User = {
    ...INITIAL_USER,
    name: isEmail ? email.split('@')[0] : email,
    username: isEmail ? email.split('@')[0].toLowerCase() : email.toLowerCase(),
    email: isEmail ? email : `${email}@vibereview.com`,
  };

  localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(user));
  return { user, error: null };
}

/**
 * Supabase Google OAuth sign in
 */
export async function signInWithGoogleOAuth(): Promise<{ error: string | null }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        },
      });
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err.message || 'Erro ao conectar com Google' };
    }
  }

  return { error: null };
}

/**
 * Real Supabase password reset request
 */
export async function resetUserPassword(email: string): Promise<{ error: string | null }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      return { error: error ? error.message : null };
    } catch (err: any) {
      return { error: err.message || 'Erro ao enviar e-mail de recuperação.' };
    }
  }

  return { error: null };
}

/**
 * Sign out and clear stored session
 */
export async function signOutUser(): Promise<void> {
  if (isSupabaseConfigured() && supabase) {
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.warn('[AuthService] Supabase sign out error:', err);
    }
  }

  localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  localStorage.removeItem(LOCAL_STORAGE_SESSION_KEY);
}
