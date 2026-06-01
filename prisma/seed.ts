import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  console.log("🌱 Seeding database...")

  // Create admin user
  const hashedPassword = await bcrypt.hash("romeo@clipe233", 12)
  const admin = await prisma.adminUser.upsert({
    where: { email: "admin@globalexperiencegh.org" },
    update: {},
    create: {
      email: "admin@globalexperiencegh.org",
      password: hashedPassword,
      name: "Admin",
      role: "admin",
    },
  })
  console.log(`✅ Admin user created: ${admin.email}`)

  // Seed Hero Slides
  const heroSlides = [
    { src: "/images/slider-3.jpg", alt: "Global Experience - Making a Difference", order: 0 },
    { src: "/images/slider-kakum-park.jpg", alt: "Kakum National Park - Canopy Walkway", order: 1 },
    { src: "/images/slider-keta-lagoon.jpg", alt: "Keta Lagoon - Coastal Beauty", order: 2 },
    { src: "/images/slider-volunteer-ghana.jpg", alt: "Volunteer Programs in Ghana", order: 3 },
    { src: "/images/slider-adaklu-mountains.jpg", alt: "Adaklu Mountains - Paragliding Excellence", order: 4 },
    { src: "/images/slider-1.jpg", alt: "Community Development Projects", order: 5 },
    { src: "/images/slider-5.jpg", alt: "Explore Ghana with Global Experience", order: 6 },
    { src: "/images/slider-2.jpg", alt: "Life-Changing Placements Abroad", order: 7 },
    { src: "/images/slider-4.jpg", alt: "Discover New Horizons", order: 8 },
  ]

  for (const slide of heroSlides) {
    await prisma.heroSlide.upsert({
      where: { id: `hero-${slide.order}` },
      update: {},
      create: { ...slide, id: `hero-${slide.order}` },
    })
  }
  console.log(`✅ Hero slides seeded: ${heroSlides.length}`)

  // Seed Programs
  const programs = [
    { title: "Medical Placement in Teaching Hospitals", sector: "Healthcare", description: "Gain invaluable hands-on clinical experience in leading teaching hospitals across Africa.", order: 0 },
    { title: "Teaching", sector: "Education", description: "Inspire the next generation by teaching in local schools and educational institutions.", order: 1 },
    { title: "Journalism", sector: "Media", description: "Build your media portfolio with real-world experience in broadcasting and newsrooms.", order: 2 },
    { title: "Community Outreach", sector: "Community Development", description: "Make a lasting difference through community outreach programs that address pressing social needs.", order: 3 },
    { title: "Sports", sector: "Sports & Recreation", description: "Coach and develop sports programs in local communities.", order: 4 },
    { title: "Office Administration", sector: "Business", description: "Develop essential professional skills through office administration placements.", order: 5 },
    { title: "Banking and Finance", sector: "Finance", description: "Gain valuable financial sector experience in emerging markets.", order: 6 },
    { title: "Law Placements", sector: "Legal", description: "Experience the legal system firsthand through placements in local courts and legal organizations.", order: 7 },
    { title: "Agriculture Placement", sector: "Agriculture", description: "Work on sustainable agriculture projects that feed communities and drive economic growth.", order: 8 },
    { title: "Tourism and Ecotourism", sector: "Tourism", description: "Explore the intersection of tourism, conservation, and community development.", order: 9 },
    { title: "Community Projects — Building of Schools", sector: "Infrastructure", description: "Participate in transformative community development by helping build schools.", order: 10 },
    { title: "Bore Holes — Drinkable Water", sector: "Infrastructure", description: "Help provide communities with access to clean, safe drinking water through bore hole drilling.", order: 11 },
  ]

  for (const program of programs) {
    await prisma.program.upsert({
      where: { id: `program-${program.order}` },
      update: {},
      create: { ...program, id: `program-${program.order}` },
    })
  }
  console.log(`✅ Programs seeded: ${programs.length}`)

  // Seed Team Members
  const teamMembers = [
    {
      name: "John Success Akotia",
      title: "Chief Executive Officer (CEO)",
      category: "Leadership",
      bio: "As the founder and driving force behind Global Experience Placements, John Success Akotia leads the organization with a clear vision: to deliver high-quality placement and support services that connect students, graduates, volunteers, and professionals with impactful opportunities across diverse sectors worldwide.",
      photo: "/images/team-ceo.jpg",
      order: 0,
    },
    {
      name: "Raymond Romeo Dravie",
      title: "Director of IT",
      category: "Technology",
      bio: "Has more than 10 years experience in ICT with a strong background in Algorithmic Designs, Data Centers, IT Infrastructure, Software Development, Network, Management and Leadership.",
      expertise: "Knowledge and experience in Networking, Programming & Databases: C++, PHP, CSS, JavaScript, VB.NET, Java, MySQL, Website Development",
      photo: "/images/team-it-director.png",
      order: 1,
    },
  ]

  for (const member of teamMembers) {
    await prisma.teamMember.upsert({
      where: { id: `team-${member.order}` },
      update: {},
      create: { ...member, id: `team-${member.order}` },
    })
  }
  console.log(`✅ Team members seeded: ${teamMembers.length}`)

  // Seed Gallery Images
  const galleryImages = [
    { src: "/gallery/gallery-1.jpg", alt: "Volunteers making an impact in Ghana", category: "Volunteering", order: 0 },
    { src: "/gallery/gallery-2.jpg", alt: "Community outreach and engagement", category: "Community", order: 1 },
    { src: "/gallery/gallery-3.jpg", alt: "Experiencing the beauty of Ghana", category: "Experience", order: 2 },
    { src: "/gallery/gallery-4.jpg", alt: "Global Experience team in action", category: "Volunteering", order: 3 },
    { src: "/gallery/gallery-5.jpg", alt: "Connecting with local communities", category: "Community", order: 4 },
    { src: "/gallery/gallery-6.jpg", alt: "Immersive cultural experience", category: "Experience", order: 5 },
  ]

  for (const image of galleryImages) {
    await prisma.galleryImage.upsert({
      where: { id: `gallery-${image.order}` },
      update: {},
      create: { ...image, id: `gallery-${image.order}` },
    })
  }
  console.log(`✅ Gallery images seeded: ${galleryImages.length}`)

  // Seed FAQs
  const faqs = [
    { question: "How do I apply for a placement?", answer: "Simply navigate to our Contact page and fill out the application form. Select your preferred program type, indicate your availability, and our team will review your application within 48 hours. You can also email us directly at info@globalexperiencegh.org for a more personalized consultation.", order: 0 },
    { question: "What is included in the placement fee?", answer: "Our placement fee covers airport pickup and drop-off, local orientation, accommodation, feeding and welfare support, placement organization and coordination, 24/7 on-ground support, and a comprehensive pre-departure information pack. The fee varies depending on the program duration and type.", order: 1 },
    { question: "Do I need previous experience to volunteer?", answer: "While some placements require specific qualifications (such as medical or law placements), many of our volunteer opportunities welcome participants of all experience levels. We provide comprehensive training and orientation to ensure you are prepared for your role regardless of your background.", order: 2 },
    { question: "How long do placements typically last?", answer: "Placement durations vary from 2 weeks to 6 months depending on the program type. Short-term volunteer programs range from 2-8 weeks, while professional internships and placements typically run 8-24 weeks. We can also customize durations to fit your schedule.", order: 3 },
    { question: "Is it safe to volunteer in Africa?", answer: "Absolutely. Safety is our top priority. We provide 24/7 on-ground support, vetted accommodations, comprehensive travel insurance, local coordinators, and thorough safety briefings during orientation. We continuously monitor local conditions and have robust emergency protocols in place.", order: 4 },
    { question: "Can I get academic credit for my placement?", answer: "Yes, many of our programs qualify for academic credit. We work closely with universities and educational institutions worldwide to ensure our placements meet their requirements. We provide all necessary documentation, supervisor evaluations, and certificates upon completion.", order: 5 },
    { question: "What happens after I submit my application?", answer: "After submitting your application, our team reviews it within 48 hours. You will then be invited for an informal interview (via video call) to discuss your preferences and goals. Once matched with a placement, you will receive a comprehensive pre-departure pack with all the information you need.", order: 6 },
    { question: "Are there age restrictions for volunteering?", answer: "Participants must be at least 18 years old. There is no upper age limit — we welcome volunteers of all ages who are in good health and have the enthusiasm to contribute. Some specialized placements may have additional requirements which will be clearly communicated.", order: 7 },
    { question: "How are donations used?", answer: "90% of all donations go directly to our programs and community projects. This includes funding placements for students who cannot afford fees, building infrastructure like schools and water systems, purchasing medical supplies, and supporting community development initiatives. We publish annual financial reports for full transparency.", order: 8 },
    { question: "Can I bring a group or organize a team trip?", answer: "Yes, we welcome group placements! Whether it is a university group, corporate team, or friends traveling together, we can customize a program that fits your group size, interests, and schedule. Group placements often have additional benefits including discounted fees and tailored activities.", order: 9 },
  ]

  for (const faq of faqs) {
    await prisma.fAQ.upsert({
      where: { id: `faq-${faq.order}` },
      update: {},
      create: { ...faq, id: `faq-${faq.order}` },
    })
  }
  console.log(`✅ FAQs seeded: ${faqs.length}`)

  // Seed Site Settings
  const settings = [
    { key: "contact_email", value: "info@globalexperiencegh.org" },
    { key: "contact_phone", value: "+233 244 207 278" },
    { key: "contact_address", value: "Accra, Ghana" },
    { key: "social_facebook", value: "https://facebook.com/globalexperiencegh" },
    { key: "social_instagram", value: "https://instagram.com/globalexperiencegh" },
    { key: "social_twitter", value: "https://twitter.com/globalexperiencegh" },
    { key: "social_linkedin", value: "https://linkedin.com/company/globalexperiencegh" },
    { key: "whatsapp_number", value: "233244207278" },
  ]

  for (const setting of settings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }
  console.log(`✅ Site settings seeded: ${settings.length}`)

  console.log("\n🎉 Seeding complete!")
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
