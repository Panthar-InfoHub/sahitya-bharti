import { NextResponse } from "next/server"

export async function GET() {
  const response = await fetch(
    "https://cbpznbckfrolcsspjzwl.supabase.co/storage/v1/object/public/avatars/341ae4eb-3029-4df0-848d-cdbea090a630-0.34456355246927217.jpg"
  )

  const image = await response.arrayBuffer()

  return new NextResponse(image, {
    headers: {
      "Content-Type": "image/jpeg",
    },
  })
}