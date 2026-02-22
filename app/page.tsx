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
import { MembershipCTA } from "@/components/membership-cta"
import { UpcomingEventPopup } from "@/components/upcoming-event-popup"
import { BackgroundMusic } from "@/components/background-music"
import { AnnualEvents } from "@/components/annual-events"

import { createClient } from "@/lib/supabase/server"

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let isPremium = false
  if (user) {
    const { data: profile } = await supabase.from('users').select('plan').eq('id', user.id).single()
    isPremium = profile?.plan === 'premium'
  }

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero Section */}
        <section id="home">
          <OrganizationHero />
        </section>

        {/* 2. Director Profile */}
        <DirectorProfile />

        {/* 3. Trustees Section */}
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
    </>
  )
}
