import { BaseService } from './base-service'
import type { 
  UserAddress, 
  CreateAddressData, 
  UpdateAddressData 
} from '@/types/address'
import type { ApiResponse } from '@/types/api'

class AddressService extends BaseService {
  private static instance: AddressService

  private constructor() {
    super()
  }

  public static getInstance(): AddressService {
    if (!AddressService.instance) {
      AddressService.instance = new AddressService()
    }
    return AddressService.instance
  }

  public async getAddresses(): Promise<UserAddress[]> {
    const response = await this.get<ApiResponse<UserAddress[]>>('/user/addresses')
    return response.data
  }

  public async getAddress(id: number): Promise<UserAddress> {
    const response = await this.get<ApiResponse<UserAddress>>(`/user/addresses/${id}`)
    return response.data
  }

  public async createAddress(data: CreateAddressData): Promise<UserAddress> {
    const response = await this.post<ApiResponse<UserAddress>>('/user/addresses', data)
    return response.data
  }

  public async updateAddress(id: number, data: UpdateAddressData): Promise<UserAddress> {
    const response = await this.put<ApiResponse<UserAddress>>(`/user/addresses/${id}`, data)
    return response.data
  }

  public async deleteAddress(id: number): Promise<void> {
    await this.delete(`/user/addresses/${id}`)
  }

  public async setDefaultAddress(id: number): Promise<UserAddress> {
    const response = await this.post<ApiResponse<UserAddress>>(`/user/addresses/${id}/set-default`)
    return response.data
  }

  public async getDefaultAddress(): Promise<UserAddress | null> {
    try {
      const response = await this.get<ApiResponse<UserAddress>>('/user/addresses/default')
      return response.data
    } catch (error) {
      return null
    }
  }
}

export const addressService = AddressService.getInstance()