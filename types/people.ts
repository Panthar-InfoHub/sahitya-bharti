export interface Position {
  id: string
  positionHi: string
  positionEn: string
  order: number
}

export interface Person {
  id: string
  nameHi: string
  nameEn: string
  positionId: string
  email: string
  phone: string
  imageUrl: string
  city: string
  state: string
}
