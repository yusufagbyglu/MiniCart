export type AddressType = "shipping" | "billing"

export interface UserAddress {
  id: number
  user_id: number
  address_type: AddressType
  full_name: string
  address_line1: string
  address_line2: string | null
  city: string
  state: string | null
  country: string
  postal_code: string
  phone: string | null
  is_default: boolean
  created_at: string
  updated_at: string
}

export interface CreateAddressData {
  address_type: AddressType
  full_name: string
  address_line1: string
  address_line2?: string
  city: string
  state?: string
  country: string
  postal_code: string
  phone?: string
  is_default?: boolean
}

export interface UpdateAddressData extends Partial<CreateAddressData> {}
