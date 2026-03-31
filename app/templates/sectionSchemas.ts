export interface MetaField {
  key: string
  label: string
  placeholder?: string
  multiline?: boolean
}

export interface MetaGroup {
  group: string
  fields: MetaField[]
}

export type MetaSchema = MetaGroup[]

export const SECTION_METADATA_SCHEMA: Record<string, MetaSchema> = {
  hero: [
    {
      group: 'Badge & Buttons',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Handcrafted in Bali' },
        { key: 'ctaPrimaryText', label: 'Primary Button Text', placeholder: 'e.g. Explore Collections' },
        { key: 'ctaPrimaryLink', label: 'Primary Button Link', placeholder: 'e.g. template section anchor or full URL' },
        { key: 'ctaSecondaryText', label: 'Secondary Button Text', placeholder: 'e.g. Our Story' },
        { key: 'ctaSecondaryLink', label: 'Secondary Button Link', placeholder: 'e.g. template section anchor or full URL' },
        { key: 'scrollText', label: 'Scroll Indicator Text', placeholder: 'e.g. Scroll' },
      ],
    },
    {
      group: 'Highlights',
      fields: [
        { key: 'highlight1', label: 'Highlight 1', placeholder: 'e.g. 8 private suites' },
        { key: 'highlight2', label: 'Highlight 2', placeholder: 'e.g. 5 minutes to the beach' },
        { key: 'highlight3', label: 'Highlight 3', placeholder: 'e.g. Daily breakfast included' },
      ],
    },
  ],
  collections: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Our Craft' },
        { key: 'viewText', label: '"View Collection" Hover Text', placeholder: 'e.g. View Collection' },
        { key: 'emptySoonText', label: 'Empty State Text', placeholder: 'e.g. Collections coming soon' },
      ],
    },
  ],
  services: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Core Services' },
      ],
    },
    {
      group: 'Service 1',
      fields: [
        { key: 'service1Title', label: 'Title', placeholder: 'e.g. CCTV Installation' },
        { key: 'service1Body', label: 'Description', placeholder: 'e.g. Camera placement, recorder setup, remote access, and handover.', multiline: true },
      ],
    },
    {
      group: 'Service 2',
      fields: [
        { key: 'service2Title', label: 'Title', placeholder: 'e.g. Wi-Fi & Access Point Setup' },
        { key: 'service2Body', label: 'Description', placeholder: 'e.g. Coverage planning, router tuning, mesh deployment, and testing.', multiline: true },
      ],
    },
    {
      group: 'Service 3',
      fields: [
        { key: 'service3Title', label: 'Title', placeholder: 'e.g. Structured Cabling' },
        { key: 'service3Body', label: 'Description', placeholder: 'e.g. LAN cable pulling, rack cleanup, labeling, and patching.', multiline: true },
      ],
    },
    {
      group: 'Service 4',
      fields: [
        { key: 'service4Title', label: 'Title', placeholder: 'e.g. Maintenance & Troubleshooting' },
        { key: 'service4Body', label: 'Description', placeholder: 'e.g. Fault isolation, device replacement, and system health checks.', multiline: true },
      ],
    },
  ],
  solutions: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Built Around Your Site' },
      ],
    },
    {
      group: 'Solution 1',
      fields: [
        { key: 'solution1Title', label: 'Title', placeholder: 'e.g. Homes & Villas' },
        { key: 'solution1Body', label: 'Description', placeholder: 'e.g. Perimeter cameras, indoor coverage, and reliable family Wi-Fi.', multiline: true },
      ],
    },
    {
      group: 'Solution 2',
      fields: [
        { key: 'solution2Title', label: 'Title', placeholder: 'e.g. Shops & Offices' },
        { key: 'solution2Body', label: 'Description', placeholder: 'e.g. Camera monitoring, guest Wi-Fi, POS segmentation, and uptime checks.', multiline: true },
      ],
    },
    {
      group: 'Solution 3',
      fields: [
        { key: 'solution3Title', label: 'Title', placeholder: 'e.g. Warehouses & Project Sites' },
        { key: 'solution3Body', label: 'Description', placeholder: 'e.g. Multi-point surveillance, network extension, and equipment hardening.', multiline: true },
      ],
    },
  ],
  projects: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Recent Installations' },
      ],
    },
    {
      group: 'Project 1',
      fields: [
        { key: 'project1Title', label: 'Title', placeholder: 'e.g. Villa CCTV Upgrade' },
        { key: 'project1Meta', label: 'Meta', placeholder: 'e.g. 8 cameras · Uluwatu' },
        { key: 'project1Body', label: 'Description', placeholder: 'e.g. Replaced the old analog system with IP cameras and remote viewing.', multiline: true },
      ],
    },
    {
      group: 'Project 2',
      fields: [
        { key: 'project2Title', label: 'Title', placeholder: 'e.g. Office Network Refresh' },
        { key: 'project2Meta', label: 'Meta', placeholder: 'e.g. 24 users · Denpasar' },
        { key: 'project2Body', label: 'Description', placeholder: 'e.g. New rack layout, clean patch panel, VLAN-ready switching, and Wi-Fi tuning.', multiline: true },
      ],
    },
    {
      group: 'Project 3',
      fields: [
        { key: 'project3Title', label: 'Title', placeholder: 'e.g. Retail Store Monitoring' },
        { key: 'project3Meta', label: 'Meta', placeholder: 'e.g. 6 cameras · Kuta' },
        { key: 'project3Body', label: 'Description', placeholder: 'e.g. Added cashier, entrance, and stockroom coverage with phone monitoring.', multiline: true },
      ],
    },
  ],
  coverage: [
    {
      group: 'Coverage & Response',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Service Coverage' },
        { key: 'coverageArea1', label: 'Coverage Area 1', placeholder: 'e.g. Denpasar & Sanur' },
        { key: 'coverageArea2', label: 'Coverage Area 2', placeholder: 'e.g. Kuta, Seminyak, Canggu' },
        { key: 'coverageArea3', label: 'Coverage Area 3', placeholder: 'e.g. Jimbaran, Nusa Dua, Uluwatu' },
        { key: 'responseTime', label: 'Response Time', placeholder: 'e.g. Survey in 24 hours for most Bali areas' },
        { key: 'serviceHours', label: 'Service Hours', placeholder: 'e.g. Mon - Sat · 08:00 - 18:00' },
        { key: 'supportNote', label: 'Support Note', placeholder: 'e.g. Emergency troubleshooting available for existing clients.', multiline: true },
      ],
    },
  ],
  about: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Our Story' },
      ],
    },
    {
      group: 'Stats Row',
      fields: [
        { key: 'stat1Value', label: 'Stat 1 - Value', placeholder: 'e.g. 15+' },
        { key: 'stat1Label', label: 'Stat 1 - Label', placeholder: 'e.g. Years of Craft' },
        { key: 'stat2Value', label: 'Stat 2 - Value', placeholder: 'e.g. 500+' },
        { key: 'stat2Label', label: 'Stat 2 - Label', placeholder: 'e.g. Unique Designs' },
        { key: 'stat3Value', label: 'Stat 3 - Value', placeholder: 'e.g. 50+' },
        { key: 'stat3Label', label: 'Stat 3 - Label', placeholder: 'e.g. Countries' },
      ],
    },
  ],
  sustainability: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Our Values' },
      ],
    },
    {
      group: 'Feature Card 1',
      fields: [
        { key: 'feature1Title', label: 'Title', placeholder: 'e.g. Eco-Friendly' },
        { key: 'feature1Body', label: 'Description', placeholder: 'e.g. Recycled metals...', multiline: true },
      ],
    },
    {
      group: 'Feature Card 2',
      fields: [
        { key: 'feature2Title', label: 'Title', placeholder: 'e.g. Fair Trade' },
        { key: 'feature2Body', label: 'Description', placeholder: 'e.g. Artisans are paid fairly...', multiline: true },
      ],
    },
    {
      group: 'Feature Card 3',
      fields: [
        { key: 'feature3Title', label: 'Title', placeholder: 'e.g. Ethically Sourced' },
        { key: 'feature3Body', label: 'Description', placeholder: 'e.g. Gemstones and metals...', multiline: true },
      ],
    },
    {
      group: 'Feature Card 4',
      fields: [
        { key: 'feature4Title', label: 'Title', placeholder: 'e.g. Handmade' },
        { key: 'feature4Body', label: 'Description', placeholder: 'e.g. Every piece individually crafted...', multiline: true },
      ],
    },
  ],
  testimonials: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Loved By Many' },
        { key: 'emptySoonText', label: 'Empty State Text', placeholder: 'e.g. Reviews coming soon' },
      ],
    },
  ],
  contact: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Get In Touch' },
        { key: 'locationLabel', label: 'Location Box Label', placeholder: 'e.g. Location' },
        { key: 'emailLabel', label: 'Email Box Label', placeholder: 'e.g. Email' },
        { key: 'socialLabel', label: 'Social Box Label', placeholder: 'e.g. Follow Us' },
        { key: 'ctaPrimaryText', label: 'Primary CTA Text', placeholder: 'e.g. Request Site Survey' },
        { key: 'ctaSecondaryText', label: 'Secondary CTA Text', placeholder: 'e.g. Email Project Details' },
        { key: 'serviceHours', label: 'Service Hours', placeholder: 'e.g. Mon - Sat · 08:00 - 18:00' },
      ],
    },
  ],
  rooms: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Stay Your Way' },
      ],
    },
    {
      group: 'Room 1',
      fields: [
        { key: 'room1Title', label: 'Title', placeholder: 'e.g. Garden Suite' },
        { key: 'room1Subtitle', label: 'Subtitle', placeholder: 'e.g. Quiet courtyard escape' },
        { key: 'room1Price', label: 'Price', placeholder: 'e.g. From IDR 950K / night' },
        { key: 'room1Highlights', label: 'Highlights', placeholder: 'e.g. King bed, private terrace, breakfast' },
        { key: 'room1Image', label: 'Image URL', placeholder: 'https://...' },
      ],
    },
    {
      group: 'Room 2',
      fields: [
        { key: 'room2Title', label: 'Title', placeholder: 'e.g. Pool Loft' },
        { key: 'room2Subtitle', label: 'Subtitle', placeholder: 'e.g. Elevated indoor-outdoor stay' },
        { key: 'room2Price', label: 'Price', placeholder: 'e.g. From IDR 1.25M / night' },
        { key: 'room2Highlights', label: 'Highlights', placeholder: 'e.g. Pool access, bathtub, workspace' },
        { key: 'room2Image', label: 'Image URL', placeholder: 'https://...' },
      ],
    },
    {
      group: 'Room 3',
      fields: [
        { key: 'room3Title', label: 'Title', placeholder: 'e.g. Family Pavilion' },
        { key: 'room3Subtitle', label: 'Subtitle', placeholder: 'e.g. Spacious stay for longer trips' },
        { key: 'room3Price', label: 'Price', placeholder: 'e.g. From IDR 1.8M / night' },
        { key: 'room3Highlights', label: 'Highlights', placeholder: 'e.g. Two bedrooms, pantry, lounge' },
        { key: 'room3Image', label: 'Image URL', placeholder: 'https://...' },
      ],
    },
  ],
  amenities: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Everything You Need' },
      ],
    },
    {
      group: 'Amenity 1',
      fields: [
        { key: 'amenity1Title', label: 'Title', placeholder: 'e.g. Tropical Pool' },
        { key: 'amenity1Body', label: 'Description', placeholder: 'e.g. A calm shared pool wrapped in greenery.', multiline: true },
      ],
    },
    {
      group: 'Amenity 2',
      fields: [
        { key: 'amenity2Title', label: 'Title', placeholder: 'e.g. Daily Breakfast' },
        { key: 'amenity2Body', label: 'Description', placeholder: 'e.g. Fresh local breakfast delivered each morning.', multiline: true },
      ],
    },
    {
      group: 'Amenity 3',
      fields: [
        { key: 'amenity3Title', label: 'Title', placeholder: 'e.g. Fast Wi-Fi' },
        { key: 'amenity3Body', label: 'Description', placeholder: 'e.g. Reliable connection for work and streaming.', multiline: true },
      ],
    },
    {
      group: 'Amenity 4',
      fields: [
        { key: 'amenity4Title', label: 'Title', placeholder: 'e.g. Airport Transfer' },
        { key: 'amenity4Body', label: 'Description', placeholder: 'e.g. Optional pickup arranged before arrival.', multiline: true },
      ],
    },
  ],
  gallery: [
    {
      group: 'Labels',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. A Glimpse of the Stay' },
      ],
    },
    {
      group: 'Gallery Images',
      fields: [
        { key: 'image1Url', label: 'Image 1 URL', placeholder: 'https://...' },
        { key: 'image1Label', label: 'Image 1 Label', placeholder: 'e.g. Pool courtyard' },
        { key: 'image2Url', label: 'Image 2 URL', placeholder: 'https://...' },
        { key: 'image2Label', label: 'Image 2 Label', placeholder: 'e.g. Suite interior' },
        { key: 'image3Url', label: 'Image 3 URL', placeholder: 'https://...' },
        { key: 'image3Label', label: 'Image 3 Label', placeholder: 'e.g. Breakfast table' },
        { key: 'image4Url', label: 'Image 4 URL', placeholder: 'https://...' },
        { key: 'image4Label', label: 'Image 4 Label', placeholder: 'e.g. Rice field walk nearby' },
      ],
    },
  ],
  location: [
    {
      group: 'Labels & Links',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. In the Heart of Bali' },
        { key: 'mapUrl', label: 'Map Link', placeholder: 'https://maps.google.com/...' },
        { key: 'nearby1', label: 'Nearby Highlight 1', placeholder: 'e.g. 7 min to Echo Beach' },
        { key: 'nearby2', label: 'Nearby Highlight 2', placeholder: 'e.g. 3 min to cafes and shops' },
        { key: 'nearby3', label: 'Nearby Highlight 3', placeholder: 'e.g. 45 min from airport' },
      ],
    },
  ],
  booking: [
    {
      group: 'Labels & CTA',
      fields: [
        { key: 'badgeLabel', label: 'Badge Label', placeholder: 'e.g. Plan Your Stay' },
        { key: 'ctaPrimaryText', label: 'Primary Button Text', placeholder: 'e.g. Check Availability' },
        { key: 'ctaPrimaryLink', label: 'Primary Button Link', placeholder: 'e.g. WhatsApp link or booking URL' },
        { key: 'ctaSecondaryText', label: 'Secondary Button Text', placeholder: 'e.g. Email the Host' },
        { key: 'ctaSecondaryLink', label: 'Secondary Button Link', placeholder: 'e.g. mailto:host@example.com' },
        { key: 'availabilityNote', label: 'Availability Note', placeholder: 'e.g. Response within 30 minutes during office hours', multiline: true },
        { key: 'checkInLabel', label: 'Check-in Label', placeholder: 'e.g. Check-in' },
        { key: 'checkInValue', label: 'Check-in Value', placeholder: 'e.g. 14:00 onwards' },
        { key: 'checkOutLabel', label: 'Check-out Label', placeholder: 'e.g. Check-out' },
        { key: 'checkOutValue', label: 'Check-out Value', placeholder: 'e.g. Before 12:00' },
      ],
    },
  ],
}