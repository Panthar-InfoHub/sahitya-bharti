import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { BranchesSection } from "@/components/branches-section"
import { ImageGalleryPreview } from "@/components/image-gallery-preview"
import { VideoGalleryPreview } from "@/components/video-gallery-preview"
import { DirectorIntro } from "@/components/director-intro"
import { MembershipCTA } from "@/components/membership-cta"

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
        <Hero directorImage="/professional-woman-portrait.png" isPremium={isPremium} />
        <BranchesSection />
        <ImageGalleryPreview />
        <VideoGalleryPreview />
        <DirectorIntro directorImage="/images/director.jpg" />
        {!isPremium && <MembershipCTA />}
      </main>
      <Footer />
    </>
  )
}
