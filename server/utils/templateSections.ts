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
  'guesthouse-oasis': [
    { slug: 'hero', title: 'Fresh light, open air, and an easy arrival', subtitle: 'A brighter guesthouse template for calm tropical stays.', body: 'Designed for guesthouses that want a softer, simpler landing page while keeping direct booking front and center.', sortOrder: 1 },
    { slug: 'rooms', title: 'Simple room choices, explained clearly', subtitle: 'Guests can scan options quickly without visual overload', body: 'Room summaries stay concise here, with cleaner cards and softer contrast.', sortOrder: 2 },
    { slug: 'amenities', title: 'Everything you need, nothing noisy', subtitle: 'Comfort details arranged with more breathing room', body: 'This template keeps amenity content light and direct, suited to properties that prefer a more understated tone.', sortOrder: 3 },
    { slug: 'location', title: 'Calm surroundings with practical access', subtitle: 'Close enough to beaches, cafes, and daily needs', body: 'Use this section to position your guesthouse as easy, quiet, and well placed.', sortOrder: 4 },
    { slug: 'gallery', title: 'A soft visual preview of the stay', subtitle: 'Show light, material, and atmosphere', body: 'Gallery tiles stay secondary here so room selection and booking remain the main actions.', sortOrder: 5 },
    { slug: 'testimonials', title: 'What guests remember most', subtitle: 'Short notes that reinforce comfort and ease', body: 'Reviews stay compact inside this template so the flow remains clean.', sortOrder: 6 },
    { slug: 'booking', title: 'Book directly with less friction', subtitle: 'A simplified CTA block for direct booking', body: 'Present direct booking clearly, along with essential arrival and departure details.', sortOrder: 7 },
  ],
  'guesthouse-courtyard': [
    { slug: 'hero', title: 'Courtyard shade, warm hospitality, easier arrivals', subtitle: 'A guesthouse template with a stronger host-led tone and warmer first impression.', body: 'Built for properties that want to feel more personal, more lived-in, and more rooted in everyday hospitality.', sortOrder: 1 },
    { slug: 'rooms', title: 'Room choices with a more welcoming rhythm', subtitle: 'Still clear, but framed with more warmth and atmosphere', body: 'Courtyard mode keeps room selection practical while leaning into hospitality cues.', sortOrder: 2 },
    { slug: 'amenities', title: 'Comforts that feel like part of the stay', subtitle: 'Amenities presented as moments, not just features', body: 'This template gives daily comforts a more human, guest-experience framing.', sortOrder: 3 },
    { slug: 'location', title: 'Close to your rituals in Bali', subtitle: 'Coffee, beach, errands, and return-to-room ease', body: 'Use the location section here to reinforce how the property fits into daily Bali routines.', sortOrder: 4 },
    { slug: 'gallery', title: 'Spaces that feel inhabited and calm', subtitle: 'More courtyard mood, less showroom energy', body: 'The gallery can focus on atmosphere, shade, and quieter moments around the property.', sortOrder: 5 },
    { slug: 'testimonials', title: 'Guest notes with more warmth', subtitle: 'Reviews that reinforce hospitality and personal care', body: 'Courtyard mode works well when testimonials feel human and unpolished in a good way.', sortOrder: 6 },
    { slug: 'booking', title: 'Invite guests into a direct conversation', subtitle: 'Booking phrased more like host support than a hard sell', body: 'Keep booking direct, but let the tone feel warm and responsive.', sortOrder: 7 },
  ],
  'guesthouse-veranda': [
    { slug: 'hero', title: 'Sun-washed terraces, slower check-ins, easy tropical stays', subtitle: 'A veranda-led guesthouse template with warmer light, open-air framing, and softer booking cues.', body: 'Built for properties that want to feel airy, design-forward, and quietly premium without becoming resort-generic.', sortOrder: 1 },
    { slug: 'rooms', title: 'Suites presented with more terrace calm', subtitle: 'Room choices framed around light, airflow, and longer-stay comfort', body: 'Veranda mode favors wider room cards, calmer copy, and a more editorial balance between rates and atmosphere.', sortOrder: 2 },
    { slug: 'amenities', title: 'Daily comforts with a boutique-stay tone', subtitle: 'Show the details that help guests settle in quickly', body: 'Use this section to position the stay as thoughtful, quiet, and well-prepared for slower Bali routines.', sortOrder: 3 },
    { slug: 'gallery', title: 'A visual tour of terraces, rooms, and late light', subtitle: 'More sun, texture, and open-air moments', body: 'The veranda template works best when the gallery leans into natural light and lived-in hospitality.', sortOrder: 4 },
    { slug: 'location', title: 'Stay close to cafes, surf, and the easy route home', subtitle: 'Position the guesthouse around everyday movement, not just landmarks', body: 'Frame the location as part of a softer daily rhythm around the property.', sortOrder: 5 },
    { slug: 'testimonials', title: 'Guest notes from longer, quieter stays', subtitle: 'Reviews should reinforce calm, support, and return visits', body: 'Compact testimonials work well here when they feel specific and grounded.', sortOrder: 6 },
    { slug: 'booking', title: 'Reserve directly with a calmer conversation flow', subtitle: 'Direct booking framed as host support and terrace-ready planning', body: 'Keep the CTA simple, responsive, and less transactional than a standard booking grid.', sortOrder: 7 },
  ],
  'jewelry-editorial': [
    { slug: 'hero', title: 'Jewelry arranged like an editorial story', subtitle: 'A more spacious, gallery-like first impression for handcrafted Balinese pieces.', body: 'This template leans into composition, rhythm, and premium storytelling for jewelry brands that want a stronger visual statement.', sortOrder: 1 },
    { slug: 'collections', title: 'Curated collections with slower pacing', subtitle: 'Let each line feel more deliberate and visual', body: 'Collections can feel less like a catalog block and more like an editorial spread.', sortOrder: 2 },
    { slug: 'about', title: 'The atelier behind each piece', subtitle: 'Craft process, island references, and small-batch thinking', body: 'Shift the tone from generic brand intro to a more composed studio narrative.', sortOrder: 3 },
    { slug: 'sustainability', title: 'Values that support the craft', subtitle: 'Responsibility, sourcing, and small-scale production', body: 'Use this section to frame sustainability as part of the studio voice, not only a feature list.', sortOrder: 4 },
    { slug: 'testimonials', title: 'Private notes from collectors', subtitle: 'Shorter, more curated review presentation', body: 'Editorial mode works best with fewer but stronger customer quotes.', sortOrder: 5 },
    { slug: 'blog', title: 'Journal entries from the studio', subtitle: 'Stories, process notes, and island references', body: 'The journal feels closer to a magazine column in this template.', sortOrder: 6 },
    { slug: 'contact', title: 'Start a more personal conversation', subtitle: 'For custom work, stockists, and direct inquiries', body: 'The final section closes with a more premium, studio-style contact layout.', sortOrder: 7 },
  ],
  'jewelry-boutique': [
    { slug: 'hero', title: 'Boutique jewelry storytelling with softer luxury', subtitle: 'A warmer template for smaller handcrafted collections.', body: 'This preset is shaped for brands that want to feel intimate, refined, and less like a large catalog.', sortOrder: 1 },
    { slug: 'collections', title: 'Collections framed for smaller, stronger edits', subtitle: 'Present fewer things better', body: 'Boutique mode rewards curation and restrained presentation over density.', sortOrder: 2 },
    { slug: 'about', title: 'A brand story that feels closer and more human', subtitle: 'Studio notes, process, and the maker perspective', body: 'Use this section to speak with more warmth and less distance.', sortOrder: 3 },
    { slug: 'sustainability', title: 'Values that support slower craft', subtitle: 'Sourcing, responsibility, and considered production', body: 'This section should read as a natural extension of the boutique brand voice.', sortOrder: 4 },
    { slug: 'testimonials', title: 'Collector notes', subtitle: 'Smaller social proof with a more personal tone', body: 'Boutique layouts benefit from fewer, stronger testimonials.', sortOrder: 5 },
    { slug: 'blog', title: 'Journal', subtitle: 'Stories, process, and styling notes', body: 'Keep the journal compact and intentional in this preset.', sortOrder: 6 },
    { slug: 'contact', title: 'Direct inquiries, custom requests, stockists', subtitle: 'Close the page with a warmer invitation to connect', body: 'The boutique ending should feel approachable and personal.', sortOrder: 7 },
  ],
  'jewelry-noir': [
    { slug: 'hero', title: 'Dark luxury framing with bolder spotlighting', subtitle: 'A cinematic jewelry preset for brands that want more contrast, drama, and collector energy.', body: 'Use this template when the brand should feel rarer, sharper, and more premium from the first fold.', sortOrder: 1 },
    { slug: 'collections', title: 'Products shown like spotlight pieces', subtitle: 'Card layouts favor fewer, stronger hero products', body: 'Noir mode rewards selective merchandising, stronger contrast, and more pronounced price hierarchy.', sortOrder: 2 },
    { slug: 'about', title: 'A studio story with darker elegance', subtitle: 'Craft, rarity, and material precision', body: 'Keep the tone more restrained and collector-focused than lifestyle-oriented.', sortOrder: 3 },
    { slug: 'sustainability', title: 'Material responsibility with premium clarity', subtitle: 'Explain sourcing without softening the luxury tone', body: 'This section should feel precise, elevated, and composed.', sortOrder: 4 },
    { slug: 'testimonials', title: 'Collector feedback', subtitle: 'Smaller review set with stronger authority', body: 'Noir layouts benefit from fewer testimonials with higher signal.', sortOrder: 5 },
    { slug: 'blog', title: 'Studio journal', subtitle: 'Drops, materials, and collector notes', body: 'Use editorial entries to deepen perceived rarity and expertise.', sortOrder: 6 },
    { slug: 'contact', title: 'Private inquiries and custom commissions', subtitle: 'Finish with a more exclusive contact tone', body: 'Encourage direct conversation for limited pieces and bespoke work.', sortOrder: 7 },
  ],
  'jewelry-mobile': [
    { slug: 'hero', title: 'Mobile-first jewelry shopping, but still premium', subtitle: 'Built for brands that want app-like flow, stronger scanning, and faster CTA clarity.', body: 'This preset translates jewelry storytelling into a more conversion-oriented, mobile-commerce rhythm.', sortOrder: 1 },
    { slug: 'collections', title: 'Card stacks designed for quick product scanning', subtitle: 'Compact tiles, clearer price hierarchy, and stronger collection chips', body: 'Use this section when you want the homepage to feel closer to a premium shopping app than a traditional campaign page.', sortOrder: 2 },
    { slug: 'about', title: 'Brand story in a shorter, sharper format', subtitle: 'Enough narrative without slowing the browsing rhythm', body: 'Mobile commerce mode benefits from a more concise studio story.', sortOrder: 3 },
    { slug: 'sustainability', title: 'Material trust signals', subtitle: 'Keep value statements concise and credible', body: 'This section works best as quick trust-building rather than long-form storytelling.', sortOrder: 4 },
    { slug: 'testimonials', title: 'Buyer reviews', subtitle: 'Short review snippets for faster trust building', body: 'Mobile commerce layouts favor denser, more skimmable customer proof.', sortOrder: 5 },
    { slug: 'blog', title: 'New drops and product stories', subtitle: 'Use content like product updates, material notes, and styling drops', body: 'Keep entries compact and tied closely to commerce intent.', sortOrder: 6 },
    { slug: 'contact', title: 'Support, custom requests, and direct help', subtitle: 'A fast path to brand conversation', body: 'Close with practical contact options that fit a commerce-first journey.', sortOrder: 7 },
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