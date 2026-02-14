import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { OrganizationHero } from "@/components/organization-hero"
import { AboutOrganization } from "@/components/about-organization"
import { ObjectivesSection } from "@/components/objectives-section"
import { ActivitiesSection } from "@/components/activities-section"
import { DirectorProfile } from "@/components/director-profile"
import { DirectorsSection } from "@/components/directors-section"
import { UpcomingEventsPreview } from "@/components/upcoming-events-preview"
import { AchievementsSection } from "@/components/achievements-section"
import { ContactSection } from "@/components/contact-section"
import { BranchesSection } from "@/components/branches-section"
import { ImageGalleryPreview } from "@/components/image-gallery-preview"
import { VideoGalleryPreview } from "@/components/video-gallery-preview"
import { MembershipCTA } from "@/components/membership-cta"
import { UpcomingEventPopup } from "@/components/upcoming-event-popup"

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
        {/* 1. Hero Section - Organization Name, Vision, Mission, Purpose */}
        <OrganizationHero />

        {/* Leadership - Founder & Director Profile */}
        <DirectorProfile />

        {/* Directors Section - National & International Board Members */}
        <DirectorsSection />

        {/* 2. About the Organization - Establishment, Registration, Office, Work Areas */}
        <AboutOrganization />

        {/* 3. Objectives - Main organizational goals */}
        <ObjectivesSection />

        {/* 4. Key Activities - Programs and initiatives */}
        <ActivitiesSection />

        {/* 7. Upcoming Events - Next 3 upcoming events */}
        <UpcomingEventsPreview />

        {/* 8. Achievements & Recognition */}
        <AchievementsSection />

        {/* 9. Branches & Presence */}
        <BranchesSection />

        {/* 10. Gallery Previews */}
        <ImageGalleryPreview />
        <VideoGalleryPreview />

        {/* 11. Contact Section */}
        <ContactSection />

        {/* 12. Membership CTA (if not premium) */}
        {!isPremium && <MembershipCTA />}
      </main>
      <Footer />

      {/* Background Music Player */}
      <BackgroundMusic />

      {/* Upcoming Event Popup */}
      <UpcomingEventPopup />
    </>
  )
}
