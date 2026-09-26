-- ==============================================================================
-- VIBEREVIEW - SUPABASE & POSTGRESQL PRODUCTION DATABASE SCHEMA
-- "Sua opinião também faz parte da música."
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. USERS TABLE (Linked with Supabase auth.users)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL,
  avatar_url TEXT DEFAULT '',
  bio TEXT DEFAULT '',
  location TEXT DEFAULT '',
  followers_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  reviews_count INTEGER DEFAULT 0,
  albums_listened_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 2. GENRES TABLE & USER GENRES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.genres (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT DEFAULT 'music'
);

CREATE TABLE IF NOT EXISTS public.user_genres (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  genre_id TEXT REFERENCES public.genres(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, genre_id)
);

-- ------------------------------------------------------------------------------
-- 3. ARTISTS TABLE & ARTIST FOLLOWERS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.artists (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'artista' CHECK (type IN ('artista', 'banda')),
  bio TEXT DEFAULT '',
  image_url TEXT DEFAULT '',
  monthly_listeners TEXT DEFAULT '0',
  followers_count INTEGER DEFAULT 0,
  average_rating NUMERIC(3,1) DEFAULT 0.0,
  verified BOOLEAN DEFAULT FALSE,
  genres TEXT[] DEFAULT ARRAY[]::TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.artist_followers (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, artist_id)
);

-- ------------------------------------------------------------------------------
-- 4. ALBUMS TABLE & ALBUM SAVES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.albums (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE SET NULL,
  artist_name TEXT NOT NULL,
  type TEXT DEFAULT 'album' CHECK (type IN ('album', 'ep')),
  release_year INTEGER NOT NULL,
  cover_url TEXT DEFAULT '',
  genre TEXT DEFAULT 'Geral',
  average_rating NUMERIC(3,1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  tracks_count INTEGER DEFAULT 0,
  duration TEXT DEFAULT '',
  description TEXT DEFAULT '',
  is_popular BOOLEAN DEFAULT FALSE,
  is_new_release BOOLEAN DEFAULT FALSE,
  is_trending BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.album_saves (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  album_id TEXT REFERENCES public.albums(id) ON DELETE CASCADE,
  status TEXT NOT NULL CHECK (status IN ('favorite', 'watchlist', 'listened')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, album_id, status)
);

-- ------------------------------------------------------------------------------
-- 5. TRACKS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.tracks (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  album_id TEXT REFERENCES public.albums(id) ON DELETE CASCADE,
  artist_id TEXT REFERENCES public.artists(id) ON DELETE SET NULL,
  album_title TEXT NOT NULL,
  artist_name TEXT NOT NULL,
  cover_url TEXT DEFAULT '',
  release_year INTEGER,
  genre TEXT DEFAULT '',
  duration TEXT NOT NULL,
  track_number INTEGER DEFAULT 1,
  average_rating NUMERIC(3,1) DEFAULT 0.0,
  reviews_count INTEGER DEFAULT 0,
  preview_url TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 6. REVIEWS TABLE & REVIEW SAVES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  content_type TEXT NOT NULL CHECK (content_type IN ('musica', 'album', 'ep', 'artista', 'banda')),
  content_id TEXT NOT NULL,
  album_id TEXT REFERENCES public.albums(id) ON DELETE SET NULL,
  album_title TEXT NOT NULL,
  album_artist TEXT NOT NULL,
  album_cover TEXT DEFAULT '',
  release_year INTEGER,
  genre TEXT DEFAULT '',
  rating NUMERIC(3,1) NOT NULL CHECK (rating >= 0 AND rating <= 10),
  rating_label TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  recommends BOOLEAN DEFAULT TRUE,
  want_to_listen_again BOOLEAN DEFAULT FALSE,
  is_favorite BOOLEAN DEFAULT FALSE,
  favorite_track TEXT DEFAULT '',
  likes_count INTEGER DEFAULT 0,
  comments_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.review_saves (
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  review_id UUID REFERENCES public.reviews(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, review_id)
);

-- ------------------------------------------------------------------------------
-- 7. COMMENTS TABLE (Supports nested replies via parent_comment_id)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id UUID NOT NULL REFERENCES public.reviews(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  parent_comment_id UUID REFERENCES public.comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 8. LIKES TABLE (Polymorphic: review or comment)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  target_type TEXT NOT NULL CHECK (target_type IN ('review', 'comment', 'reply')),
  target_id UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, target_type, target_id)
);

-- ------------------------------------------------------------------------------
-- 9. USER FOLLOWS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.follows (
  follower_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (follower_id, following_id),
  CHECK (follower_id != following_id)
);

-- ------------------------------------------------------------------------------
-- 10. FAVORITES TABLE (Polymorphic: album, track, artist)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.favorites (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  item_type TEXT NOT NULL CHECK (item_type IN ('album', 'track', 'artist')),
  item_id TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (user_id, item_type, item_id)
);

-- ------------------------------------------------------------------------------
-- 11. NOTIFICATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  actor_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('like', 'comment', 'reply', 'follow', 'new_release', 'mention')),
  actor_name TEXT NOT NULL,
  actor_username TEXT NOT NULL,
  actor_avatar TEXT DEFAULT '',
  message TEXT NOT NULL,
  target_title TEXT DEFAULT '',
  target_id TEXT DEFAULT '',
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ------------------------------------------------------------------------------
-- 12. ACHIEVEMENTS & USER ACHIEVEMENTS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.achievements (
  id TEXT PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('reviews', 'social', 'explorer', 'master')),
  max_progress INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_achievements (
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  achievement_id TEXT NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  progress INTEGER DEFAULT 0,
  unlocked BOOLEAN DEFAULT FALSE,
  unlocked_at TIMESTAMPTZ,
  PRIMARY KEY (user_id, achievement_id)
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_reviews_user_id ON public.reviews(user_id);
CREATE INDEX IF NOT EXISTS idx_reviews_album_id ON public.reviews(album_id);
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON public.reviews(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_review_id ON public.comments(review_id);
CREATE INDEX IF NOT EXISTS idx_likes_target ON public.likes(target_type, target_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON public.notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_tracks_album ON public.tracks(album_id);
CREATE INDEX IF NOT EXISTS idx_albums_artist ON public.albums(artist_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_genres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artist_followers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.album_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.review_saves ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.follows ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

-- 1. USERS POLICIES
-- Anyone can view public user profiles
CREATE POLICY "Public profiles are viewable by everyone" 
  ON public.users FOR SELECT USING (true);

-- Users can only insert/update their own profile
CREATE POLICY "Users can insert their own profile" 
  ON public.users FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
  ON public.users FOR UPDATE USING (auth.uid() = id);

-- 2. REVIEWS POLICIES
-- Anyone can read reviews
CREATE POLICY "Reviews are viewable by everyone" 
  ON public.reviews FOR SELECT USING (true);

-- Authenticated users can insert their own reviews
CREATE POLICY "Users can create reviews" 
  ON public.reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can only update their own reviews
CREATE POLICY "Users can update their own reviews" 
  ON public.reviews FOR UPDATE USING (auth.uid() = user_id);

-- Users can only delete their own reviews
CREATE POLICY "Users can delete their own reviews" 
  ON public.reviews FOR DELETE USING (auth.uid() = user_id);

-- 3. COMMENTS POLICIES
-- Anyone can read comments
CREATE POLICY "Comments are viewable by everyone" 
  ON public.comments FOR SELECT USING (true);

-- Authenticated users can create comments
CREATE POLICY "Users can post comments" 
  ON public.comments FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update or delete their own comments
CREATE POLICY "Users can update their own comments" 
  ON public.comments FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" 
  ON public.comments FOR DELETE USING (auth.uid() = user_id);

-- 4. LIKES POLICIES
CREATE POLICY "Likes are viewable by everyone" 
  ON public.likes FOR SELECT USING (true);

CREATE POLICY "Users can insert likes" 
  ON public.likes FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
  ON public.likes FOR DELETE USING (auth.uid() = user_id);

-- 5. FOLLOWS POLICIES
CREATE POLICY "Follows are viewable by everyone" 
  ON public.follows FOR SELECT USING (true);

CREATE POLICY "Users can follow others" 
  ON public.follows FOR INSERT WITH CHECK (auth.uid() = follower_id);

CREATE POLICY "Users can unfollow others" 
  ON public.follows FOR DELETE USING (auth.uid() = follower_id);

-- 6. FAVORITES & SAVES POLICIES
CREATE POLICY "Favorites viewable by everyone" 
  ON public.favorites FOR SELECT USING (true);

CREATE POLICY "Users can insert favorites" 
  ON public.favorites FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites" 
  ON public.favorites FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Album saves viewable by owner" 
  ON public.album_saves FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert album saves" 
  ON public.album_saves FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own album saves" 
  ON public.album_saves FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Review saves viewable by owner" 
  ON public.review_saves FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert review saves" 
  ON public.review_saves FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own review saves" 
  ON public.review_saves FOR DELETE USING (auth.uid() = user_id);

-- 7. NOTIFICATIONS POLICIES
-- Only the recipient can view their notifications
CREATE POLICY "Users can view their own notifications" 
  ON public.notifications FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" 
  ON public.notifications FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "System/Users can insert notifications" 
  ON public.notifications FOR INSERT WITH CHECK (true);

-- 8. CATALOG POLICIES (Artists, Albums, Tracks, Genres, Achievements)
CREATE POLICY "Artists viewable by everyone" ON public.artists FOR SELECT USING (true);
CREATE POLICY "Albums viewable by everyone" ON public.albums FOR SELECT USING (true);
CREATE POLICY "Tracks viewable by everyone" ON public.tracks FOR SELECT USING (true);
CREATE POLICY "Genres viewable by everyone" ON public.genres FOR SELECT USING (true);
CREATE POLICY "Achievements viewable by everyone" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "User achievements viewable by everyone" ON public.user_achievements FOR SELECT USING (true);

CREATE POLICY "Users can manage user_genres" ON public.user_genres FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage artist_followers" ON public.artist_followers FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can update own achievements" ON public.user_achievements FOR ALL USING (auth.uid() = user_id);

-- ==============================================================================
-- STORAGE BUCKETS & POLICIES SETUP
-- ==============================================================================
-- Create storage buckets for avatars, artist-images, album-covers
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('artist-images', 'artist-images', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp']),
  ('album-covers', 'album-covers', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO UPDATE SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage policies: Anyone can read, only authenticated can upload
CREATE POLICY "Public Access To Avatars" 
  ON storage.objects FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Authenticated users can upload avatars" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Public Access To Album Covers" 
  ON storage.objects FOR SELECT USING (bucket_id = 'album-covers');

CREATE POLICY "Authenticated can upload album covers" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'album-covers' AND auth.role() = 'authenticated');

-- ==============================================================================
-- TRIGGER FOR AUTOMATIC USER PROFILE CREATION ON AUTH SIGNUP
-- ==============================================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, name, username, email, avatar_url)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.email,
    COALESCE(new.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- SEED DATA (Standard Genres & Achievements)
-- ==============================================================================
INSERT INTO public.genres (id, name, slug) VALUES
  ('pop', 'Pop', 'pop'),
  ('rock', 'Rock', 'rock'),
  ('rap', 'Rap', 'rap'),
  ('hip-hop', 'Hip Hop', 'hip-hop'),
  ('rnb', 'R&B', 'r-and-b'),
  ('mpb', 'MPB', 'mpb'),
  ('sertanejo', 'Sertanejo', 'sertanejo'),
  ('eletronica', 'Eletrônica', 'eletronica'),
  ('jazz', 'Jazz', 'jazz'),
  ('blues', 'Blues', 'blues'),
  ('metal', 'Metal', 'metal'),
  ('indie', 'Indie', 'indie'),
  ('reggae', 'Reggae', 'reggae'),
  ('samba', 'Samba', 'samba'),
  ('funk', 'Funk', 'funk'),
  ('k-pop', 'K-Pop', 'k-pop'),
  ('classica', 'Música Clássica', 'classica')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.achievements (id, code, title, description, icon_name, category, max_progress) VALUES
  ('ach_first_review', 'first_review', 'Primeira Resenha', 'Escreva sua primeira resenha musical no VibeReview.', 'Award', 'reviews', 1),
  ('ach_critic_bronze', 'critic_bronze', 'Crítico Iniciante', 'Publique 5 resenhas detalhadas na plataforma.', 'Sparkles', 'reviews', 5),
  ('ach_critic_silver', 'critic_silver', 'Crítico Dedicado', 'Publique 15 resenhas musicais.', 'Star', 'reviews', 15),
  ('ach_social_star', 'social_star', 'Conector Musical', 'Siga pelo menos 5 amantes de música ou artistas.', 'Users', 'social', 5),
  ('ach_genre_diver', 'genre_diver', 'Explorador Eclético', 'Avalie músicas de pelo menos 4 gêneros diferentes.', 'Compass', 'explorer', 4),
  ('ach_master_ear', 'master_ear', 'Ouvido de Ouro', 'Ouça e avalie mais de 25 faixas ou álbuns.', 'Headphones', 'master', 25)
ON CONFLICT (id) DO NOTHING;
