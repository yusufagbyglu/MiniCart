import api from "@/lib/axios"
import type { UserAddress, CreateAddressData, UpdateAddressData } from "@/types/address"
import type { ApiResponse } from "@/types/api"

export const AddressService = {
  async getAddresses(): Promise<UserAddress[]> {
    const response = await api.get<ApiResponse<UserAddress[]>>("/user/addresses")
    return response.data.data
  },

  async getAddress(id: number): Promise<UserAddress> {
    const response = await api.get<ApiResponse<UserAddress>>(`/user/addresses/${id}`)
    return response.data.data
  },

  async createAddress(data: CreateAddressData): Promise<UserAddress> {
    const response = await api.post<ApiResponse<UserAddress>>("/user/addresses", data)
    return response.data.data
  },

  async updateAddress(id: number, data: UpdateAddressData): Promise<UserAddress> {
    const response = await api.put<ApiResponse<UserAddress>>(`/user/addresses/${id}`, data)
    return response.data.data
  },

  async deleteAddress(id: number): Promise<void> {
    await api.delete(`/user/addresses/${id}`)
  },
}
