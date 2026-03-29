export type BusinessType = 'jewelry' | 'guesthouse'

export interface Section {
  id: string
  businessType: BusinessType
  templateKey: string
  slug: string
  title: string
  subtitle?: string
  body?: string
  image?: string
  metadata?: Record<string, string> | null
  sortOrder: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface Collection {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  sortOrder: number
  isActive: boolean
  products?: Product[]
  _count?: { products: number }
  createdAt: string
  updatedAt: string
}

export interface Product {
  id: string
  name: string
  slug: string
  description?: string
  price: number | string
  image?: string
  gallery: string[]
  collectionId: string
  collection?: Collection
  isFeatured: boolean
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Testimonial {
  id: string
  name: string
  role?: string
  content: string
  avatar?: string
  rating: number
  isActive: boolean
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  body?: string
  image?: string
  tags: string[]
  isPublished: boolean
  publishedAt?: string | null
  sortOrder: number
  createdAt: string
  updatedAt: string
}

export interface Media {
  id: string
  filename: string
  url: string
  mimeType: string
  size: number
  alt?: string
  folder?: string | null
  createdAt: string
}

export interface SiteSetting {
  id: string
  key: string
  value: string
}

export type TemplateFeatureKey = 'shop' | 'cart' | 'blog' | 'roomInventory' | 'bookingEngine' | 'testimonials' | 'seo' | 'theme'

export interface TemplateLocalizedText {
  en: string
  id: string
}

export interface TemplateNavItem {
  key: string
  label: TemplateLocalizedText
  sectionKey?: string
  href?: string
  to?: string
  requiresFeature?: TemplateFeatureKey
}

export type TemplateSectionComponentKey =
  | 'hero'
  | 'collections'
  | 'about'
  | 'sustainability'
  | 'testimonials'
  | 'blog'
  | 'contact'
  | 'rooms'
  | 'amenities'
  | 'gallery'
  | 'location'
  | 'booking'

export interface TemplateSectionDefinition {
  key: string
  slug: string
  anchor: string
  component: TemplateSectionComponentKey
  requiresFeature?: TemplateFeatureKey
}

export interface SiteTemplate {
  key: string
  businessType: BusinessType
  label: string
  description?: string
  previewImage?: string
  themeName: string
  sectionMap: Record<string, string>
  sections: TemplateSectionDefinition[]
  navigation: TemplateNavItem[]
  defaults: {
    siteName: string
    siteTagline?: string
    metaDescription?: string
  }
}

export interface BusinessTypeOption {
  value: BusinessType
  label: string
  available: boolean
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  id: string
  orderId: string
  productId: string
  productName: string
  productImage?: string | null
  price: number | string
  qty: number
}

export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type PaymentStatus = 'unpaid' | 'paid' | 'failed' | 'expired'

export interface CityOption {
  id: string
  name: string
  type: string       // district name
  province: string
  postal: string
  label: string      // full display label
  cityName: string
}

export interface ShippingOption {
  courier: string
  courierName: string
  service: string
  description: string
  cost: number      // IDR
  etd: string
}

export interface Order {
  id: string
  userId: string
  user?: { id: string; name: string; email: string }
  shipName: string
  shipEmail: string
  shipPhone: string
  shipAddress: string
  shipCity: string
  shipProvince: string
  shipPostal: string
  shipNotes?: string | null
  subtotal: number | string
  paymentStatus: PaymentStatus
  paymentMethod?: string | null
  paymentToken?: string | null
  paymentUrl?: string | null
  paidAt?: string | null
  shippingCost?: number | string | null    // IDR
  shippingCourier?: string | null
  shippingService?: string | null
  status: OrderStatus
  items: OrderItem[]
  createdAt: string
  updatedAt: string
}

export type RoomUnitStatus = 'active' | 'maintenance' | 'inactive'
export type GuesthouseBookingStatus = 'pending' | 'confirmed' | 'checked_in' | 'checked_out' | 'cancelled' | 'no_show'
export type GuesthouseBookingPaymentStatus = 'unpaid' | 'partially_paid' | 'paid' | 'refunded' | 'voided'

export interface Property {
  id: string
  slug: string
  name: string
  description?: string | null
  timezone: string
  currency: string
  checkInTime?: string | null
  checkOutTime?: string | null
  address?: string | null
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface RoomType {
  id: string
  propertyId: string
  name: string
  slug: string
  description?: string | null
  baseOccupancy: number
  maxOccupancy: number
  maxAdults?: number | null
  maxChildren?: number | null
  bedroomCount?: number | null
  bathroomCount?: number | null
  areaSqm?: number | null
  bedConfiguration?: string | null
  defaultNightlyRate: number | string
  extraAdultRate?: number | string | null
  extraChildRate?: number | string | null
  sortOrder: number
  isActive: boolean
  metadata?: {
    featured?: boolean
    facilities?: string[]
    imageUrl?: string | null
  } | null
  roomUnits?: RoomUnit[]
  _count?: {
    roomUnits: number
    bookingRooms: number
  }
  createdAt: string
  updatedAt: string
}

export interface RoomUnit {
  id: string
  propertyId: string
  roomTypeId: string
  code: string
  name?: string | null
  floor?: string | null
  status: RoomUnitStatus
  isBookable: boolean
  roomType?: RoomType
  createdAt: string
  updatedAt: string
}

export type OccupancyCellStatus = 'available' | 'occupied' | 'blocked' | 'maintenance' | 'inactive' | 'hidden'

export interface GuesthouseOccupancyDay {
  date: string
  label: string
  shortLabel: string
  isToday: boolean
}

export interface GuesthouseOccupancyCell {
  date: string
  status: OccupancyCellStatus
  bookingId?: string | null
  bookingReference?: string | null
  bookingStatus?: GuesthouseBookingStatus | null
  guestName?: string | null
  checkInDate?: string | null
  checkOutDate?: string | null
  reason?: string | null
  notes?: string | null
}

export interface GuesthouseOccupancyUnit {
  id: string
  code: string
  name?: string | null
  roomTypeId: string
  roomTypeName: string
  status: RoomUnitStatus
  isBookable: boolean
  days: GuesthouseOccupancyCell[]
}

export interface GuesthouseOccupancyUnassignedBookingRoom {
  bookingId: string
  bookingRoomId: string
  bookingReference: string
  roomTypeId: string
  roomTypeName: string
  guestName: string
  checkInDate: string
  checkOutDate: string
  status: GuesthouseBookingStatus
}

export interface GuesthouseOccupancySummary {
  date: string
  available: number
  occupied: number
  blocked: number
  maintenance: number
  inactive: number
  hidden: number
  unassigned: number
}

export interface GuesthouseOccupancyResponse {
  property: Property
  startDate: string
  endDate: string
  dayCount: number
  days: GuesthouseOccupancyDay[]
  units: GuesthouseOccupancyUnit[]
  summary: GuesthouseOccupancySummary
  unassignedBookingRooms: GuesthouseOccupancyUnassignedBookingRoom[]
}

export interface GuesthouseBookingRoom {
  id: string
  bookingId: string
  roomTypeId: string
  roomUnitId?: string | null
  guestName?: string | null
  adults: number
  children: number
  nightlyRate: number | string
  extraGuestFee: number | string
  lineTotal: number | string
  roomType?: RoomType
  roomUnit?: RoomUnit | null
  assignableRoomUnits?: RoomUnit[]
  createdAt: string
  updatedAt: string
}

export interface GuesthouseBooking {
  id: string
  propertyId: string
  referenceCode: string
  source: string
  status: GuesthouseBookingStatus
  paymentStatus: GuesthouseBookingPaymentStatus
  guestFirstName: string
  guestLastName?: string | null
  guestEmail: string
  guestPhone?: string | null
  guestCountry?: string | null
  notes?: string | null
  internalNotes?: string | null
  checkInDate: string
  checkOutDate: string
  adultCount: number
  childCount: number
  totalNights: number
  subtotal: number | string
  taxAmount: number | string
  feeAmount: number | string
  discountAmount: number | string
  totalAmount: number | string
  currency: string
  confirmedAt?: string | null
  cancelledAt?: string | null
  checkedInAt?: string | null
  checkedOutAt?: string | null
  property?: Property
  bookingRooms: GuesthouseBookingRoom[]
  createdAt: string
  updatedAt: string
}

export interface GuesthouseBookingLookupItem {
  id: string
  referenceCode: string
  status: GuesthouseBookingStatus
  paymentStatus: GuesthouseBookingPaymentStatus
  checkInDate: string
  checkOutDate: string
  totalNights: number
  totalAmount: number | string
  guestFirstName: string
  guestLastName?: string | null
  property?: Property
  createdAt: string
}

export interface GuesthouseBookingLookupResponse {
  mode: 'single' | 'list'
  booking?: GuesthouseBooking
  bookings?: GuesthouseBookingLookupItem[]
}

export interface AvailabilityRoomType {
  id: string
  propertyId: string
  name: string
  slug: string
  description?: string | null
  baseOccupancy: number
  maxOccupancy: number
  bedConfiguration?: string | null
  defaultNightlyRate: number
  availableUnits: number
  totalUnits: number
  isAvailable: boolean
  minStay: number
  arrivalBlocked: boolean
  departureBlocked: boolean
  nightlyRates: number[]
  subtotal: number
  averageNightlyRate: number
}

export interface AvailabilityResponse {
  property: Pick<Property, 'id' | 'name' | 'checkInTime' | 'checkOutTime'>
  checkIn: string
  checkOut: string
  totalNights: number
  roomTypes: AvailabilityRoomType[]
}

export interface BookingQuoteLine {
  roomTypeId: string
  name: string
  quantity: number
  nightlyRates: number[]
  lineSubtotal: number
  adults: number
  children: number
  averageNightlyRate: number
}

export interface BookingQuote {
  property: Pick<Property, 'id' | 'name' | 'checkInTime' | 'checkOutTime'>
  checkIn: string
  checkOut: string
  totalNights: number
  lines: BookingQuoteLine[]
  subtotal: number
  totalAmount: number
  currency: string
}
