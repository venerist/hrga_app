export const env = {
  SUPABASE_URL: (() => {
    let url = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').trim().replace(/[\s\uFEFF\xA0]+/g, '').replace(/\/+$/, '');
    if (url && !url.startsWith('http')) url = `https://${url}`;
    return url;
  })(),
  SUPABASE_ANON_KEY: (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '').trim().replace(/[\s\uFEFF\xA0]+/g, ''),
  SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  NODE_ENV: process.env.NODE_ENV || 'development',
}

export function validateEnv() {
  if (!env.SUPABASE_URL) throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL')
  if (!env.SUPABASE_ANON_KEY) throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY')
}
