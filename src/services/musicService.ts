import { Album, Artist, Track } from '../types';
import { MOCK_ALBUMS, MOCK_ARTISTS, MOCK_TRACKS } from '../data/mockData';

// Decoupled Music API Interfaces
export interface MusicSearchOptions {
  query: string;
  limit?: number;
  page?: number;
  genre?: string;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// In-memory cache to ensure high performance and prevent duplicate network calls
interface CacheEntry<T> {
  timestamp: number;
  data: T;
}

const memoryCache = new Map<string, CacheEntry<any>>();
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

function getCached<T>(key: string): T | null {
  const entry = memoryCache.get(key);
  if (!entry) return null;
  if (Date.now() - entry.timestamp > CACHE_TTL_MS) {
    memoryCache.delete(key);
    return null;
  }
  return entry.data;
}

function setCache<T>(key: string, data: T): void {
  memoryCache.set(key, { timestamp: Date.now(), data });
}

/**
 * Searches artists across catalog with caching and pagination
 */
export async function searchArtists(
  query: string,
  limit = 10,
  page = 1
): Promise<PaginatedResult<Artist>> {
  const cacheKey = `searchArtists:${query.toLowerCase().trim()}:${limit}:${page}`;
  const cached = getCached<PaginatedResult<Artist>>(cacheKey);
  if (cached) return cached;

  const normalized = query.toLowerCase().trim();

  // Try real music search API (iTunes Public Search) if search term is provided
  if (normalized.length >= 2) {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          normalized
        )}&entity=musicArtist&limit=${limit * 2}`
      );
      if (response.ok) {
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          const apiArtists: Artist[] = json.results.map((r: any) => ({
            id: `art_itunes_${r.artistId}`,
            name: r.artistName,
            type: 'artista' as const,
            avatarUrl:
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
            bio: `${r.artistName} é um artista relevante do gênero ${r.primaryGenreName || 'Música'}.`,
            genres: [r.primaryGenreName || 'Geral'],
            monthlyListeners: `${(Math.floor(Math.random() * 800) + 120).toLocaleString()} mil`,
            followersCount: Math.floor(Math.random() * 90000) + 5000,
            averageRating: Number((Math.random() * 2 + 7.5).toFixed(1)),
            isFollowed: false,
          }));

          // Merge with local matches
          const localMatches = MOCK_ARTISTS.filter(
            a =>
              a.name.toLowerCase().includes(normalized) ||
              a.genres.some(g => g.toLowerCase().includes(normalized))
          );

          const combined = [...localMatches, ...apiArtists];
          const unique = Array.from(new Map(combined.map(a => [a.name.toLowerCase(), a])).values());

          const start = (page - 1) * limit;
          const paginated = unique.slice(start, start + limit);

          const result: PaginatedResult<Artist> = {
            data: paginated,
            total: unique.length,
            page,
            limit,
            hasMore: start + limit < unique.length,
          };
          setCache(cacheKey, result);
          return result;
        }
      }
    } catch {
      // Graceful fallback to local mock search
    }
  }

  // Local fallback search
  const filtered = normalized
    ? MOCK_ARTISTS.filter(
        a =>
          a.name.toLowerCase().includes(normalized) ||
          a.genres.some(g => g.toLowerCase().includes(normalized))
      )
    : MOCK_ARTISTS;

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const result: PaginatedResult<Artist> = {
    data: paginated,
    total: filtered.length,
    page,
    limit,
    hasMore: start + limit < filtered.length,
  };
  setCache(cacheKey, result);
  return result;
}

/**
 * Searches albums across catalog with caching, genre filter and pagination
 */
export async function searchAlbums(
  query: string,
  limit = 12,
  page = 1,
  genre?: string
): Promise<PaginatedResult<Album>> {
  const cacheKey = `searchAlbums:${query.toLowerCase().trim()}:${genre || 'all'}:${limit}:${page}`;
  const cached = getCached<PaginatedResult<Album>>(cacheKey);
  if (cached) return cached;

  const normalized = query.toLowerCase().trim();

  // Try real music search API (iTunes Public Search)
  if (normalized.length >= 2) {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          normalized
        )}&entity=album&limit=${limit * 2}`
      );
      if (response.ok) {
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          const apiAlbums: Album[] = json.results.map((r: any) => ({
            id: `alb_itunes_${r.collectionId}`,
            title: r.collectionName,
            artist: r.artistName,
            artistId: `art_itunes_${r.artistId || 'unknown'}`,
            type: 'album' as const,
            releaseYear: new Date(r.releaseDate || '2024-01-01').getFullYear(),
            coverUrl: r.artworkUrl100 ? r.artworkUrl100.replace('100x100bb', '600x600bb') : '',
            genre: r.primaryGenreName || 'Música',
            averageRating: Number((Math.random() * 2 + 7.5).toFixed(1)),
            reviewsCount: Math.floor(Math.random() * 40) + 1,
            tracksCount: r.trackCount || 10,
            duration: `${Math.floor((r.trackCount || 10) * 3.4)} min`,
            description: `Álbum de ${r.artistName} lançado originalmente no gênero ${r.primaryGenreName}.`,
            isPopular: true,
          }));

          const localMatches = MOCK_ALBUMS.filter(
            alb =>
              alb.title.toLowerCase().includes(normalized) ||
              alb.artist.toLowerCase().includes(normalized)
          );

          let combined = [...localMatches, ...apiAlbums];
          if (genre && genre !== 'Todos') {
            combined = combined.filter(a => a.genre.toLowerCase() === genre.toLowerCase());
          }

          const unique = Array.from(new Map(combined.map(a => [a.title.toLowerCase(), a])).values());
          const start = (page - 1) * limit;
          const paginated = unique.slice(start, start + limit);

          const result: PaginatedResult<Album> = {
            data: paginated,
            total: unique.length,
            page,
            limit,
            hasMore: start + limit < unique.length,
          };
          setCache(cacheKey, result);
          return result;
        }
      }
    } catch {
      // Graceful fallback to local mock
    }
  }

  // Local fallback
  let filtered = MOCK_ALBUMS;
  if (normalized) {
    filtered = filtered.filter(
      alb =>
        alb.title.toLowerCase().includes(normalized) ||
        alb.artist.toLowerCase().includes(normalized) ||
        alb.genre.toLowerCase().includes(normalized)
    );
  }
  if (genre && genre !== 'Todos') {
    filtered = filtered.filter(alb => alb.genre.toLowerCase() === genre.toLowerCase());
  }

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const result: PaginatedResult<Album> = {
    data: paginated,
    total: filtered.length,
    page,
    limit,
    hasMore: start + limit < filtered.length,
  };
  setCache(cacheKey, result);
  return result;
}

/**
 * Searches tracks across catalog
 */
export async function searchTracks(
  query: string,
  limit = 15,
  page = 1
): Promise<PaginatedResult<Track>> {
  const cacheKey = `searchTracks:${query.toLowerCase().trim()}:${limit}:${page}`;
  const cached = getCached<PaginatedResult<Track>>(cacheKey);
  if (cached) return cached;

  const normalized = query.toLowerCase().trim();

  if (normalized.length >= 2) {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          normalized
        )}&entity=song&limit=${limit * 2}`
      );
      if (response.ok) {
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          const apiTracks: Track[] = json.results.map((r: any) => ({
            id: `trk_itunes_${r.trackId}`,
            title: r.trackName,
            artist: r.artistName,
            artistId: `art_itunes_${r.artistId || 'unknown'}`,
            albumTitle: r.collectionName || 'Single',
            albumId: `alb_itunes_${r.collectionId || 'unknown'}`,
            coverUrl: r.artworkUrl100 ? r.artworkUrl100.replace('100x100bb', '600x600bb') : '',
            releaseYear: new Date(r.releaseDate || '2024-01-01').getFullYear(),
            genre: r.primaryGenreName || 'Música',
            duration: r.trackTimeMillis
              ? `${Math.floor(r.trackTimeMillis / 60000)}:${String(
                  Math.floor((r.trackTimeMillis % 60000) / 1000)
                ).padStart(2, '0')}`
              : '3:30',
            trackNumber: r.trackNumber || 1,
            averageRating: Number((Math.random() * 2 + 7.5).toFixed(1)),
            reviewsCount: Math.floor(Math.random() * 25) + 1,
          }));

          const localTracks = MOCK_TRACKS.filter(
            t =>
              t.title.toLowerCase().includes(normalized) ||
              t.artist.toLowerCase().includes(normalized)
          );

          const combined = [...localTracks, ...apiTracks];
          const unique = Array.from(new Map(combined.map(t => [t.title.toLowerCase() + t.artist, t])).values());
          const start = (page - 1) * limit;
          const paginated = unique.slice(start, start + limit);

          const result: PaginatedResult<Track> = {
            data: paginated,
            total: unique.length,
            page,
            limit,
            hasMore: start + limit < unique.length,
          };
          setCache(cacheKey, result);
          return result;
        }
      }
    } catch {
      // Fallback
    }
  }

  const filtered = normalized
    ? MOCK_TRACKS.filter(
        t =>
          t.title.toLowerCase().includes(normalized) ||
          t.artist.toLowerCase().includes(normalized) ||
          t.albumTitle.toLowerCase().includes(normalized)
      )
    : MOCK_TRACKS;

  const start = (page - 1) * limit;
  const paginated = filtered.slice(start, start + limit);

  const result: PaginatedResult<Track> = {
    data: paginated,
    total: filtered.length,
    page,
    limit,
    hasMore: start + limit < filtered.length,
  };
  setCache(cacheKey, result);
  return result;
}

/**
 * Gets a single artist by id
 */
export async function getArtist(id: string): Promise<Artist | null> {
  const cached = getCached<Artist>(`artist:${id}`);
  if (cached) return cached;

  const local = MOCK_ARTISTS.find(a => a.id === id);
  if (local) {
    setCache(`artist:${id}`, local);
    return local;
  }

  // If iTunes synthetic id
  if (id.startsWith('art_itunes_')) {
    const rawId = id.replace('art_itunes_', '');
    try {
      const response = await fetch(`https://itunes.apple.com/lookup?id=${rawId}&entity=album`);
      if (response.ok) {
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          const main = json.results[0];
          const albums = json.results.slice(1).map((alb: any) => ({
            id: `alb_itunes_${alb.collectionId}`,
            title: alb.collectionName,
            year: new Date(alb.releaseDate).getFullYear(),
            coverUrl: alb.artworkUrl100 ? alb.artworkUrl100.replace('100x100bb', '600x600bb') : '',
            rating: Number((Math.random() * 1.5 + 8).toFixed(1)),
          }));

          const artist: Artist = {
            id,
            name: main.artistName,
            type: 'artista',
            avatarUrl:
              'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500&auto=format&fit=crop&q=80',
            bio: `${main.artistName} é um artista com diversos lançamentos no gênero ${main.primaryGenreName || 'Música'}.`,
            genres: [main.primaryGenreName || 'Geral'],
            monthlyListeners: '350 mil',
            followersCount: 14200,
            averageRating: 8.8,
            topAlbums: albums.slice(0, 4),
          };
          setCache(`artist:${id}`, artist);
          return artist;
        }
      }
    } catch {
      // Continue
    }
  }

  return null;
}

/**
 * Gets a single album by id
 */
export async function getAlbum(id: string): Promise<Album | null> {
  const cached = getCached<Album>(`album:${id}`);
  if (cached) return cached;

  const local = MOCK_ALBUMS.find(a => a.id === id);
  if (local) {
    setCache(`album:${id}`, local);
    return local;
  }

  if (id.startsWith('alb_itunes_')) {
    const rawId = id.replace('alb_itunes_', '');
    try {
      const response = await fetch(`https://itunes.apple.com/lookup?id=${rawId}&entity=song`);
      if (response.ok) {
        const json = await response.json();
        if (json.results && json.results.length > 0) {
          const main = json.results[0];
          const trackItems: Track[] = json.results.slice(1).map((s: any, idx: number) => ({
            id: `trk_itunes_${s.trackId}`,
            title: s.trackName,
            artist: s.artistName,
            artistId: `art_itunes_${s.artistId}`,
            albumTitle: main.collectionName,
            albumId: id,
            coverUrl: main.artworkUrl100 ? main.artworkUrl100.replace('100x100bb', '600x600bb') : '',
            releaseYear: new Date(main.releaseDate).getFullYear(),
            genre: main.primaryGenreName || 'Música',
            duration: s.trackTimeMillis
              ? `${Math.floor(s.trackTimeMillis / 60000)}:${String(
                  Math.floor((s.trackTimeMillis % 60000) / 1000)
                ).padStart(2, '0')}`
              : '3:20',
            trackNumber: s.trackNumber || idx + 1,
            averageRating: Number((Math.random() * 1.5 + 8).toFixed(1)),
            reviewsCount: Math.floor(Math.random() * 15) + 2,
          }));

          const album: Album = {
            id,
            title: main.collectionName,
            artist: main.artistName,
            artistId: `art_itunes_${main.artistId}`,
            type: 'album',
            releaseYear: new Date(main.releaseDate).getFullYear(),
            coverUrl: main.artworkUrl100 ? main.artworkUrl100.replace('100x100bb', '600x600bb') : '',
            genre: main.primaryGenreName || 'Música',
            averageRating: 8.6,
            reviewsCount: 14,
            tracksCount: main.trackCount || trackItems.length,
            duration: `${Math.floor((main.trackCount || 10) * 3.5)} min`,
            description: `Álbum de ${main.artistName}, gravado e distribuído oficialmente.`,
            tracks: trackItems,
          };
          setCache(`album:${id}`, album);
          return album;
        }
      }
    } catch {
      // Continue
    }
  }

  return null;
}

/**
 * Gets a single track by id
 */
export async function getTrack(id: string): Promise<Track | null> {
  const cached = getCached<Track>(`track:${id}`);
  if (cached) return cached;

  const local = MOCK_TRACKS.find(t => t.id === id);
  if (local) {
    setCache(`track:${id}`, local);
    return local;
  }

  return null;
}

/**
 * Returns new releases with pagination
 */
export async function getNewReleases(limit = 6, page = 1): Promise<PaginatedResult<Album>> {
  const allReleases = MOCK_ALBUMS.filter(a => a.isNewRelease || a.releaseYear >= 2024);
  const start = (page - 1) * limit;
  const paginated = allReleases.slice(start, start + limit);

  return {
    data: paginated,
    total: allReleases.length,
    page,
    limit,
    hasMore: start + limit < allReleases.length,
  };
}

/**
 * Returns popular albums with pagination
 */
export async function getPopularAlbums(limit = 6, page = 1): Promise<PaginatedResult<Album>> {
  const popular = [...MOCK_ALBUMS].sort((a, b) => b.averageRating - a.averageRating);
  const start = (page - 1) * limit;
  const paginated = popular.slice(start, start + limit);

  return {
    data: paginated,
    total: popular.length,
    page,
    limit,
    hasMore: start + limit < popular.length,
  };
}
