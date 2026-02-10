import Image from "next/image"
import { Mail, Phone, Linkedin } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

interface Director {
  id: string
  name: string
  name_hindi: string | null
  title: string
  title_hindi: string | null
  photo_url: string | null
  bio: string | null
  bio_hindi: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
}

interface DirectorCardProps {
  director: Director
}

export function DirectorCard({ director }: DirectorCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 group">
      <CardContent className="p-0">
        {/* Photo */}
        <div className="relative h-64 bg-gradient-to-br from-orange-100 to-amber-100 overflow-hidden">
          {director.photo_url ? (
            <Image
              src={director.photo_url}
              alt={director.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="w-24 h-24 rounded-full bg-orange-200 flex items-center justify-center">
                <span className="text-4xl font-bold text-orange-600">
                  {director.name.charAt(0)}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-6 space-y-3">
          {/* Name */}
          <div>
            <h3 className="text-xl font-bold text-foreground">
              {director.name}
            </h3>
            {director.name_hindi && (
              <p className="text-lg text-muted-foreground">
                {director.name_hindi}
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <p className="text-sm font-medium text-primary">
              {director.title}
            </p>
            {director.title_hindi && (
              <p className="text-sm text-muted-foreground">
                {director.title_hindi}
              </p>
            )}
          </div>

          {/* Bio */}
          {(director.bio || director.bio_hindi) && (
            <div className="text-sm text-muted-foreground line-clamp-3">
              {director.bio_hindi || director.bio}
            </div>
          )}

          {/* Contact Icons */}
          <div className="flex gap-3 pt-2">
            {director.email && (
              <a
                href={`mailto:${director.email}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Email"
              >
                <Mail className="h-5 w-5" />
              </a>
            )}
            {director.phone && (
              <a
                href={`tel:${director.phone}`}
                className="text-muted-foreground hover:text-primary transition-colors"
                title="Phone"
              >
                <Phone className="h-5 w-5" />
              </a>
            )}
            {director.linkedin_url && (
              <a
                href={director.linkedin_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
                title="LinkedIn"
              >
                <Linkedin className="h-5 w-5" />
              </a>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
