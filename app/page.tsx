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
import { FileText, ExternalLink } from "lucide-react"

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

        {/* Constitution PDF Link */}
        <section className="py-12 bg-orange-50/50 border-y border-orange-100">
          <div className="container mx-auto px-4 max-w-4xl text-center">
             <div className="bg-white rounded-2xl shadow-md border border-orange-100 p-8 flex flex-col items-center justify-center transform hover:scale-[1.01] transition-transform duration-300">
                <div className="bg-orange-100 p-4 rounded-full mb-4">
                   <FileText className="h-10 w-10 text-orange-600" />
                </div>
                <h2 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 font-serif">
                   साहित्य भारती का संविधान
                </h2>
                <p className="text-muted-foreground mb-6 max-w-2xl text-center">
                   हिन्दी साहित्य भारती के नियमों, उद्देश्यों, और संरचना को विस्तार से जानने के लिए आधिकारिक संविधान पढ़ें।
                </p>
                <a 
                   href="https://cbpznbckfrolcsspjzwl.supabase.co/storage/v1/object/public/avatars/constitution.pdf#toolbar=0&navpanes=0" 
                   target="_blank" 
                   rel="noopener noreferrer"
                   className="inline-flex items-center justify-center rounded-full bg-gradient-to-r from-orange-600 to-red-600 px-8 py-3 text-sm font-medium text-white shadow transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-orange-600 focus:ring-offset-2 w-full sm:w-auto"
                >
                   संविधान पढ़ें 
                   <ExternalLink className="ml-2 h-4 w-4" />
                </a>
             </div>
          </div>
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
