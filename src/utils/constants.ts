import {constants} from "ethers";
import {BigNumber} from "@ethersproject/bignumber";

const {AddressZero, MaxUint256, One, Two, Zero} = constants;

export const ADDRESS_ZERO = AddressZero;
export const ETH_ADDRESS = "0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE";
export const EMPTY_BYTES = "0x";
export const ZERO_BYTES =
  "0x0000000000000000000000000000000000000000000000000000000000000000";
export const MAX_UINT_256 = MaxUint256;
export const MAX_UINT_96 = BigNumber.from(2).pow(96).sub(1);
export const ONE = One;
export const TWO = Two;
export const THREE = BigNumber.from(3);
export const FOUR = BigNumber.from(4);
export const ZERO = Zero;
export const MAX_INT_256 =
  "0x7fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff";
export const MIN_INT_256 =
  "-0x8000000000000000000000000000000000000000000000000000000000000000";
export const ONE_DAY_IN_SECONDS = BigNumber.from(60 * 60 * 24);
export const ONE_HOUR_IN_SECONDS = BigNumber.from(60 * 60);
export const ONE_YEAR_IN_SECONDS = BigNumber.from(31557600);

export const PRECISE_UNIT = constants.WeiPerEther;
export const GENERAL_INDEX_MODULE =
  "0xb58E207da98986f9A13D0109b06C9E8d4fc19284";
export const DPI_SINGLE_INDEX_MODULE =
  "0x25100726b25a6ddb8f8e68988272e1883733966e";
export const BTC_ADDRESS = "0x2260fac5e5542a773aa44fbcfedf7c193bc2c599";
export const USDC_ADDRESS = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
export const WETH_ADDRESS = "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2";
