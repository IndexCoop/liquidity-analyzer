import {
  ContractTransaction as ContractTransactionType,
  Wallet as WalletType,
} from "ethers";
import {BigNumber} from "@ethersproject/bignumber";
import {SignerWithAddress} from "@nomiclabs/hardhat-ethers/dist/src/signer-with-address";
import {SetToken} from "../utils/contracts/setV2";

export type Account = {
  address: Address;
  wallet: SignerWithAddress;
};

export type Address = string;
export type Bytes = string;

export type ContractTransaction = ContractTransactionType;
export type Wallet = WalletType;

export type DistributionFormat = {address: string; earnings: BigNumber};

export interface ContractSettings {
  setToken: Address;
  leverageModule: Address;
  comptroller: Address;
  collateralPriceOracle: Address;
  borrowPriceOracle: Address;
  targetCollateralCToken: Address;
  targetBorrowCToken: Address;
  collateralAsset: Address;
  borrowAsset: Address;
  collateralDecimalAdjustment: BigNumber;
  borrowDecimalAdjustment: BigNumber;
}

export interface MethodologySettings {
  targetLeverageRatio: BigNumber;
  minLeverageRatio: BigNumber;
  maxLeverageRatio: BigNumber;
  recenteringSpeed: BigNumber;
  rebalanceInterval: BigNumber;
}

export interface ExecutionSettings {
  unutilizedLeveragePercentage: BigNumber;
  twapCooldownPeriod: BigNumber;
  slippageTolerance: BigNumber;
}

export interface ExchangeSettings {
  twapMaxTradeSize: BigNumber;
  exchangeLastTradeTimestamp: BigNumber;
  incentivizedTwapMaxTradeSize: BigNumber;
  leverExchangeData: Bytes;
  deleverExchangeData: Bytes;
}

export interface IncentiveSettings {
  incentivizedTwapCooldownPeriod: BigNumber;
  incentivizedSlippageTolerance: BigNumber;
  etherReward: BigNumber;
  incentivizedLeverageRatio: BigNumber;
}

export interface Indices {
  [symbol: string]: IndexInfo;
}

export interface IndexInfo {
  address: string;
  strategyInfo: StrategyInfo;
  path: string;
  calculateAssetAllocation(
    setToken: SetToken,
    strategyConstants: StrategyObject,
    setTokenValue: BigNumber
  ): Promise<RebalanceSummary[]>;
}

export interface AssetInfo {
  address: Address;
  maxTradeSize: BigNumber;
  exchange: string;
  exchangeData: string;
  coolOffPeriod: BigNumber;
  currentUnit: BigNumber;
  input: BigNumber;
}

export interface StrategyInfo {
  [symbol: string]: AssetInfo;
}

export interface Exchanges {
  [symbol: string]: string;
}

export let exchanges: Exchanges = {
  NONE: "",
  UNISWAP: "UniswapV2IndexExchangeAdapter",
  SUSHISWAP: "SushiswapIndexExchangeAdapter",
  BALANCER: "BalancerV1IndexExchangeAdapter",
  UNISWAP_V3: "UniswapV3IndexExchangeAdapter",
  KYBER: "KyberV3IndexExchangeAdapter",
};

export interface ExchangeQuote {
  exchange: string;
  size: string;
  data: string;
}

export interface AssetStrategy {
  address: Address;
  decimals: BigNumber;
  input: BigNumber;
  maxTradeSize: BigNumber;
  coolOffPeriod: BigNumber;
  exchange: string;
  exchangeData: string;
  currentUnit: BigNumber;
  price: BigNumber;
}

export interface StrategyObject {
  [symbol: string]: AssetStrategy;
}

export interface RebalanceSummary {
  asset: string;
  currentUnit: BigNumber;
  newUnit: BigNumber;
  notionalInToken: BigNumber;
  notionalInUSD: BigNumber;
  isBuy: boolean | undefined;
  exchange: string;
  exchangeData: string;
  maxTradeSize: BigNumber;
  coolOffPeriod: BigNumber;
  tradeCount: BigNumber;
}

export interface RebalanceSummaryLight {
  asset: string;
  currentUnit: BigNumber;
  newUnit: BigNumber;
  notionalInToken: BigNumber;
  notionalInUSD: BigNumber;
  isBuy: boolean | undefined;
}

export interface ParamSetting {
  components: Address[];
  values: string[];
  data: string;
}
export interface RebalanceParams {
  newComponents: Address[];
  newComponentUnits: string[];
  oldComponentUnits: string[];
  positionMultiplier: string;
  data: string;
}

export interface RebalanceReport {
  summary: RebalanceSummary[];
  maxTradeSizeParams: ParamSetting;
  exchangeParams: ParamSetting;
  exchangeDataParams: ParamSetting;
  coolOffPeriodParams: ParamSetting;
  rebalanceParams: RebalanceParams;
  tradeOrder: string;
}
