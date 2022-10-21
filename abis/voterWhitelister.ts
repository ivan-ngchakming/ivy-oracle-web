import { AbiItem } from "web3-utils";
import { CHAIN } from "../lib/constants";

export const addresses = {
  songbird: "0xa76906EfBA6dFAe155FfC4c0eb36cDF0A28ae24D",
  flare: "0x0F45493e4C321b238e1fA242692BFFf3f30fBdfD",
};

export const address = addresses[CHAIN];

export default [
  {
    type: "constructor",
    stateMutability: "nonpayable",
    inputs: [
      { type: "address", name: "_governance", internalType: "address" },
      {
        type: "address",
        name: "_priceSubmitter",
        internalType: "contract IIPriceSubmitter",
      },
      {
        type: "uint256",
        name: "_defaultMaxVotersForFtso",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "event",
    name: "GovernanceProposed",
    inputs: [
      {
        type: "address",
        name: "proposedGovernance",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "GovernanceUpdated",
    inputs: [
      {
        type: "address",
        name: "oldGovernance",
        internalType: "address",
        indexed: false,
      },
      {
        type: "address",
        name: "newGoveranance",
        internalType: "address",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VoterRemovedFromWhitelist",
    inputs: [
      {
        type: "address",
        name: "voter",
        internalType: "address",
        indexed: false,
      },
      {
        type: "uint256",
        name: "ftsoIndex",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "event",
    name: "VoterWhitelisted",
    inputs: [
      {
        type: "address",
        name: "voter",
        internalType: "address",
        indexed: false,
      },
      {
        type: "uint256",
        name: "ftsoIndex",
        internalType: "uint256",
        indexed: false,
      },
    ],
    anonymous: false,
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "addFtso",
    inputs: [{ type: "uint256", name: "_ftsoIndex", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "claimGovernance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "defaultMaxVotersForFtso",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "ftsoManager",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IFtsoRegistry" },
    ],
    name: "ftsoRegistry",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address[]", name: "", internalType: "address[]" }],
    name: "getFtsoWhitelistedPriceProviders",
    inputs: [{ type: "uint256", name: "_ftsoIndex", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address[]", name: "", internalType: "address[]" }],
    name: "getFtsoWhitelistedPriceProvidersBySymbol",
    inputs: [{ type: "string", name: "_symbol", internalType: "string" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "governance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "initialise",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "uint256", name: "", internalType: "uint256" }],
    name: "maxVotersForFtso",
    inputs: [{ type: "uint256", name: "", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [
      { type: "address", name: "", internalType: "contract IIPriceSubmitter" },
    ],
    name: "priceSubmitter",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "proposeGovernance",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "view",
    outputs: [{ type: "address", name: "", internalType: "address" }],
    name: "proposedGovernance",
    inputs: [],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "removeFtso",
    inputs: [{ type: "uint256", name: "_ftsoIndex", internalType: "uint256" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "removeTrustedAddressFromWhitelist",
    inputs: [
      { type: "address", name: "_trustedAddress", internalType: "address" },
      { type: "uint256", name: "_ftsoIndex", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [
      {
        type: "uint256[]",
        name: "_supportedIndices",
        internalType: "uint256[]",
      },
      { type: "bool[]", name: "_success", internalType: "bool[]" },
    ],
    name: "requestFullVoterWhitelisting",
    inputs: [{ type: "address", name: "_voter", internalType: "address" }],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "requestWhitelistingVoter",
    inputs: [
      { type: "address", name: "_voter", internalType: "address" },
      { type: "uint256", name: "_ftsoIndex", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setContractAddresses",
    inputs: [
      {
        type: "address",
        name: "_ftsoRegistry",
        internalType: "contract IFtsoRegistry",
      },
      { type: "address", name: "_ftsoManager", internalType: "address" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setDefaultMaxVotersForFtso",
    inputs: [
      {
        type: "uint256",
        name: "_defaultMaxVotersForFtso",
        internalType: "uint256",
      },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "setMaxVotersForFtso",
    inputs: [
      { type: "uint256", name: "_ftsoIndex", internalType: "uint256" },
      { type: "uint256", name: "_newMaxVoters", internalType: "uint256" },
    ],
  },
  {
    type: "function",
    stateMutability: "nonpayable",
    outputs: [],
    name: "transferGovernance",
    inputs: [{ type: "address", name: "_governance", internalType: "address" }],
  },
] as AbiItem[];
