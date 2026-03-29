import prisma from './prisma'

interface TemplateSectionSeed {
  slug: string
  title: string
  subtitle?: string
  body?: string
  sortOrder: number
}

const TEMPLATE_SECTION_SEEDS: Record<string, TemplateSectionSeed[]> = {
  'jewelry-classic': [
    { slug: 'hero', title: 'Hero', subtitle: 'Discover the magic of Bali', body: 'Exquisite, handcrafted jewelry inspired by the island\'s rich cultural heritage.', sortOrder: 1 },
    { slug: 'collections', title: 'Collections', subtitle: 'Explore Our Collection', sortOrder: 2 },
    { slug: 'about', title: 'About Us', subtitle: 'Our Story', body: 'Sense of Jewels was born out of a passion for the enchanting beauty and timeless traditions of Bali.', sortOrder: 3 },
    { slug: 'sustainability', title: 'Sustainability', subtitle: 'Our Commitment to Sustainability', sortOrder: 4 },
    { slug: 'testimonials', title: 'Testimonials', subtitle: 'Loved by our customers', sortOrder: 5 },
    { slug: 'blog', title: 'Journal', subtitle: 'Stories from the island', sortOrder: 6 },
    { slug: 'contact', title: 'Contact', subtitle: 'We would love to hear from you', sortOrder: 7 },
  ],
  'guesthouse-retreat': [
    { slug: 'hero', title: 'Slow mornings, warm light, tropical calm', subtitle: 'A boutique Balinese guesthouse designed for long breaths and easy arrivals.', body: 'Welcome to your quiet base in Bali, with thoughtful rooms, a lush courtyard, and hosts who keep everything easy.', sortOrder: 1 },
    { slug: 'rooms', title: 'Rooms for every rhythm', subtitle: 'Choose the stay that fits your trip', body: 'From compact suites to spacious family setups, every room is shaped for comfort, airflow, and a softer pace.', sortOrder: 2 },
    { slug: 'amenities', title: 'Comforts that matter', subtitle: 'Simple details that improve every day', body: 'Useful amenities, local hospitality, and a layout that works whether you stay for a weekend or a month.', sortOrder: 3 },
    { slug: 'gallery', title: 'See the atmosphere', subtitle: 'Spaces, light, and everyday moments', body: 'A quick look at the rooms, shared spaces, and neighborhood mood before you arrive.', sortOrder: 4 },
    { slug: 'location', title: 'Close to what you came for', subtitle: 'Be near beaches, food, and everyday essentials', body: 'Tucked into a calm pocket with convenient access to cafes, surf, and the main routes around town.', sortOrder: 5 },
    { slug: 'testimonials', title: 'Guest notes', subtitle: 'What recent stays felt like', body: 'Short reviews from guests who stayed for rest, work, and longer Bali breaks.', sortOrder: 6 },
    { slug: 'booking', title: 'Ready to plan your stay?', subtitle: 'Reach out directly for current availability', body: 'Tell us your dates, room preference, and group size. We will reply with availability and the best-fit option.', sortOrder: 7 },
  ],
}

function normalizeSectionScope(templateKey: string | null | undefined, businessType?: string | null) {
  if (!templateKey) return null

  const normalizedBusinessType = businessType
    || (templateKey.startsWith('guesthouse-') ? 'guesthouse' : 'jewelry')

  return {
    templateKey,
    businessType: normalizedBusinessType,
  }
}

export async function ensureTemplateSections(templateKey: string | null | undefined, businessType?: string | null) {
  const scope = normalizeSectionScope(templateKey, businessType)
  if (!scope) return

  const sections = TEMPLATE_SECTION_SEEDS[scope.templateKey]
  if (!sections?.length) return

  for (const section of sections) {
    await prisma.section.upsert({
      where: {
        businessType_templateKey_slug: {
          businessType: scope.businessType,
          templateKey: scope.templateKey,
          slug: section.slug,
        },
      },
      update: {
        sortOrder: section.sortOrder,
      },
      create: {
        businessType: scope.businessType,
        templateKey: scope.templateKey,
        ...section,
        isActive: true,
      },
    })
  }
}