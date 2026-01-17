export interface State {
  id: string
  code: string
  nameHi: string
  nameEn: string
  cities: City[]
}

export interface City {
  id: string
  nameHi: string
  nameEn: string
  stateId: string
}
