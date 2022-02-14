import { Blockchain } from '@indexcoop/index-coop-smart-contracts/dist/utils/common'
import { ethers } from 'hardhat'

const provider = ethers.provider

export const getBlockchainUtils = () => new Blockchain(provider)
