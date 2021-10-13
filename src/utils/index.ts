import {Blockchain} from "@setprotocol/index-coop-contracts/dist/utils/common";
import {ethers} from "hardhat";

const provider = ethers.provider;

export const getBlockchainUtils = () => new Blockchain(provider);

export {
  createStrategyObject,
  generateReports,
  writeToOutputs,
} from "./dataOrganization";

export {createRebalanceSchedule} from "./rebalanceSchedule";

export {
  calculateNotionalInToken,
  calculateNotionalInUSD,
  calculateSetValue,
} from "./setMath";

export {getTokenDecimals} from "./tokenHelpers";

export {
  getBalancerV1Quote,
  getKyberDMMQuote,
  getSushiswapQuote,
  getUniswapV2Quote,
  getUniswapV3Quote,
} from "./paramDetermination";
