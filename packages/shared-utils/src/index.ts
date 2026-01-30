// API client exports
export {
  createApiClient,
  getApiErrorMessage,
  type ApiResponse,
  type ApiError,
  type TokenStorage,
  type ApiClientConfig,
} from './api';

/**
 * Calculate the distance between two coordinates using Haversine formula
 * @param lat1 Latitude of first point
 * @param lng1 Longitude of first point
 * @param lat2 Latitude of second point
 * @param lng2 Longitude of second point
 * @returns Distance in kilometers
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
    Math.cos(toRad(lat2)) *
    Math.sin(dLng / 2) *
    Math.sin(dLng / 2);

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

function toRad(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Calculate fare based on distance
 * Base fare: ₱40
 * Per km rate: ₱15
 */
export function calculateFare(distanceKm: number): number {
  const BASE_FARE = 40;
  const PER_KM_RATE = 15;
  return BASE_FARE + distanceKm * PER_KM_RATE;
}

/**
 * Format phone number for display
 * Example: +639171234567 -> +63 917 123 4567
 */
export function formatPhoneNumber(phone: string): string {
  if (!phone) return '';

  // Remove all non-digit characters
  const cleaned = phone.replace(/\D/g, '');

  // Format Philippine phone number
  if (cleaned.startsWith('63') && cleaned.length === 12) {
    return `+63 ${cleaned.slice(2, 5)} ${cleaned.slice(5, 8)} ${cleaned.slice(8)}`;
  }

  return phone;
}

/**
 * Format currency for display
 */
export function formatCurrency(amount: number): string {
  return `₱${amount.toFixed(2)}`;
}

/**
 * Validate Philippine phone number
 */
export function isValidPhoneNumber(phone: string): boolean {
  const cleaned = phone.replace(/\D/g, '');

  // Should start with 63 and be 12 digits total
  // Or start with 09 and be 11 digits total
  return (
    (cleaned.startsWith('63') && cleaned.length === 12) ||
    (cleaned.startsWith('09') && cleaned.length === 11)
  );
}

/**
 * Format duration in minutes to readable string
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${Math.round(minutes)} min`;
  }

  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);

  if (mins === 0) {
    return `${hours} hr`;
  }

  return `${hours} hr ${mins} min`;
}
