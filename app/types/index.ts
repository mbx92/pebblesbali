export interface Section {
  id: string
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

export type BusinessType = 'jewelry' | 'guesthouse'

export type TemplateFeatureKey = 'shop' | 'cart' | 'blog' | 'seo' | 'theme'

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

export interface TemplateSectionDefinition {
  key: string
  slug: string
  anchor: string
  component: TemplateSectionComponentKey
}

export interface SiteTemplate {
  key: string
  businessType: BusinessType
  label: string
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
