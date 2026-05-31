import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OrganizationHero } from "@/components/organization-hero"
import { AboutOrganization } from "@/components/about-organization"
import { ActivitiesSection } from "@/components/activities-section"
import { DirectorProfile } from "@/components/director-profile"
import { DirectorsSection } from "@/components/directors-section"
import { UpcomingEventsPreview } from "@/components/upcoming-events-preview"
import { AchievementsSection } from "@/components/achievements-section"
import { ContactSection } from "@/components/contact-section"
import { BranchesSection } from "@/components/branches-section"
import { ImageGalleryPreview } from "@/components/image-gallery-preview"
import { VideoGalleryPreview } from "@/components/video-gallery-preview"
import { TrusteesSection } from "@/components/trustees-section"
import { FoundersSection } from "@/components/founders-section"
import { MembershipCTA } from "@/components/membership-cta"
import { UpcomingEventPopup } from "@/components/upcoming-event-popup"
import { BackgroundMusic } from "@/components/background-music"
import { AnnualEvents } from "@/components/annual-events"
import { ConstitutionSection } from "@/components/constitution-section"

import { createClient } from "@/lib/supabase/server"
import { createClient as createAdminClient } from "@supabase/supabase-js"
import { DonationWidget } from "@/components/donation-widget"
import { cookies } from "next/headers"


export default async function Home() {
  const cookieStore = await cookies()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  let fullUser = null
  if (user) {
    const { data: profile } = await supabase.from('users').select('*').eq('id', user.id).single()
    isPremium = profile?.plan === 'premium'
    fullUser = { ...user, ...profile }
  }

  // Fetch total donations securely using admin client to bypass RLS
  const adminSupabase = createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || "",
    process.env.SUPABASE_SERVICE_ROLE_KEY || ""
  )
  const { data: donations } = await adminSupabase
    .from('transactions')
    .select('amount')
    .eq('plan', 'donation')
    .eq('status', 'success')
  
  const totalDonated = donations?.reduce((sum: number, tx: any) => sum + Number(tx.amount), 0) || 0

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero Section */}
        <section id="home">
          <OrganizationHero />
        </section>

        {/* Constitution PDF Link */}
        <ConstitutionSection />

        {/* 2. Director Profile */}
        <DirectorProfile/>

        {/* 3. Founders Section */}
        {/* <section id="founders">
          <FoundersSection />
        </section> */}

        {/* 4. Trustees Section */}
        <section id="trustees">
          <TrusteesSection />
        </section>

        {/* 4. About the Organization */}
        <section id="about">
          <AboutOrganization />
        </section>


        {/* 5. Directors Section */}
        <section id="directors">
          <DirectorsSection />
        </section>

        {/* 6. Activities Section */}
        <section id="activities">
          <ActivitiesSection />
        </section>

        {/* 6. Branches Section */}
        <section id="branches">
          <BranchesSection />
        </section>

        {/* 7. Annual Events Calendar */}
        <section id="annual-events">
          <AnnualEvents />
        </section>

        {/* 8. Upcoming Events */}
        <section id="events">
          <UpcomingEventsPreview />
        </section>

        {/* 8. Achievements Section */}
        <section id="achievements">
          <AchievementsSection />
        </section>

        {/* 9. Image Gallery */}
        <section id="gallery">
          <ImageGalleryPreview />
        </section>

        {/* 10. Video Gallery */}
        <section id="videos">
          <VideoGalleryPreview />
        </section>

        {/* 11. Contact Section */}
        <section id="contact">
          <ContactSection />
        </section>

        {/* 12. Membership CTA (if not premium) */}
        {!isPremium && <MembershipCTA />}
      </main>
      <Footer />


      <UpcomingEventPopup />
      <DonationWidget initialTotalDonated={totalDonated} user={fullUser} />
    </>
  )
}
