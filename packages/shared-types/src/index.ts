// User Types
export type UserType = 'customer' | 'driver';

export interface User {
  id: string;
  phone: string;
  email?: string;
  name: string;
  userType: UserType;
  createdAt: Date;
  updatedAt: Date;
}

export interface Customer extends User {
  userType: 'customer';
}

export interface Driver extends User {
  userType: 'driver';
  vehicleType: string;
  licenseNumber: string;
  plateNumber: string;
  isVerified: boolean;
  isAvailable: boolean;
  rating: number;
  totalRides: number;
}

// Location Types
export interface Location {
  lat: number;
  lng: number;
}

export interface LocationWithAddress extends Location {
  address: string;
}

// Ride Types
export type RideStatus =
  | 'pending'
  | 'accepted'
  | 'in_progress'
  | 'completed'
  | 'cancelled';

export type PaymentMethod = 'cash' | 'digital';

export interface Ride {
  id: string;
  customerId: string;
  driverId?: string;
  pickupLocation: LocationWithAddress;
  dropoffLocation: LocationWithAddress;
  status: RideStatus;
  fare: number;
  distance: number; // in kilometers
  duration?: number; // in minutes
  paymentMethod: PaymentMethod;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  cancelledAt?: Date;
}

// Rating Types
export interface Rating {
  id: string;
  rideId: string;
  raterId: string;
  rateeId: string;
  rating: number; // 1-5
  comment?: string;
  createdAt: Date;
}

// API Request/Response Types
export interface LoginRequest {
  phone: string;
  otp: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface RegisterRequest {
  phone: string;
  name: string;
  email?: string;
  userType: UserType;
}

export interface BookRideRequest {
  pickupLocation: LocationWithAddress;
  dropoffLocation: LocationWithAddress;
  paymentMethod: PaymentMethod;
}

export interface BookRideResponse {
  ride: Ride;
  estimatedFare: number;
}

// WebSocket Event Types
export type SocketEvent =
  | 'ride:requested'
  | 'ride:accepted'
  | 'ride:started'
  | 'ride:completed'
  | 'ride:cancelled'
  | 'driver:location:updated';

export interface SocketMessage<T = any> {
  event: SocketEvent;
  data: T;
}
