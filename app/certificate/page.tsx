import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CertificateViewer } from "@/components/certificate-viewer"

export default async function CertificatePage() {
  const supabase = await createClient()

  // 1. Get User
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login")
  }

  // 2. Get Profile Data
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single()

  // 3. Check Membership Status
  const cleanPlan = (profile?.plan || '').trim()
  const { data: activePlan } = await supabase.from('membership_plans').select('*').ilike('name', cleanPlan).limit(1).maybeSingle()

  if (!profile || !activePlan) {
      return (
          <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-2">Access Denied</h1>
              <p className="text-gray-600 mb-4">यह प्रमाण पत्र केवल भुगतान किए गए सदस्यों (Paid Members) के लिए उपलब्ध है।</p>
              <Link href="/">
                <Button>Go Home</Button>
              </Link>
          </div>
      )
  }

  return (
    <CertificateViewer profile={profile} activePlan={activePlan} />
  )
}
