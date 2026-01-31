
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Loader2, Upload } from "lucide-react"
import { toast } from "sonner"

export default function ProfilePage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone_number: "",
    address: "",
  })
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/login")
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()

      if (profile) {
        setUser({ ...user, ...profile })
        setFormData({
            full_name: profile.full_name || "",
            email: user.email || "",
            phone_number: profile.phone_number || "",
            address: profile.address || "",
        })
      }
      setLoading(false)
    }
    getUser()
  }, [router])

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
      const filePath = `${user.id}-${Math.random()}.${fileExt}`
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
        .eq("id", user.id)

      if (updateError) {
        throw updateError
      }

      setUser({ ...user, avatar_url: publicUrl })
      toast.success("Profile image updated successfully")
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
        .eq("id", user.id)

      if (error) throw error
      toast.success("Profile updated successfully")
      router.refresh()
    } catch (error: any) {
      toast.error(error.message || "Error updating profile")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
            <CardTitle>प्रोफाइल (Profile)</CardTitle>
            <CardDescription>अपनी व्यक्तिगत जानकारी प्रबंधित करें (Manage your personal information)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Avatar Section */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-32 w-32">
              <AvatarImage src={user?.avatar_url} />
              <AvatarFallback className="text-4xl">{user?.full_name?.charAt(0) || "U"}</AvatarFallback>
            </Avatar>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="relative cursor-pointer" disabled={uploading}>
                    {uploading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <Upload className="mr-2 h-4 w-4" />
                    )}
                    तस्वीर बदलें (Change Photo)
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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">ईमेल (Email)</Label>
              <Input id="email" name="email" value={formData.email} disabled />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="full_name">पूरा नाम (Full Name)</Label>
              <Input 
                id="full_name" 
                name="full_name" 
                value={formData.full_name} 
                onChange={handleChange} 
                placeholder="अपना नाम दर्ज करें"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone_number">फोन नंबर (Phone Number)</Label>
              <Input 
                id="phone_number" 
                name="phone_number" 
                value={formData.phone_number} 
                onChange={handleChange} 
                placeholder="+91..."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">पता (Address)</Label>
              <Input 
                id="address" 
                name="address" 
                value={formData.address} 
                onChange={handleChange} 
                placeholder="अपना पता दर्ज करें"
              />
            </div>

            <Button type="submit" disabled={saving}>
              {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              परिवर्तन संचित करें (Save Changes)
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
