import prisma from './prisma'
import { ensureDefaultGuesthouseProperty } from './siteSettings'
import { ensureTemplateSections } from './templateSections'

type SupportedBusinessType = 'jewelry' | 'guesthouse' | 'cctv'

async function upsertSettings(entries: Array<{ key: string; value: string }>) {
  for (const entry of entries) {
    await prisma.siteSetting.upsert({
      where: { key: entry.key },
      update: { value: entry.value },
      create: entry,
    })
  }
}

async function upsertSections(scope: { businessType: SupportedBusinessType; templateKey: string }, entries: Array<{ slug: string; title: string; subtitle?: string; body?: string; image?: string | null; sortOrder: number; metadata?: Record<string, string> | null }>) {
  for (const entry of entries) {
    await prisma.section.upsert({
      where: {
        businessType_templateKey_slug: {
          businessType: scope.businessType,
          templateKey: scope.templateKey,
          slug: entry.slug,
        },
      },
      update: {
        title: entry.title,
        subtitle: entry.subtitle || null,
        body: entry.body || null,
        image: entry.image || null,
        sortOrder: entry.sortOrder,
        metadata: entry.metadata || undefined,
        isActive: true,
      },
      create: {
        businessType: scope.businessType,
        templateKey: scope.templateKey,
        ...entry,
        image: entry.image || null,
        isActive: true,
      },
    })
  }
}

async function seedJewelryDemo() {
  await upsertSettings([
    { key: 'businessType', value: 'jewelry' },
    { key: 'templateKey', value: 'jewelry-classic' },
    { key: 'siteName', value: 'Pebbles Bali Jewelry' },
    { key: 'siteTagline', value: 'Handcrafted Balinese jewelry with modern silhouettes' },
    { key: 'siteUrl', value: 'https://pebblesbali.com' },
    { key: 'contactEmail', value: 'hello@pebblesbali.com' },
    { key: 'contactPhone', value: '+62 811 3994 222' },
    { key: 'whatsappNumber', value: '628113994222' },
    { key: 'instagramUrl', value: 'https://instagram.com/pebblesbali' },
    { key: 'metaKeywords', value: 'balinese jewelry, handcrafted necklace, bali earrings, artisan rings' },
    { key: 'featureShop', value: 'true' },
    { key: 'featureCart', value: 'true' },
    { key: 'featureBlog', value: 'true' },
    { key: 'featureRoomInventory', value: 'false' },
    { key: 'featureBookingEngine', value: 'false' },
    { key: 'featureTestimonials', value: 'true' },
    { key: 'featureMediaLibrary', value: 'true' },
    { key: 'featureSeo', value: 'true' },
    { key: 'featureTheme', value: 'true' },
  ])

  await ensureTemplateSections('jewelry-classic', 'jewelry')
  await upsertSections({ businessType: 'jewelry', templateKey: 'jewelry-classic' }, [
    { slug: 'hero', title: 'Jewelry shaped by Bali light', subtitle: 'Handcrafted pieces for daily rituals and special evenings', body: 'A compact collection of necklaces, rings, earrings, and bracelets designed with warm metals, tactile details, and slower production.', sortOrder: 1, metadata: { badgeLabel: 'Crafted in Bali', ctaPrimaryText: 'Shop Collection', ctaPrimaryLink: '/shop', ctaSecondaryText: 'Our Story', ctaSecondaryLink: '#about' } },
    { slug: 'collections', title: 'Collections', subtitle: 'Browse signature categories', sortOrder: 2, metadata: { badgeLabel: 'Signature Lines' } },
    { slug: 'about', title: 'Made in small batches', subtitle: 'Contemporary jewelry rooted in island craft', body: 'Each piece is made with a slower process, balancing everyday wearability with a distinctly Balinese sense of texture and ornament.', sortOrder: 3 },
    { slug: 'sustainability', title: 'Materials and making', subtitle: 'Thoughtful sourcing, careful finishing', body: 'We focus on smaller runs, adaptable materials, and details that keep the product feeling personal rather than mass-made.', sortOrder: 4 },
    { slug: 'testimonials', title: 'Customer notes', subtitle: 'Why people keep coming back', sortOrder: 5 },
    { slug: 'blog', title: 'Journal', subtitle: 'Behind the pieces', sortOrder: 6 },
    { slug: 'contact', title: 'Get in touch', subtitle: 'For custom requests and stock questions', sortOrder: 7 },
  ])

  const collections = await Promise.all([
    prisma.collection.upsert({ where: { slug: 'necklaces' }, update: { name: 'Necklaces', description: 'Layered chains and statement pendants for warm-weather styling.', sortOrder: 1, isActive: true }, create: { name: 'Necklaces', slug: 'necklaces', description: 'Layered chains and statement pendants for warm-weather styling.', sortOrder: 1, isActive: true } }),
    prisma.collection.upsert({ where: { slug: 'earrings' }, update: { name: 'Earrings', description: 'Delicate drops and sculptural pairs inspired by island movement.', sortOrder: 2, isActive: true }, create: { name: 'Earrings', slug: 'earrings', description: 'Delicate drops and sculptural pairs inspired by island movement.', sortOrder: 2, isActive: true } }),
    prisma.collection.upsert({ where: { slug: 'rings' }, update: { name: 'Rings', description: 'Stackable silhouettes and occasion-ready statement forms.', sortOrder: 3, isActive: true }, create: { name: 'Rings', slug: 'rings', description: 'Stackable silhouettes and occasion-ready statement forms.', sortOrder: 3, isActive: true } }),
  ])

  await prisma.product.upsert({
    where: { slug: 'canggu-sun-necklace' },
    update: { name: 'Canggu Sun Necklace', description: '<p>A soft gold pendant designed for daily wear with resort styling.</p>', price: 780000, collectionId: collections[0].id, isFeatured: true, isActive: true, sortOrder: 1 },
    create: { name: 'Canggu Sun Necklace', slug: 'canggu-sun-necklace', description: '<p>A soft gold pendant designed for daily wear with resort styling.</p>', price: 780000, collectionId: collections[0].id, isFeatured: true, isActive: true, sortOrder: 1, gallery: [] },
  })
  await prisma.product.upsert({
    where: { slug: 'tirta-drop-earrings' },
    update: { name: 'Tirta Drop Earrings', description: '<p>Lightweight drop earrings with a fluid silhouette.</p>', price: 540000, collectionId: collections[1].id, isFeatured: true, isActive: true, sortOrder: 2 },
    create: { name: 'Tirta Drop Earrings', slug: 'tirta-drop-earrings', description: '<p>Lightweight drop earrings with a fluid silhouette.</p>', price: 540000, collectionId: collections[1].id, isFeatured: true, isActive: true, sortOrder: 2, gallery: [] },
  })
  await prisma.product.upsert({
    where: { slug: 'ubud-stack-ring' },
    update: { name: 'Ubud Stack Ring', description: '<p>A textured ring made to layer with slim bands.</p>', price: 420000, collectionId: collections[2].id, isFeatured: false, isActive: true, sortOrder: 3 },
    create: { name: 'Ubud Stack Ring', slug: 'ubud-stack-ring', description: '<p>A textured ring made to layer with slim bands.</p>', price: 420000, collectionId: collections[2].id, isFeatured: false, isActive: true, sortOrder: 3, gallery: [] },
  })

  await prisma.testimonial.upsert({
    where: { id: 'jewelry-seed-testimonial-1' },
    update: { name: 'Nadia R.', role: 'Returning customer', content: 'The finish feels premium and the designs do not look generic. I wear them constantly.', rating: 5, isActive: true, sortOrder: 1 },
    create: { id: 'jewelry-seed-testimonial-1', name: 'Nadia R.', role: 'Returning customer', content: 'The finish feels premium and the designs do not look generic. I wear them constantly.', rating: 5, isActive: true, sortOrder: 1 },
  })
  await prisma.blogPost.upsert({
    where: { slug: 'how-we-balance-craft-and-wearability' },
    update: { title: 'How We Balance Craft and Wearability', excerpt: 'A quick look at how the collection stays tactile but practical.', body: '<p>We design for repeat wear, not just photos. That means balanced scale, practical closures, and materials that feel at home in tropical climates.</p>', isPublished: true, publishedAt: new Date(), sortOrder: 1 },
    create: { title: 'How We Balance Craft and Wearability', slug: 'how-we-balance-craft-and-wearability', excerpt: 'A quick look at how the collection stays tactile but practical.', body: '<p>We design for repeat wear, not just photos. That means balanced scale, practical closures, and materials that feel at home in tropical climates.</p>', image: null, tags: ['design', 'craft'], isPublished: true, publishedAt: new Date(), sortOrder: 1 },
  })
}

async function seedGuesthouseDemo() {
  await upsertSettings([
    { key: 'businessType', value: 'guesthouse' },
    { key: 'templateKey', value: 'guesthouse-retreat' },
    { key: 'siteName', value: 'Pebbles Bali Guesthouse' },
    { key: 'siteTagline', value: 'Boutique rooms for slower Bali stays' },
    { key: 'siteUrl', value: 'https://stay.pebblesbali.com' },
    { key: 'contactEmail', value: 'stay@pebblesbali.com' },
    { key: 'contactPhone', value: '+62 811 3994 222' },
    { key: 'whatsappNumber', value: '628113994222' },
    { key: 'address', value: 'Jalan Pantai Batu Bolong, Canggu, Bali, Indonesia' },
    { key: 'instagramUrl', value: 'https://instagram.com/pebblesbali' },
    { key: 'metaKeywords', value: 'guesthouse bali, room rent canggu, boutique stay bali, tropical guesthouse' },
    { key: 'featureShop', value: 'false' },
    { key: 'featureCart', value: 'false' },
    { key: 'featureBlog', value: 'false' },
    { key: 'featureRoomInventory', value: 'true' },
    { key: 'featureBookingEngine', value: 'true' },
    { key: 'featureTestimonials', value: 'true' },
    { key: 'featureMediaLibrary', value: 'true' },
    { key: 'featureSeo', value: 'true' },
    { key: 'featureTheme', value: 'true' },
  ])

  await ensureTemplateSections('guesthouse-retreat', 'guesthouse')
  await upsertSections({ businessType: 'guesthouse', templateKey: 'guesthouse-retreat' }, [
    { slug: 'hero', title: 'Slow mornings, warm light, tropical calm', subtitle: 'A boutique Balinese guesthouse designed for long breaths and easy arrivals.', body: 'Stay in a compact guesthouse with warm materials, planted courtyards, and direct host support for easier arrivals.', sortOrder: 1, metadata: { badgeLabel: 'Canggu Retreat', ctaPrimaryText: 'Browse Rooms', ctaPrimaryLink: '#rooms', ctaSecondaryText: 'Check Availability', ctaSecondaryLink: '/book', highlight1: '8 private suites', highlight2: '7 minutes to the beach', highlight3: 'Daily breakfast available' } },
    { slug: 'rooms', title: 'Featured room types', subtitle: 'Choose a stay that matches your pace', body: 'Room inventory on the backend is handled per unit, but the public experience is organized around room types so guests can compare the right stay quickly.', sortOrder: 2 },
    { slug: 'amenities', title: 'Comforts that matter', subtitle: 'Practical details for short and long stays', body: 'Expect useful amenities, quick host support, and a calmer setup for work-and-rest stays.', sortOrder: 3 },
    { slug: 'gallery', title: 'See the atmosphere', subtitle: 'A visual feel before you arrive', body: 'A preview of the rooms, shared courtyard, and the rhythm around the property.', sortOrder: 4 },
    { slug: 'location', title: 'Close to what brings you here', subtitle: 'Beach, cafes, and daily essentials nearby', body: 'The property is close enough for easy access and quiet enough for rest.', sortOrder: 5, metadata: { nearby1: '7 min to the beach', nearby2: '3 min to cafes and shops', nearby3: '45 min from airport' } },
    { slug: 'testimonials', title: 'Guest notes', subtitle: 'What recent stays felt like', body: 'Short impressions from guests who stayed for work, surf, or longer Bali breaks.', sortOrder: 6 },
    { slug: 'booking', title: 'Ready to check dates?', subtitle: 'Use the booking page to review availability and send a stay request.', body: 'Pick your dates, review featured room types, and submit a direct request. The host can confirm details after reviewing availability.', sortOrder: 7, metadata: { ctaPrimaryText: 'Open Booking Page', ctaPrimaryLink: '/book', ctaSecondaryText: 'Email Host' } },
  ])

  const property = await ensureDefaultGuesthouseProperty()

  const roomTypes = await Promise.all([
    prisma.roomType.upsert({
      where: { propertyId_slug: { propertyId: property.id, slug: 'garden-suite' } },
      update: { name: 'Garden Suite', description: '<p>A calm suite with private terrace access and a softer indoor-outdoor feel.</p>', baseOccupancy: 2, maxOccupancy: 2, bedroomCount: 1, bathroomCount: 1, areaSqm: 28, bedConfiguration: '1 king bed', defaultNightlyRate: 950000, extraAdultRate: 0, extraChildRate: 0, sortOrder: 1, isActive: true, metadata: { featured: true, facilities: ['Private terrace', 'Breakfast included', 'Wi-Fi', 'Air conditioning'], imageUrl: null } },
      create: { propertyId: property.id, name: 'Garden Suite', slug: 'garden-suite', description: '<p>A calm suite with private terrace access and a softer indoor-outdoor feel.</p>', baseOccupancy: 2, maxOccupancy: 2, bedroomCount: 1, bathroomCount: 1, areaSqm: 28, bedConfiguration: '1 king bed', defaultNightlyRate: 950000, extraAdultRate: 0, extraChildRate: 0, sortOrder: 1, isActive: true, metadata: { featured: true, facilities: ['Private terrace', 'Breakfast included', 'Wi-Fi', 'Air conditioning'], imageUrl: null } },
    }),
    prisma.roomType.upsert({
      where: { propertyId_slug: { propertyId: property.id, slug: 'pool-loft' } },
      update: { name: 'Pool Loft', description: '<p>A larger room type with workspace, bathtub, and closer access to the shared pool.</p>', baseOccupancy: 2, maxOccupancy: 3, bedroomCount: 1, bathroomCount: 1, areaSqm: 34, bedConfiguration: '1 king bed + daybed', defaultNightlyRate: 1250000, extraAdultRate: 250000, extraChildRate: 100000, sortOrder: 2, isActive: true, metadata: { featured: true, facilities: ['Workspace', 'Bathtub', 'Pool access', 'Wi-Fi', 'Air conditioning'], imageUrl: null } },
      create: { propertyId: property.id, name: 'Pool Loft', slug: 'pool-loft', description: '<p>A larger room type with workspace, bathtub, and closer access to the shared pool.</p>', baseOccupancy: 2, maxOccupancy: 3, bedroomCount: 1, bathroomCount: 1, areaSqm: 34, bedConfiguration: '1 king bed + daybed', defaultNightlyRate: 1250000, extraAdultRate: 250000, extraChildRate: 100000, sortOrder: 2, isActive: true, metadata: { featured: true, facilities: ['Workspace', 'Bathtub', 'Pool access', 'Wi-Fi', 'Air conditioning'], imageUrl: null } },
    }),
    prisma.roomType.upsert({
      where: { propertyId_slug: { propertyId: property.id, slug: 'family-pavilion' } },
      update: { name: 'Family Pavilion', description: '<p>A wider layout for longer stays, small groups, or families who need more breathing room.</p>', baseOccupancy: 3, maxOccupancy: 4, bedroomCount: 2, bathroomCount: 2, areaSqm: 52, bedConfiguration: '1 king bed + 2 single beds', defaultNightlyRate: 1800000, extraAdultRate: 250000, extraChildRate: 100000, sortOrder: 3, isActive: true, metadata: { featured: true, facilities: ['Kitchenette', 'Breakfast included', 'Smart TV', 'Wi-Fi', 'Air conditioning'], imageUrl: null } },
      create: { propertyId: property.id, name: 'Family Pavilion', slug: 'family-pavilion', description: '<p>A wider layout for longer stays, small groups, or families who need more breathing room.</p>', baseOccupancy: 3, maxOccupancy: 4, bedroomCount: 2, bathroomCount: 2, areaSqm: 52, bedConfiguration: '1 king bed + 2 single beds', defaultNightlyRate: 1800000, extraAdultRate: 250000, extraChildRate: 100000, sortOrder: 3, isActive: true, metadata: { featured: true, facilities: ['Kitchenette', 'Breakfast included', 'Smart TV', 'Wi-Fi', 'Air conditioning'], imageUrl: null } },
    }),
  ])

  await Promise.all([
    prisma.roomUnit.upsert({ where: { propertyId_code: { propertyId: property.id, code: 'GS-01' } }, update: { roomTypeId: roomTypes[0].id, name: 'Garden Suite 1', status: 'active', isBookable: true }, create: { propertyId: property.id, roomTypeId: roomTypes[0].id, code: 'GS-01', name: 'Garden Suite 1', status: 'active', isBookable: true } }),
    prisma.roomUnit.upsert({ where: { propertyId_code: { propertyId: property.id, code: 'GS-02' } }, update: { roomTypeId: roomTypes[0].id, name: 'Garden Suite 2', status: 'active', isBookable: true }, create: { propertyId: property.id, roomTypeId: roomTypes[0].id, code: 'GS-02', name: 'Garden Suite 2', status: 'active', isBookable: true } }),
    prisma.roomUnit.upsert({ where: { propertyId_code: { propertyId: property.id, code: 'PL-01' } }, update: { roomTypeId: roomTypes[1].id, name: 'Pool Loft 1', status: 'active', isBookable: true }, create: { propertyId: property.id, roomTypeId: roomTypes[1].id, code: 'PL-01', name: 'Pool Loft 1', status: 'active', isBookable: true } }),
    prisma.roomUnit.upsert({ where: { propertyId_code: { propertyId: property.id, code: 'FP-01' } }, update: { roomTypeId: roomTypes[2].id, name: 'Family Pavilion 1', status: 'active', isBookable: true }, create: { propertyId: property.id, roomTypeId: roomTypes[2].id, code: 'FP-01', name: 'Family Pavilion 1', status: 'active', isBookable: true } }),
  ])

  await prisma.testimonial.upsert({
    where: { id: 'guesthouse-seed-testimonial-1' },
    update: { name: 'Mira T.', role: 'Remote worker stay', content: 'The room was quiet, the Wi-Fi was stable, and check-in was straightforward. It felt easy to stay longer than planned.', rating: 5, isActive: true, sortOrder: 1 },
    create: { id: 'guesthouse-seed-testimonial-1', name: 'Mira T.', role: 'Remote worker stay', content: 'The room was quiet, the Wi-Fi was stable, and check-in was straightforward. It felt easy to stay longer than planned.', rating: 5, isActive: true, sortOrder: 1 },
  })
}

async function seedCctvDemo() {
  await upsertSettings([
    { key: 'businessType', value: 'cctv' },
    { key: 'templateKey', value: 'cctv-networking-classic' },
    { key: 'siteName', value: 'Pebbles Bali Tech' },
    { key: 'siteTagline', value: 'CCTV, Wi-Fi, and structured cabling for homes and businesses' },
    { key: 'siteUrl', value: 'https://tech.pebblesbali.com' },
    { key: 'contactEmail', value: 'tech@pebblesbali.com' },
    { key: 'contactPhone', value: '+62 811 3994 222' },
    { key: 'whatsappNumber', value: '628113994222' },
    { key: 'address', value: 'Denpasar, Bali, Indonesia' },
    { key: 'instagramUrl', value: 'https://instagram.com/pebblesbali' },
    { key: 'metaKeywords', value: 'cctv bali, instalasi cctv, jaringan kantor bali, wifi kantor bali, maintenance jaringan' },
    { key: 'featureShop', value: 'false' },
    { key: 'featureCart', value: 'false' },
    { key: 'featureBlog', value: 'false' },
    { key: 'featureRoomInventory', value: 'false' },
    { key: 'featureBookingEngine', value: 'false' },
    { key: 'featureTestimonials', value: 'true' },
    { key: 'featureMediaLibrary', value: 'true' },
    { key: 'featureSeo', value: 'true' },
    { key: 'featureTheme', value: 'true' },
  ])

  await ensureTemplateSections('cctv-networking-classic', 'cctv')
  await upsertSections({ businessType: 'cctv', templateKey: 'cctv-networking-classic' }, [
    { slug: 'hero', title: 'CCTV and network installations with cleaner execution', subtitle: 'For homes, villas, retail spaces, offices, and small project sites across Bali.', body: 'We handle survey, installation, configuration, and maintenance with a focus on cable discipline, reliable coverage, and clear handover after the job is done.', sortOrder: 1, metadata: { badgeLabel: 'Bali CCTV & Networking', ctaPrimaryText: 'Request Survey', ctaPrimaryLink: '#contact', ctaSecondaryText: 'View Services', ctaSecondaryLink: '#services', highlight1: 'Camera layout planning', highlight2: 'Wi-Fi and LAN deployment', highlight3: 'Maintenance and troubleshooting' } },
    { slug: 'services', title: 'Core technical services', subtitle: 'Installation, setup, and after-install support', body: 'Position the offer around the jobs clients understand quickly: CCTV, Wi-Fi, structured cabling, and troubleshooting.', sortOrder: 2, metadata: { badgeLabel: 'Core Services' } },
    { slug: 'solutions', title: 'Solutions adapted to each site type', subtitle: 'Not every home, office, or store needs the same camera plan or network layout', body: 'Use this section to show you think in terms of site conditions and operations, not only device lists.', sortOrder: 3, metadata: { badgeLabel: 'By Site Type' } },
    { slug: 'projects', title: 'Recent installation snapshots', subtitle: 'Examples that help prospects understand scope, quantity, and result', body: 'Short project cards are enough if they mention what was installed, where, and what problem was solved.', sortOrder: 4, metadata: { badgeLabel: 'Recent Work', project1Title: 'Villa CCTV Upgrade', project1Meta: '8 cameras · Uluwatu', project1Body: 'Converted an older analog layout into a cleaner IP camera system with remote phone access and night visibility improvements.', project2Title: 'Office Network Refresh', project2Meta: '24 users · Denpasar', project2Body: 'Reworked the rack, replaced patching, tuned Wi-Fi coverage, and prepared the office for cleaner expansion.', project3Title: 'Retail Monitoring Setup', project3Meta: '6 cameras · Kuta', project3Body: 'Added cashier, entrance, stockroom, and parking coverage while simplifying remote checks for the owner.' } },
    { slug: 'coverage', title: 'Coverage area and expected response', subtitle: 'Clear scope before the first survey request', body: 'Let clients know the areas you commonly cover, the hours you usually operate, and how fast you can inspect urgent issues.', sortOrder: 5, metadata: { badgeLabel: 'Service Coverage', coverageArea1: 'Denpasar & Sanur', coverageArea2: 'Kuta, Seminyak, Canggu', coverageArea3: 'Jimbaran, Nusa Dua, Uluwatu', responseTime: 'Site survey within 24 hours for most Bali areas', serviceHours: 'Mon - Sat · 08:00 - 18:00', supportNote: 'Emergency troubleshooting available for existing clients depending on site conditions.' } },
    { slug: 'testimonials', title: 'Client feedback', subtitle: 'Short reviews that reinforce reliability and response speed', body: 'The strongest testimonials here usually mention neat installation, stable performance, and straightforward communication.', sortOrder: 6, metadata: { badgeLabel: 'Trusted on Site' } },
    { slug: 'contact', title: 'Request a site survey', subtitle: 'Send the site type, main issue, or installation target for a practical next step.', body: 'WhatsApp is the fastest path for a survey request. Email works well if you already have a layout, photo set, or project brief ready.', sortOrder: 7, metadata: { badgeLabel: 'Contact & Survey', ctaPrimaryText: 'Request Survey', ctaSecondaryText: 'Email Project Details', serviceHours: 'Mon - Sat · 08:00 - 18:00' } },
  ])

  await prisma.testimonial.upsert({
    where: { id: 'cctv-seed-testimonial-1' },
    update: { name: 'Adi W.', role: 'Villa Operations', content: 'The installation was neat, the camera angles made sense, and the remote monitoring worked properly from day one.', rating: 5, isActive: true, sortOrder: 1 },
    create: { id: 'cctv-seed-testimonial-1', name: 'Adi W.', role: 'Villa Operations', content: 'The installation was neat, the camera angles made sense, and the remote monitoring worked properly from day one.', rating: 5, isActive: true, sortOrder: 1 },
  })
  await prisma.testimonial.upsert({
    where: { id: 'cctv-seed-testimonial-2' },
    update: { name: 'Rina S.', role: 'Retail Owner', content: 'They fixed our unstable office Wi-Fi and added CCTV coverage without leaving a messy cable run behind.', rating: 5, isActive: true, sortOrder: 2 },
    create: { id: 'cctv-seed-testimonial-2', name: 'Rina S.', role: 'Retail Owner', content: 'They fixed our unstable office Wi-Fi and added CCTV coverage without leaving a messy cable run behind.', rating: 5, isActive: true, sortOrder: 2 },
  })
}

export async function seedBusinessDemo(businessType: SupportedBusinessType) {
  if (businessType === 'jewelry') {
    await seedJewelryDemo()
    return { businessType, message: 'Jewelry demo content seeded successfully.' }
  }

  if (businessType === 'guesthouse') {
    await seedGuesthouseDemo()
    return { businessType, message: 'Guesthouse demo content seeded successfully.' }
  }

  await seedCctvDemo()
  return { businessType, message: 'CCTV & networking demo content seeded successfully.' }
}