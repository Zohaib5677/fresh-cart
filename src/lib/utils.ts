import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function parseAdminNote(note: string | null) {
  if (!note) return { text: null, estimatedDeliveryDate: null };
  try {
    const data = JSON.parse(note);
    if (data && typeof data === "object") {
      return { 
        text: data.text || null, 
        estimatedDeliveryDate: data.estimatedDeliveryDate || null 
      };
    }
  } catch (e) {}
  return { text: note, estimatedDeliveryDate: null };
}

export function formatAdminNote(text: string | null, estimatedDeliveryDate: string | null) {
  return JSON.stringify({ text, estimatedDeliveryDate });
}

export function extractDeliveryFee(description: string | null): { cleanDescription: string, fee: number } {
  if (!description) return { cleanDescription: '', fee: 0 };
  const match = description.match(/\[META:delivery_fee:(\d+(?:\.\d+)?)\]/);
  if (match) {
     return {
         cleanDescription: description.replace(match[0], '').trim(),
         fee: Number(match[1]) || 0
     };
  }
  return { cleanDescription: description, fee: 0 };
}

export function embedDeliveryFee(description: string | null, fee: number): string {
  const desc = (description || '').replace(/\[META:delivery_fee:\d+(?:\.\d+)?\]/g, '').trim();
  if (fee <= 0) return desc;
  return `${desc}\n\n[META:delivery_fee:${fee}]`;
}

export function optimizeImageUrl(url: string | null | undefined, width = 450, quality = 60): string {
  if (!url) return '/placeholder.svg';
  if (url.includes('images.unsplash.com')) {
    // Replace quality and width query parameters for fast compressed loading
    const cleanUrl = url.split('?')[0];
    return `${cleanUrl}?q=${quality}&w=${width}&auto=format&fit=crop`;
  }
  return url;
}
