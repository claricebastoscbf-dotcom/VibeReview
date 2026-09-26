import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  Album,
  Artist,
  Track,
  Review,
  NotificationItemData,
  Achievement,
  AppView,
  AuthMode,
  ContentType,
} from '../types';
import {
  INITIAL_USER,
  MOCK_COMMUNITY_USERS,
  MOCK_ALBUMS,
  MOCK_ARTISTS,
  MOCK_TRACKS,
  MOCK_REVIEWS,
  MOCK_NOTIFICATIONS,
  MOCK_ACHIEVEMENTS,
} from '../data/mockData';
import { getRatingLabel } from '../utils/rating';
import { isSupabaseConfigured } from '../services/supabase';
import {
  getInitialSession,
  signInUser,
  signUpUser,
  signOutUser,
  signInWithGoogleOAuth,
  resetUserPassword,
} from '../services/authService';
import { createReviewDb, deleteReviewDb } from '../services/databaseService';
import { seo } from '../utils/seo';

export interface RouteParams {
  reviewId?: string;
  albumId?: string;
  artistId?: string;
  trackId?: string;
  username?: string;
}

export interface ReviewDraft {
  contentType: ContentType;
  selectedItem: {
    id: string;
    title: string;
    artist: string;
    coverUrl: string;
    year: number;
    genre: string;
  } | null;
  rating: number;
  title: string;
  content: string;
  tags: string[];
  recommends: boolean;
  wantToListenAgain: boolean;
  isFavorite: boolean;
  favoriteTrack?: string;
}

interface AppContextType {
  authMode: AuthMode;
  setAuthMode: (mode: AuthMode) => void;
  currentUser: User;
  currentView: AppView;
  setCurrentView: (view: AppView) => void;
  routeParams: RouteParams;
  navigateTo: (view: AppView, params?: RouteParams) => void;

  // Supabase status
  isSupabaseActive: boolean;

  // Selected for quick modal
  selectedAlbumForReview: Album | null;
  isCreateReviewOpen: boolean;
  openCreateReview: (album?: Album) => void;
  closeCreateReview: () => void;

  // Core data
  albums: Album[];
  artists: Artist[];
  tracks: Track[];
  reviews: Review[];
  notifications: NotificationItemData[];
  achievements: Achievement[];
  communityUsers: User[];

  // Review & Social Actions
  addReview: (newReviewData: {
    contentType: ContentType;
    contentId: string;
    albumTitle: string;
    albumArtist: string;
    albumCover: string;
    releaseYear?: number;
    genre?: string;
    rating: number;
    title: string;
    content: string;
    tags?: string[];
    recommends?: boolean;
    wantToListenAgain?: boolean;
    isFavorite?: boolean;
    favoriteTrack?: string;
  }) => Promise<Review>;

  updateReview: (reviewId: string, updates: Partial<Review>) => void;
  deleteReview: (reviewId: string) => Promise<boolean>;

  toggleLikeReview: (reviewId: string) => void;
  toggleSaveReview: (reviewId: string) => void;
  addCommentToReview: (reviewId: string, text: string) => void;
  deleteComment: (reviewId: string, commentId: string) => void;
  addReplyToComment: (reviewId: string, commentId: string, text: string) => void;
  toggleLikeComment: (reviewId: string, commentId: string) => void;
  toggleLikeReply: (reviewId: string, commentId: string, replyId: string) => void;

  // Library & Favorites toggles
  toggleFavoriteAlbum: (albumId: string) => void;
  toggleWatchlistAlbum: (albumId: string) => void;
  toggleListenedAlbum: (albumId: string) => void;
  toggleFavoriteTrack: (trackId: string) => void;
  toggleFollowArtist: (artistId: string) => void;
  toggleFollowUser: (userId: string) => void;

  // Review Draft
  reviewDraft: ReviewDraft | null;
  saveReviewDraft: (draft: ReviewDraft) => void;
  clearReviewDraft: () => void;

  // Toast System
  toastMessage: string | null;
  showToast: (msg: string) => void;

  // Notifications
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  unreadNotificationsCount: number;

  // Global Search
  searchQuery: string;
  setSearchQuery: (query: string) => void;

  // Real Auth actions
  login: (credential: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, username: string, email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<{ success: boolean; error?: string }>;
  finishOnboarding: (selectedGenres: string[], selectedArtists: string[]) => void;
  skipOnboarding: () => void;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Protected routes list
const PROTECTED_VIEWS: AppView[] = [
  'inicio',
  'explorar',
  'resenhas',
  'biblioteca',
  'artistas',
  'notificacoes',
  'perfil',
  'configuracoes',
  'create-review',
  'achievements',
];

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authMode, setAuthMode] = useState<AuthMode>('authenticated');
  const [currentUser, setCurrentUser] = useState<User>(INITIAL_USER);
  const [currentView, setCurrentView] = useState<AppView>('inicio');
  const [routeParams, setRouteParams] = useState<RouteParams>({});

  const [albums, setAlbums] = useState<Album[]>(MOCK_ALBUMS);
  const [artists, setArtists] = useState<Artist[]>(MOCK_ARTISTS);
  const [tracks, setTracks] = useState<Track[]>(MOCK_TRACKS);
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [notifications, setNotifications] = useState<NotificationItemData[]>(MOCK_NOTIFICATIONS);
  const [achievements, setAchievements] = useState<Achievement[]>(MOCK_ACHIEVEMENTS);
  const [communityUsers, setCommunityUsers] = useState<User[]>(MOCK_COMMUNITY_USERS);

  const [isCreateReviewOpen, setIsCreateReviewOpen] = useState(false);
  const [selectedAlbumForReview, setSelectedAlbumForReview] = useState<Album | null>(null);
  const [reviewDraft, setReviewDraft] = useState<ReviewDraft | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const isSupabaseActive = isSupabaseConfigured();

  // Restore authenticated session on mount
  useEffect(() => {
    let isMounted = true;
    getInitialSession().then(user => {
      if (isMounted && user) {
        setCurrentUser(user);
        setAuthMode('authenticated');
      }
    });
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(prev => (prev === msg ? null : prev));
    }, 3500);
  };

  // Route protection and navigation
  const navigateTo = (view: AppView, params: RouteParams = {}) => {
    if (authMode !== 'authenticated' && PROTECTED_VIEWS.includes(view)) {
      setAuthMode('login');
      showToast('Faça login para acessar esta página.');
      return;
    }

    setRouteParams(params);
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Dynamic SEO updates based on target view
    if (view === 'inicio') {
      seo.home();
    } else if (view === 'album-detail' && params.albumId) {
      const alb = albums.find(a => a.id === params.albumId);
      if (alb) seo.album(alb.title, alb.artist, alb.coverUrl);
    } else if (view === 'artist-detail' && params.artistId) {
      const art = artists.find(a => a.id === params.artistId);
      if (art) seo.artist(art.name, art.genres, art.avatarUrl);
    } else if (view === 'track-detail' && params.trackId) {
      const trk = tracks.find(t => t.id === params.trackId);
      if (trk) seo.track(trk.title, trk.artist, trk.coverUrl);
    } else if (view === 'review-detail' && params.reviewId) {
      const rev = reviews.find(r => r.id === params.reviewId);
      if (rev) seo.review(rev.title, rev.albumTitle, rev.userName, rev.rating);
    } else if (view === 'perfil') {
      seo.profile(currentUser.name, currentUser.username, currentUser.avatar);
    }
  };

  const openCreateReview = (album?: Album) => {
    if (authMode !== 'authenticated') {
      setAuthMode('login');
      showToast('Entre com sua conta para criar uma resenha.');
      return;
    }
    setSelectedAlbumForReview(album || null);
    setIsCreateReviewOpen(true);
  };

  const closeCreateReview = () => {
    setIsCreateReviewOpen(false);
    setSelectedAlbumForReview(null);
  };

  const saveReviewDraft = (draft: ReviewDraft) => {
    setReviewDraft(draft);
    showToast('Rascunho salvo com sucesso!');
  };

  const clearReviewDraft = () => {
    setReviewDraft(null);
  };

  const addReview = async (newReviewData: {
    contentType: ContentType;
    contentId: string;
    albumTitle: string;
    albumArtist: string;
    albumCover: string;
    releaseYear?: number;
    genre?: string;
    rating: number;
    title: string;
    content: string;
    tags?: string[];
    recommends?: boolean;
    wantToListenAgain?: boolean;
    isFavorite?: boolean;
    favoriteTrack?: string;
  }): Promise<Review> => {
    const label = getRatingLabel(newReviewData.rating);
    const draftPayload = {
      ...newReviewData,
      ratingLabel: label,
    };

    // Database persistence
    const { review: createdRev } = await createReviewDb(draftPayload, currentUser);

    const newRev: Review = createdRev || {
      ...draftPayload,
      id: `rev_${Date.now()}`,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      userAvatar: currentUser.avatar,
      likesCount: 0,
      commentsCount: 0,
      createdAt: 'Agora mesmo',
      isLikedByMe: false,
      isSavedByMe: false,
      comments: [],
    };

    setReviews(prev => [newRev, ...prev]);

    // Update user stats
    setCurrentUser(prev => ({
      ...prev,
      reviewsCount: prev.reviewsCount + 1,
      stats: prev.stats
        ? {
            ...prev.stats,
            totalReviews: prev.stats.totalReviews + 1,
            totalAlbumsReviewed:
              newReviewData.contentType === 'album'
                ? prev.stats.totalAlbumsReviewed + 1
                : prev.stats.totalAlbumsReviewed,
            totalTracksReviewed:
              newReviewData.contentType === 'musica'
                ? prev.stats.totalTracksReviewed + 1
                : prev.stats.totalTracksReviewed,
          }
        : undefined,
    }));

    closeCreateReview();
    clearReviewDraft();
    showToast('Resenha publicada com sucesso! 🎉');
    return newRev;
  };

  const updateReview = (reviewId: string, updates: Partial<Review>) => {
    setReviews(prev =>
      prev.map(rev => {
        if (rev.id === reviewId) {
          // Check ownership (RLS enforcement)
          if (rev.userId !== currentUser.id) {
            showToast('Você só pode editar suas próprias resenhas.');
            return rev;
          }
          return { ...rev, ...updates, updatedAt: 'Agora mesmo' };
        }
        return rev;
      })
    );
    showToast('Resenha atualizada com sucesso!');
  };

  const deleteReview = async (reviewId: string): Promise<boolean> => {
    const target = reviews.find(r => r.id === reviewId);
    if (!target) return false;

    // Row Level Security check: user can only delete own reviews
    if (target.userId !== currentUser.id) {
      showToast('Apenas o autor pode excluir esta resenha.');
      return false;
    }

    await deleteReviewDb(reviewId, currentUser.id);

    setReviews(prev => prev.filter(r => r.id !== reviewId));
    setCurrentUser(prev => ({
      ...prev,
      reviewsCount: Math.max(0, prev.reviewsCount - 1),
    }));

    showToast('Resenha excluída com sucesso.');
    if (currentView === 'review-detail') {
      navigateTo('resenhas');
    }
    return true;
  };

  const toggleLikeReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(rev => {
        if (rev.id === reviewId) {
          const isLiked = !rev.isLikedByMe;
          return {
            ...rev,
            isLikedByMe: isLiked,
            likesCount: isLiked ? rev.likesCount + 1 : Math.max(0, rev.likesCount - 1),
          };
        }
        return rev;
      })
    );
  };

  const toggleSaveReview = (reviewId: string) => {
    setReviews(prev =>
      prev.map(rev => (rev.id === reviewId ? { ...rev, isSavedByMe: !rev.isSavedByMe } : rev))
    );

    setCurrentUser(prev => {
      const currentSaved = prev.savedReviewIds || [];
      const isAlreadySaved = currentSaved.includes(reviewId);
      const nextSaved = isAlreadySaved
        ? currentSaved.filter(id => id !== reviewId)
        : [...currentSaved, reviewId];

      showToast(isAlreadySaved ? 'Resenha removida dos salvos.' : 'Resenha salva na sua biblioteca! 📌');
      return { ...prev, savedReviewIds: nextSaved };
    });
  };

  const addCommentToReview = (reviewId: string, text: string) => {
    if (!text.trim()) return;

    const newComment = {
      id: `comm_${Date.now()}`,
      reviewId,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'Agora mesmo',
      likesCount: 0,
      isLikedByMe: false,
      replies: [],
    };

    setReviews(prev =>
      prev.map(rev => {
        if (rev.id === reviewId) {
          const updatedComments = [newComment, ...(rev.comments || [])];
          return {
            ...rev,
            commentsCount: rev.commentsCount + 1,
            comments: updatedComments,
          };
        }
        return rev;
      })
    );
    showToast('Comentário publicado!');
  };

  const deleteComment = (reviewId: string, commentId: string) => {
    setReviews(prev =>
      prev.map(rev => {
        if (rev.id === reviewId) {
          const comment = (rev.comments || []).find(c => c.id === commentId);
          if (comment && comment.userId !== currentUser.id) {
            showToast('Você só pode excluir seus próprios comentários.');
            return rev;
          }
          const filteredComments = (rev.comments || []).filter(c => c.id !== commentId);
          return {
            ...rev,
            commentsCount: Math.max(0, rev.commentsCount - 1),
            comments: filteredComments,
          };
        }
        return rev;
      })
    );
    showToast('Comentário excluído.');
  };

  const addReplyToComment = (reviewId: string, commentId: string, text: string) => {
    if (!text.trim()) return;

    const newReply = {
      id: `rep_${Date.now()}`,
      commentId,
      userId: currentUser.id,
      userName: currentUser.name,
      userUsername: currentUser.username,
      userAvatar: currentUser.avatar,
      text: text.trim(),
      createdAt: 'Agora mesmo',
      likesCount: 0,
      isLikedByMe: false,
    };

    setReviews(prev =>
      prev.map(rev => {
        if (rev.id === reviewId) {
          const updatedComments = (rev.comments || []).map(comm => {
            if (comm.id === commentId) {
              return {
                ...comm,
                replies: [...(comm.replies || []), newReply],
              };
            }
            return comm;
          });
          return {
            ...rev,
            commentsCount: rev.commentsCount + 1,
            comments: updatedComments,
          };
        }
        return rev;
      })
    );
    showToast('Resposta enviada!');
  };

  const toggleLikeComment = (reviewId: string, commentId: string) => {
    setReviews(prev =>
      prev.map(rev => {
        if (rev.id === reviewId) {
          const updatedComments = (rev.comments || []).map(comm => {
            if (comm.id === commentId) {
              const liked = !comm.isLikedByMe;
              return {
                ...comm,
                isLikedByMe: liked,
                likesCount: liked ? comm.likesCount + 1 : Math.max(0, comm.likesCount - 1),
              };
            }
            return comm;
          });
          return { ...rev, comments: updatedComments };
        }
        return rev;
      })
    );
  };

  const toggleLikeReply = (reviewId: string, commentId: string, replyId: string) => {
    setReviews(prev =>
      prev.map(rev => {
        if (rev.id === reviewId) {
          const updatedComments = (rev.comments || []).map(comm => {
            if (comm.id === commentId) {
              const updatedReplies = (comm.replies || []).map(rep => {
                if (rep.id === replyId) {
                  const liked = !rep.isLikedByMe;
                  return {
                    ...rep,
                    isLikedByMe: liked,
                    likesCount: liked ? rep.likesCount + 1 : Math.max(0, rep.likesCount - 1),
                  };
                }
                return rep;
              });
              return { ...comm, replies: updatedReplies };
            }
            return comm;
          });
          return { ...rev, comments: updatedComments };
        }
        return rev;
      })
    );
  };

  const toggleFavoriteAlbum = (albumId: string) => {
    setCurrentUser(prev => {
      const favs = prev.favoriteAlbumIds || [];
      const exists = favs.includes(albumId);
      const next = exists ? favs.filter(id => id !== albumId) : [...favs, albumId];
      showToast(exists ? 'Removido dos álbuns favoritos.' : 'Adicionado aos álbuns favoritos! ❤️');
      return { ...prev, favoriteAlbumIds: next };
    });
  };

  const toggleWatchlistAlbum = (albumId: string) => {
    setCurrentUser(prev => {
      const watchlist = prev.watchlistAlbumIds || [];
      const exists = watchlist.includes(albumId);
      const next = exists ? watchlist.filter(id => id !== albumId) : [...watchlist, albumId];
      showToast(exists ? 'Removido da lista de Quero Ouvir.' : 'Salvo na lista "Quero Ouvir"! 🎧');
      return { ...prev, watchlistAlbumIds: next };
    });
  };

  const toggleListenedAlbum = (albumId: string) => {
    setCurrentUser(prev => {
      const listened = prev.listenedAlbumIds || [];
      const exists = listened.includes(albumId);
      const next = exists ? listened.filter(id => id !== albumId) : [...listened, albumId];
      showToast(exists ? 'Marcado como não ouvido.' : 'Marcado como ouvido! ✓');
      return {
        ...prev,
        listenedAlbumIds: next,
        albumsListenedCount: exists ? prev.albumsListenedCount - 1 : prev.albumsListenedCount + 1,
      };
    });
  };

  const toggleFavoriteTrack = (trackId: string) => {
    setCurrentUser(prev => {
      const favs = prev.favoriteTrackIds || [];
      const exists = favs.includes(trackId);
      const next = exists ? favs.filter(id => id !== trackId) : [...favs, trackId];
      showToast(exists ? 'Música removida dos favoritos.' : 'Música adicionada aos favoritos! 🎵');
      return { ...prev, favoriteTrackIds: next };
    });
  };

  const toggleFollowArtist = (artistId: string) => {
    setArtists(prev =>
      prev.map(artist => {
        if (artist.id === artistId) {
          const isNowFollowed = !artist.isFollowed;
          showToast(isNowFollowed ? `Você agora segue ${artist.name}!` : `Você deixou de seguir ${artist.name}.`);
          return {
            ...artist,
            isFollowed: isNowFollowed,
            followersCount: isNowFollowed ? artist.followersCount + 1 : artist.followersCount - 1,
          };
        }
        return artist;
      })
    );
  };

  const toggleFollowUser = (userId: string) => {
    setCommunityUsers(prev =>
      prev.map(u => {
        if (u.id === userId) {
          const next = !u.isFollowedByMe;
          showToast(next ? `Você agora segue @${u.username}!` : `Você deixou de seguir @${u.username}.`);
          return {
            ...u,
            isFollowedByMe: next,
            followersCount: next ? u.followersCount + 1 : u.followersCount - 1,
          };
        }
        return u;
      })
    );
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev =>
      prev.map(notif => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    showToast('Todas as notificações foram marcadas como lidas.');
  };

  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  // Real Supabase Authentication Methods
  const login = async (
    credential: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { user, error } = await signInUser({
      email: credential,
      password: password || 'Default123!',
    });

    if (error || !user) {
      return { success: false, error: error || 'Falha ao autenticar' };
    }

    setCurrentUser(user);
    setAuthMode('authenticated');
    navigateTo('inicio');
    showToast(`Bem-vindo de volta, ${user.name}!`);
    return { success: true };
  };

  const register = async (
    name: string,
    username: string,
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { user, error } = await signUpUser({
      name,
      username,
      email,
      password,
    });

    if (error || !user) {
      return { success: false, error: error || 'Falha ao registrar' };
    }

    setCurrentUser(user);
    setAuthMode('onboarding');
    return { success: true };
  };

  const loginWithGoogle = async (): Promise<void> => {
    const { error } = await signInWithGoogleOAuth();
    if (error) {
      showToast(error);
    } else {
      // In local demo or after OAuth return
      setCurrentUser(prev => ({
        ...prev,
        name: 'Usuário Google',
        username: 'googleuser',
        email: 'user@gmail.com',
      }));
      setAuthMode('authenticated');
      navigateTo('inicio');
      showToast('Autenticado com sucesso via Google!');
    }
  };

  const requestPasswordReset = async (
    email: string
  ): Promise<{ success: boolean; error?: string }> => {
    const { error } = await resetUserPassword(email);
    if (error) {
      return { success: false, error };
    }
    return { success: true };
  };

  const finishOnboarding = (selectedGenres: string[], selectedArtists: string[]) => {
    setCurrentUser(prev => ({
      ...prev,
      favoriteGenres: selectedGenres,
      favoriteArtists: selectedArtists,
    }));
    setAuthMode('authenticated');
    navigateTo('inicio');
    showToast('Bem-vindo ao VibeReview! Explore suas recomendações.');
  };

  const skipOnboarding = () => {
    setAuthMode('authenticated');
    navigateTo('inicio');
  };

  const logout = async () => {
    await signOutUser();
    setAuthMode('login');
    showToast('Você saiu da sua conta.');
  };

  const updateProfile = (updates: Partial<User>) => {
    setCurrentUser(prev => ({ ...prev, ...updates }));
    showToast('Perfil atualizado com sucesso!');
  };

  return (
    <AppContext.Provider
      value={{
        authMode,
        setAuthMode,
        currentUser,
        currentView,
        setCurrentView,
        routeParams,
        navigateTo,
        isSupabaseActive,
        selectedAlbumForReview,
        isCreateReviewOpen,
        openCreateReview,
        closeCreateReview,
        albums,
        artists,
        tracks,
        reviews,
        notifications,
        achievements,
        communityUsers,
        addReview,
        updateReview,
        deleteReview,
        toggleLikeReview,
        toggleSaveReview,
        addCommentToReview,
        deleteComment,
        addReplyToComment,
        toggleLikeComment,
        toggleLikeReply,
        toggleFavoriteAlbum,
        toggleWatchlistAlbum,
        toggleListenedAlbum,
        toggleFavoriteTrack,
        toggleFollowArtist,
        toggleFollowUser,
        reviewDraft,
        saveReviewDraft,
        clearReviewDraft,
        toastMessage,
        showToast,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        unreadNotificationsCount,
        searchQuery,
        setSearchQuery,
        login,
        register,
        loginWithGoogle,
        requestPasswordReset,
        finishOnboarding,
        skipOnboarding,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
