import { api } from './api';

/** Signed direct-to-Cloudinary upload. The API secret never reaches the browser. */
export async function uploadImage(file: File, kind: 'product' | 'shop' | 'kyc' | 'review' | 'avatar') {
  const sig = await api('/uploads/signature', { body: { kind } });
  if (file.size > sig.maxBytes) throw new Error(`File is too large (max ${Math.round(sig.maxBytes / 1e6)} MB)`);
  const fd = new FormData(); fd.append('file', file); fd.append('api_key', sig.apiKey); fd.append('signature', sig.signature);
  Object.entries(sig.params).forEach(([k, v]) => fd.append(k, String(v)));
  const res = await fetch(`https://api.cloudinary.com/v1_1/${sig.cloudName}/${sig.resourceType}/upload`, { method: 'POST', body: fd });
  const j = await res.json(); if (!res.ok) throw new Error(j?.error?.message ?? 'Upload failed');
  const c = await api('/uploads/confirm', { body: { publicId: j.public_id, kind } });
  return c as { publicId: string; url?: string };
}
