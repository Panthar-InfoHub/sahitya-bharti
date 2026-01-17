import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { Hero } from "@/components/hero"
import { BranchesSection } from "@/components/branches-section"
import { ImageGalleryPreview } from "@/components/image-gallery-preview"
import { VideoGalleryPreview } from "@/components/video-gallery-preview"
import { DirectorIntro } from "@/components/director-intro"
import { MembershipCTA } from "@/components/membership-cta"

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero directorImage="/professional-woman-portrait.png" />
        <BranchesSection />
        <ImageGalleryPreview />
        <VideoGalleryPreview />
        <DirectorIntro directorImage="/images/director.jpg" />
        <MembershipCTA />
      </main>
      <Footer />
    </>
  )
}
