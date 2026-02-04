
"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload, Calendar, MapPin, ArrowRight, FileText } from "lucide-react"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface ProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onOpenMembership: () => void
  user: any
}

export function ProfileModal({ open, onOpenChange, onOpenMembership, user }: ProfileModalProps) {
  const router = useRouter()
  const [currentUser, setCurrentUser] = useState<any>(user)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
  })
  const [uploading, setUploading] = useState(false)
  const [userEvents, setUserEvents] = useState<any[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)

  useEffect(() => {
    if (user) {
        setCurrentUser(user)
        setFormData({
            full_name: user?.full_name || "",
            email: user?.email || "",
            phone_number: user?.phone_number || "",
            address: user?.address || "",
        })
        fetchUserEvents(user.id)
    }
  }, [user, open])

  const fetchUserEvents = async (userId: string) => {
    try {
        const supabase = createClient()
        // Assuming relationship is set up, otherwise we might need two queries or a join
        // For now, let's try to fetch participants and join events
        // Note: Supabase JS client handles joins if foreign keys exist
        const { data, error } = await supabase
            .from('event_participants')
            .select(`
                *,
                events:event_id (*)
            `)
            .eq('user_id', userId)
            .order('joined_at', { ascending: false })

        if (error) throw error
        setUserEvents(data || [])
    } catch (e) {
        console.error("Error fetching events:", e)
        // Check if table exists error? Ignore for now
    } finally {
        setLoadingEvents(false)
    }
  }
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true)
      if (!e.target.files || e.target.files.length === 0) {
        throw new Error("You must select an image to upload.")
      }

      const file = e.target.files[0]
      const fileExt = file.name.split(".").pop()
      const filePath = `${currentUser.id}-${Math.random()}.${fileExt}`
      const supabase = createClient()

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

      if (uploadError) {
        throw uploadError
      }

      const { data: { publicUrl } } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

      const { error: updateError } = await supabase
        .from("users")
        .update({ avatar_url: publicUrl })
        .eq("id", currentUser.id)

      if (updateError) {
        throw updateError
      }

      setCurrentUser({ ...currentUser, avatar_url: publicUrl })
      toast.success("Profile image updated successfully")
      router.refresh()
    } catch (error: any) {
        toast.error(error.message || "Error uploading image")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const supabase = createClient()
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name,
          phone_number: formData.phone_number,
          address: formData.address,
        })
        .eq("id", currentUser.id)

      if (error) throw error
      toast.success("Profile updated successfully")
      router.refresh()
      onOpenChange(false)
    } catch (error: any) {
      toast.error(error.message || "Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">प्रोफाइल (Profile)</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">
            {/* Left Column: Personal Info & Membership */}
            <div className="md:col-span-1 space-y-6">
                
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
                    <AvatarImage src={currentUser?.avatar_url} />
                    <AvatarFallback className="text-3xl">{currentUser?.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="relative cursor-pointer w-full" disabled={uploading}>
                            {uploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                            तस्वीर बदलें
                            <input
                                type="file"
                                className="absolute inset-0 cursor-pointer opacity-0"
                                onChange={handleImageUpload}
                                accept="image/*"
                                disabled={uploading}
                            />
                        </Button>
                    </div>
                </div>

                {/* Membership Plan Section */}
                <div className={`p-4 rounded-xl border w-full text-center shadow-sm ${
                    currentUser?.plan === 'premium' ? 'bg-gradient-to-br from-yellow-50 to-amber-100 border-yellow-200' : 
                    'bg-gray-50 border-gray-100'
                }`}>
                    {currentUser?.plan === 'premium' ? (
                        <>
                            <p className="text-sm font-medium text-muted-foreground mb-1 uppercase tracking-wider">वर्तमान सदस्यता (Current Membership)</p>
                            <p className="text-xl font-bold capitalize mb-3 text-yellow-800">
                                प्रीमियम योजना (Premium Plan)
                            </p>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                asChild 
                                className="w-full border-yellow-300 text-yellow-800 hover:bg-yellow-100 hover:text-yellow-900"
                            >
                                <Link href="/certificate" target="_blank">
                                    <FileText className="mr-2 h-4 w-4" />
                                    सर्टिफिकेट डाउनलोड करें (Certificate)
                                </Link>
                            </Button>
                        </>
                    ) : (
                        <Button 
                            className="w-full bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700 text-white border-0 shadow-md"
                            onClick={onOpenMembership}
                        >
                            प्रीमियम सदस्यता लें (Upgrade to Premium) - ₹1000
                        </Button>
                    )}
                </div>
            </div>

            {/* Middle Column: Edit Profile Form */}
            <form onSubmit={handleSubmit} className="md:col-span-1 space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4">व्यक्तिगत विवरण</h3>
                <div className="space-y-2">
                    <Label htmlFor="email">ईमेल (Email)</Label>
                    <Input id="email" name="email" value={formData.email} disabled className="bg-muted" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="full_name">पूरा नाम (Full Name)</Label>
                    <Input id="full_name" name="full_name" value={formData.full_name} onChange={handleChange} placeholder="अपना नाम दर्ज करें" />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="phone_number">फोन नंबर (Phone Number)</Label>
                    <Input id="phone_number" name="phone_number" value={formData.phone_number} onChange={handleChange} placeholder="+91..." />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="address">पता (Address)</Label>
                    <Input id="address" name="address" value={formData.address} onChange={handleChange} placeholder="अपना पता दर्ज करें" />
                </div>
                <div className="pt-4">
                    <Button type="submit" disabled={saving} className="w-full">
                        {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        परिवर्तन संचित करें (Save Changes)
                    </Button>
                </div>
            </form>

            {/* Right Column: Events */}
            <div className="md:col-span-1 border-l pl-0 md:pl-8 pt-8 md:pt-0">
                <h3 className="font-semibold text-lg border-b pb-2 mb-4 flex items-center justify-between">
                    <span>मेरे कार्यक्रम (My Events)</span>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </h3>
                
                <div className="space-y-4">
                    {loadingEvents ? (
                        <div className="flex justify-center py-8"><Loader2 className="animate-spin h-6 w-6 text-muted-foreground" /></div>
                    ) : userEvents.length > 0 ? (
                        <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2">
                            {userEvents.map((item) => (
                                <div key={item.id} className="bg-muted/30 border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                                    <h4 className="font-semibold text-sm line-clamp-1">{item.events?.title || "Unknown Event"}</h4>
                                    <div className="flex items-center text-xs text-muted-foreground mt-2 gap-2">
                                        <Calendar className="h-3 w-3" />
                                        <span>{new Date(item.events?.date).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex items-center text-xs text-muted-foreground mt-1 gap-2">
                                        <MapPin className="h-3 w-3" />
                                        <span className="line-clamp-1">{item.events?.location}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-8 space-y-3 bg-muted/20 rounded-lg p-4">
                            <div className="bg-muted rounded-full w-12 h-12 flex items-center justify-center mx-auto">
                                <Calendar className="h-6 w-6 text-muted-foreground opacity-50" />
                            </div>
                            <p className="text-sm text-muted-foreground">आपने किसी भी कार्यक्रम में पंजीकरण नहीं कराया है।</p>
                            <Button variant="outline" size="sm" asChild className="w-full">
                                <Link href="/events" onClick={() => onOpenChange(false)}>
                                    आगामी कार्यक्रमों के लिए पंजीकरण करें <ArrowRight className="ml-1 h-3 w-3" />
                                </Link>
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
