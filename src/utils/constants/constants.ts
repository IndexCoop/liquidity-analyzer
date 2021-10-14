import { constants } from 'ethers'
import { BigNumber } from '@ethersproject/bignumber'

const { AddressZero, MaxUint256, One, Two, Zero } = constants

export const ADDRESS_ZERO = AddressZero
export const ETH_ADDRESS = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE'
export const EMPTY_BYTES = '0x'
export const ZERO_BYTES =
  '0x0000000000000000000000000000000000000000000000000000000000000000'
export const MAX_UINT_256 = MaxUint256
export const MAX_UINT_96 = BigNumber.from(2).pow(96).sub(1)
export const ONE = One
export const TWO = Two
export const THREE = BigNumber.from(3)
export const FOUR = BigNumber.from(4)
export const ZERO = Zero
export const MAX_INT_256 =
  '0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff'
export const MIN_INT_256 =
  '-0x8000000000000000000000000000000000000000000000000000000000000000'
export const ONE_DAY_IN_SECONDS = BigNumber.from(60 * 60 * 24)
export const ONE_HOUR_IN_SECONDS = BigNumber.from(60 * 60)
export const ONE_YEAR_IN_SECONDS = BigNumber.from(31557600)

export const PRECISE_UNIT = constants.WeiPerEther
export const GENERAL_INDEX_MODULE = '0xb58E207da98986f9A13D0109b06C9E8d4fc19284'
export const DPI_SINGLE_INDEX_MODULE =
  '0x25100726b25a6ddb8f8e68988272e1883733966e'

export const TEN_POW_18 = BigNumber.from(10).pow(18)

export const ALCHEMY_API =
  'https://eth-mainnet.alchemyapi.io/v2/5j2PCDrDSbB5C6n8pnka21H3NSoUje4j' // + process.env.ALCHEMY_TOKEN;

export const CG_ETH_PRICE_URL = `https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd`
export const getCoinGeckoApi = (tokenAddress: string) => {
  return `https://api.coingecko.com/api/v3/simple/token_price/ethereum?contract_addresses=${tokenAddress}&vs_currencies=usd`
}
