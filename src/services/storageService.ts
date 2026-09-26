import { supabase, isSupabaseConfigured } from './supabase';

export interface StorageValidationResult {
  valid: boolean;
  error?: string;
}

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
export const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
export const ALLOWED_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

/**
 * Validates a file before uploading to Supabase Storage
 */
export const validateImageFile = (file: File): StorageValidationResult => {
  if (!file) {
    return { valid: false, error: 'Nenhum arquivo selecionado.' };
  }

  // Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Formato de arquivo inválido (${file.type || 'desconhecido'}). Envie uma imagem JPG, PNG ou WebP.`,
    };
  }

  // Validate extension
  const extension = '.' + file.name.split('.').pop()?.toLowerCase();
  if (!ALLOWED_EXTENSIONS.includes(extension)) {
    return {
      valid: false,
      error: `Extensão '${extension}' não permitida. Use .jpg, .jpeg, .png ou .webp.`,
    };
  }

  // Validate size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      valid: false,
      error: `Arquivo muito grande (${sizeInMB} MB). O tamanho máximo permitido é de 5 MB.`,
    };
  }

  return { valid: true };
};

/**
 * Upload an avatar to Supabase storage ('avatars' bucket)
 */
export const uploadAvatar = async (
  userId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { url: null, error: validation.error || 'Arquivo inválido.' };
  }

  // If Supabase is configured with real credentials
  if (isSupabaseConfigured() && supabase) {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${userId}/avatar_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        console.error('[StorageService] Error uploading avatar to Supabase:', uploadError);
        return { url: null, error: uploadError.message };
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      return { url: data.publicUrl, error: null };
    } catch (err: any) {
      console.error('[StorageService] Upload avatar exception:', err);
      return { url: null, error: err?.message || 'Falha ao fazer upload da imagem.' };
    }
  }

  // Fallback: create an in-memory Data URL for local demo persistence
  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string, error: null });
    };
    reader.onerror = () => {
      resolve({ url: null, error: 'Erro ao processar imagem local.' });
    };
    reader.readAsDataURL(file);
  });
};

/**
 * Upload an album cover to Supabase storage ('album-covers' bucket)
 */
export const uploadAlbumCover = async (
  albumId: string,
  file: File
): Promise<{ url: string | null; error: string | null }> => {
  const validation = validateImageFile(file);
  if (!validation.valid) {
    return { url: null, error: validation.error || 'Arquivo inválido.' };
  }

  if (isSupabaseConfigured() && supabase) {
    try {
      const fileExt = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const filePath = `${albumId}_${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('album-covers')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) {
        return { url: null, error: uploadError.message };
      }

      const { data } = supabase.storage.from('album-covers').getPublicUrl(filePath);
      return { url: data.publicUrl, error: null };
    } catch (err: any) {
      return { url: null, error: err?.message || 'Falha no upload da capa.' };
    }
  }

  return new Promise(resolve => {
    const reader = new FileReader();
    reader.onloadend = () => {
      resolve({ url: reader.result as string, error: null });
    };
    reader.onerror = () => {
      resolve({ url: null, error: 'Erro ao ler arquivo da capa.' });
    };
    reader.readAsDataURL(file);
  });
};
