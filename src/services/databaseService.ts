import { supabase, isSupabaseConfigured } from './supabase';
import {
  Review,
  ReviewComment,
  NotificationItemData,
  Achievement,
  User,
  Album,
  Artist,
  Track,
} from '../types';
import {
  MOCK_REVIEWS,
  MOCK_NOTIFICATIONS,
  MOCK_ACHIEVEMENTS,
  MOCK_ALBUMS,
  MOCK_ARTISTS,
  MOCK_TRACKS,
} from '../data/mockData';

export interface GetReviewsOptions {
  page?: number;
  limit?: number;
  contentType?: string;
  genre?: string;
  sortBy?: 'recent' | 'popular' | 'rating';
  albumId?: string;
  userId?: string;
}

export interface PaginatedReviews {
  reviews: Review[];
  total: number;
  hasMore: boolean;
  page: number;
}

/**
 * Fetch reviews with pagination, sorting and filters
 */
export async function fetchReviews(
  options: GetReviewsOptions = {},
  fallbackReviews: Review[] = MOCK_REVIEWS
): Promise<PaginatedReviews> {
  const {
    page = 1,
    limit = 6,
    contentType,
    genre,
    sortBy = 'recent',
    albumId,
    userId,
  } = options;

  if (isSupabaseConfigured() && supabase) {
    try {
      let query = supabase.from('reviews').select('*', { count: 'exact' });

      if (contentType && contentType !== 'todos') {
        query = query.eq('content_type', contentType);
      }
      if (genre && genre !== 'Todos') {
        query = query.ilike('genre', `%${genre}%`);
      }
      if (albumId) {
        query = query.eq('album_id', albumId);
      }
      if (userId) {
        query = query.eq('user_id', userId);
      }

      if (sortBy === 'recent') {
        query = query.order('created_at', { ascending: false });
      } else if (sortBy === 'popular') {
        query = query.order('likes_count', { ascending: false });
      } else if (sortBy === 'rating') {
        query = query.order('rating', { ascending: false });
      }

      const from = (page - 1) * limit;
      const to = from + limit - 1;
      query = query.range(from, to);

      const { data, count, error } = await query;
      if (!error && data) {
        const mappedReviews: Review[] = data.map((r: any) => ({
          id: r.id,
          contentType: r.content_type,
          contentId: r.content_id,
          albumId: r.album_id,
          albumTitle: r.album_title,
          albumArtist: r.album_artist,
          albumCover: r.album_cover,
          releaseYear: r.release_year,
          genre: r.genre,
          userId: r.user_id,
          userName: 'Usuário Vibe',
          userUsername: 'vibereviewer',
          userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
          rating: Number(r.rating),
          ratingLabel: r.rating_label,
          title: r.title,
          content: r.content,
          tags: r.tags || [],
          recommends: r.recommends,
          wantToListenAgain: r.want_to_listen_again,
          isFavorite: r.is_favorite,
          favoriteTrack: r.favorite_track,
          likesCount: r.likes_count || 0,
          commentsCount: r.comments_count || 0,
          createdAt: new Date(r.created_at).toLocaleDateString('pt-BR'),
          isLikedByMe: false,
          isSavedByMe: false,
          comments: [],
        }));

        return {
          reviews: mappedReviews,
          total: count || mappedReviews.length,
          hasMore: (count || 0) > to + 1,
          page,
        };
      }
    } catch (err) {
      console.warn('[DatabaseService] Supabase fetch reviews error, using fallback:', err);
    }
  }

  // Local memory / fallback reviews
  let filtered = [...fallbackReviews];

  if (contentType && contentType !== 'todos') {
    filtered = filtered.filter(r => r.contentType === contentType);
  }
  if (genre && genre !== 'Todos') {
    filtered = filtered.filter(r => r.genre?.toLowerCase() === genre.toLowerCase());
  }
  if (albumId) {
    filtered = filtered.filter(r => r.albumId === albumId);
  }
  if (userId) {
    filtered = filtered.filter(r => r.userId === userId);
  }

  if (sortBy === 'recent') {
    // Keep order
  } else if (sortBy === 'popular') {
    filtered.sort((a, b) => b.likesCount - a.likesCount);
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => b.rating - a.rating);
  }

  const start = (page - 1) * limit;
  const pageItems = filtered.slice(start, start + limit);

  return {
    reviews: pageItems,
    total: filtered.length,
    hasMore: start + limit < filtered.length,
    page,
  };
}

/**
 * Creates a review in Supabase or local storage
 */
export async function createReviewDb(
  reviewData: Partial<Review>,
  user: User
): Promise<{ review: Review | null; error: string | null }> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('reviews')
        .insert({
          user_id: user.id,
          content_type: reviewData.contentType,
          content_id: reviewData.contentId,
          album_id: reviewData.albumId || null,
          album_title: reviewData.albumTitle,
          album_artist: reviewData.albumArtist,
          album_cover: reviewData.albumCover,
          release_year: reviewData.releaseYear,
          genre: reviewData.genre,
          rating: reviewData.rating,
          rating_label: reviewData.ratingLabel,
          title: reviewData.title,
          content: reviewData.content,
          tags: reviewData.tags || [],
          recommends: reviewData.recommends ?? true,
          want_to_listen_again: reviewData.wantToListenAgain ?? false,
          is_favorite: reviewData.isFavorite ?? false,
          favorite_track: reviewData.favoriteTrack ?? '',
        })
        .select()
        .single();

      if (error) {
        return { review: null, error: error.message };
      }

      const newReview: Review = {
        id: data.id,
        contentType: data.content_type,
        contentId: data.content_id,
        albumId: data.album_id,
        albumTitle: data.album_title,
        albumArtist: data.album_artist,
        albumCover: data.album_cover,
        releaseYear: data.release_year,
        genre: data.genre,
        userId: user.id,
        userName: user.name,
        userUsername: user.username,
        userAvatar: user.avatar,
        rating: Number(data.rating),
        ratingLabel: data.rating_label,
        title: data.title,
        content: data.content,
        tags: data.tags || [],
        recommends: data.recommends,
        wantToListenAgain: data.want_to_listen_again,
        isFavorite: data.is_favorite,
        favoriteTrack: data.favorite_track,
        likesCount: 0,
        commentsCount: 0,
        createdAt: 'Agora mesmo',
        isLikedByMe: false,
        isSavedByMe: false,
        comments: [],
      };

      return { review: newReview, error: null };
    } catch (err: any) {
      return { review: null, error: err.message || 'Erro ao persistir resenha no Supabase' };
    }
  }

  // Local fallback
  const localReview: Review = {
    id: `rev_${Date.now()}`,
    contentType: reviewData.contentType || 'album',
    contentId: reviewData.contentId || 'local',
    albumId: reviewData.albumId,
    albumTitle: reviewData.albumTitle || 'Álbum',
    albumArtist: reviewData.albumArtist || 'Artista',
    albumCover: reviewData.albumCover || '',
    releaseYear: reviewData.releaseYear,
    genre: reviewData.genre,
    userId: user.id,
    userName: user.name,
    userUsername: user.username,
    userAvatar: user.avatar,
    rating: reviewData.rating || 8.0,
    ratingLabel: reviewData.ratingLabel || 'Muito bom',
    title: reviewData.title || '',
    content: reviewData.content || '',
    tags: reviewData.tags || [],
    recommends: reviewData.recommends ?? true,
    wantToListenAgain: reviewData.wantToListenAgain ?? false,
    isFavorite: reviewData.isFavorite ?? false,
    favoriteTrack: reviewData.favoriteTrack,
    likesCount: 0,
    commentsCount: 0,
    createdAt: 'Agora mesmo',
    isLikedByMe: false,
    isSavedByMe: false,
    comments: [],
  };

  return { review: localReview, error: null };
}

/**
 * Deletes a review from database (verifies user is owner)
 */
export async function deleteReviewDb(reviewId: string, userId: string): Promise<boolean> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { error } = await supabase
        .from('reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', userId);

      return !error;
    } catch {
      return false;
    }
  }
  return true;
}

/**
 * Fetches notifications for a user
 */
export async function fetchUserNotifications(
  userId: string,
  fallback = MOCK_NOTIFICATIONS
): Promise<NotificationItemData[]> {
  if (isSupabaseConfigured() && supabase) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (!error && data && data.length > 0) {
        return data.map((n: any) => ({
          id: n.id,
          type: n.type,
          actorName: n.actor_name,
          actorUsername: n.actor_username,
          actorAvatar: n.actor_avatar,
          message: n.message,
          targetTitle: n.target_title,
          targetId: n.target_id,
          timestamp: new Date(n.created_at).toLocaleDateString('pt-BR'),
          read: n.read,
        }));
      }
    } catch {
      // fallback
    }
  }

  return fallback;
}
