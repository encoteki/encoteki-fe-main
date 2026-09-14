import { getAddress, isAddress } from 'viem'

export function isValidEvmAddress(address: string): boolean {
  return isAddress(address)
}

export function toChecksumAddress(address: string): string {
  return getAddress(address)
}
