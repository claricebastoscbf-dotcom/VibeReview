/**
 * Dynamic SEO utility for VibeReview
 * Updates document.title, description, and OpenGraph/Twitter social cards dynamically
 */

export interface MetaTagsConfig {
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  type?: 'website' | 'music.album' | 'music.song' | 'profile' | 'article';
}

const DEFAULT_TITLE = 'VibeReview | Sua opinião também faz parte da música';
const DEFAULT_DESCRIPTION =
  'A comunidade social de resenhas musicais. Descubra músicas, álbuns e artistas, publique resenhas e converse com apaixonados por música.';
const DEFAULT_IMAGE = '/favicon.ico';

export function updatePageMeta(config: MetaTagsConfig): void {
  const fullTitle = config.title ? `${config.title} | VibeReview` : DEFAULT_TITLE;
  const description = config.description || DEFAULT_DESCRIPTION;
  const image = config.image || DEFAULT_IMAGE;
  const url = config.url || window.location.href;
  const type = config.type || 'website';

  // 1. Title
  document.title = fullTitle;

  // 2. Helper to set or create meta tag
  const setMeta = (name: string, content: string, isProperty = false) => {
    const attribute = isProperty ? 'property' : 'name';
    let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement | null;
    if (!element) {
      element = document.createElement('meta');
      element.setAttribute(attribute, name);
      document.head.appendChild(element);
    }
    element.content = content;
  };

  // Standard SEO
  setMeta('description', description);

  // Open Graph
  setMeta('og:title', fullTitle, true);
  setMeta('og:description', description, true);
  setMeta('og:image', image, true);
  setMeta('og:url', url, true);
  setMeta('og:type', type, true);

  // Twitter Cards
  setMeta('twitter:card', 'summary_large_image');
  setMeta('twitter:title', fullTitle);
  setMeta('twitter:description', description);
  setMeta('twitter:image', image);
}

/**
 * Convenience helpers for distinct music entities
 */
export const seo = {
  home: () => {
    updatePageMeta({
      title: 'Início - Descubra novas vibes e resenhas',
      description: 'Explore os últimos lançamentos, álbuns em destaque e resenhas da comunidade musical.',
      type: 'website',
    });
  },
  album: (albumTitle: string, artistName: string, coverUrl?: string) => {
    updatePageMeta({
      title: `${albumTitle} - ${artistName}`,
      description: `Leia e escreva resenhas sobre o álbum "${albumTitle}" de ${artistName} no VibeReview.`,
      image: coverUrl,
      type: 'music.album',
    });
  },
  artist: (artistName: string, genres?: string[], avatarUrl?: string) => {
    updatePageMeta({
      title: `${artistName} - Discografia e Resenhas`,
      description: `Descubra a discografia, músicas populares e avaliações do artista ${artistName} (${genres?.join(', ') || 'Música'}).`,
      image: avatarUrl,
      type: 'profile',
    });
  },
  track: (trackTitle: string, artistName: string, coverUrl?: string) => {
    updatePageMeta({
      title: `${trackTitle} - ${artistName}`,
      description: `Avaliações, notas e resenhas da música "${trackTitle}" de ${artistName}.`,
      image: coverUrl,
      type: 'music.song',
    });
  },
  review: (reviewTitle: string, albumTitle: string, authorName: string, rating: number) => {
    updatePageMeta({
      title: `Resenha: ${reviewTitle} (Nota ${rating}/10) por ${authorName}`,
      description: `Opinião da comunidade sobre ${albumTitle}: "${reviewTitle}". Leia no VibeReview.`,
      type: 'article',
    });
  },
  profile: (userName: string, username: string, avatarUrl?: string) => {
    updatePageMeta({
      title: `@${username} (${userName}) - Perfil Musical`,
      description: `Confira as resenhas, álbuns favoritos e notas atribuídas por ${userName} no VibeReview.`,
      image: avatarUrl,
      type: 'profile',
    });
  },
};
