export type ContentType = 'musica' | 'album' | 'ep' | 'artista' | 'banda';

export type RatingLabel =
  | 'Péssimo'
  | 'Fraco'
  | 'Regular'
  | 'Bom'
  | 'Muito bom'
  | 'Excelente';

export interface UserStats {
  topGenre: string;
  topArtist: string;
  averageRatingGiven: number;
  totalReviews: number;
  totalAlbumsReviewed: number;
  totalTracksReviewed: number;
  genreDistribution: { genre: string; count: number; percentage: number }[];
  ratingDistribution: { range: string; count: number }[];
}

export interface User {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  location?: string;
  favoriteGenres: string[];
  favoriteArtists: string[];
  followersCount: number;
  followingCount: number;
  reviewsCount: number;
  albumsListenedCount: number;
  joinedDate: string;
  isFollowedByMe?: boolean;
  savedReviewIds?: string[];
  favoriteAlbumIds?: string[];
  watchlistAlbumIds?: string[];
  listenedAlbumIds?: string[];
  favoriteTrackIds?: string[];
  stats?: UserStats;
}

export interface Track {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  albumTitle: string;
  albumId: string;
  coverUrl: string;
  releaseYear: number;
  genre: string;
  duration: string;
  trackNumber: number;
  averageRating: number;
  reviewsCount: number;
  isFavorite?: boolean;
}

export interface Album {
  id: string;
  title: string;
  artist: string;
  artistId: string;
  type: 'album' | 'ep';
  releaseYear: number;
  coverUrl: string;
  genre: string;
  averageRating: number;
  reviewsCount: number;
  tracksCount: number;
  duration?: string;
  description?: string;
  isPopular?: boolean;
  isNewRelease?: boolean;
  isTrending?: boolean;
  isRecommended?: boolean;
  isClassic?: boolean;
  favoriteTrack?: string;
  isFavorite?: boolean;
  isWantToListen?: boolean;
  isListened?: boolean;
  tracks?: Track[];
}

export interface Artist {
  id: string;
  name: string;
  type: 'artista' | 'banda';
  avatarUrl: string;
  bio: string;
  genres: string[];
  monthlyListeners: string;
  followersCount: number;
  averageRating: number;
  isFollowed?: boolean;
  topAlbums?: {
    id: string;
    title: string;
    year: number;
    coverUrl: string;
    rating?: number;
  }[];
  eps?: {
    id: string;
    title: string;
    year: number;
    coverUrl: string;
  }[];
  popularTracks?: Track[];
  relatedArtistIds?: string[];
}

export interface ReviewCommentReply {
  id: string;
  commentId: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLikedByMe?: boolean;
}

export interface ReviewComment {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  text: string;
  createdAt: string;
  likesCount: number;
  isLikedByMe?: boolean;
  replies?: ReviewCommentReply[];
}

export interface Review {
  id: string;
  contentType: ContentType;
  contentId: string;
  albumId?: string;
  albumTitle: string;
  albumArtist: string;
  albumCover: string;
  releaseYear?: number;
  genre?: string;
  userId: string;
  userName: string;
  userUsername: string;
  userAvatar: string;
  rating: number; // 0.0 to 10.0 (step 0.5)
  ratingLabel: RatingLabel;
  title: string;
  content: string;
  tags?: string[];
  recommends?: boolean;
  wantToListenAgain?: boolean;
  isFavorite?: boolean;
  favoriteTrack?: string;
  likesCount: number;
  commentsCount: number;
  createdAt: string;
  isLikedByMe?: boolean;
  isSavedByMe?: boolean;
  comments?: ReviewComment[];
}

export interface NotificationItemData {
  id: string;
  type: 'like' | 'comment' | 'reply' | 'follow' | 'new_release' | 'mention';
  actorName: string;
  actorUsername: string;
  actorAvatar: string;
  message: string;
  targetTitle?: string;
  targetId?: string;
  timestamp: string;
  read: boolean;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  iconName: string;
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  unlockedDate?: string;
  category: 'reviews' | 'social' | 'explorer' | 'master';
}

export type AppView =
  | 'inicio'
  | 'explorar'
  | 'resenhas'
  | 'biblioteca'
  | 'artistas'
  | 'notificacoes'
  | 'perfil'
  | 'configuracoes'
  | 'create-review'
  | 'review-detail'
  | 'album-detail'
  | 'artist-detail'
  | 'track-detail'
  | 'user-profile'
  | 'achievements';

export type AuthMode = 'login' | 'register' | 'onboarding' | 'authenticated';
