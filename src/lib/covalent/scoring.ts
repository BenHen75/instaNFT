import axios from "axios";

// import { toast } from "react-toastify";
// import ENS, { getEnsAddress } from "@ensdomains/ensjs";
import Web3 from "web3";
import { ethers } from "ethers";

const SCAM_TOKENS = ["FF9.io", "🧙‍♂️WIZ🧙‍♂️"];
const GOV_TOKENS = ["ENS", "AAVE", "stkAAVE", "COMP", "CRV"];
const ZAPPER_CONTRACT = "0xf1f3ca6268f330fda08418db12171c3173ee39c9";
const ENS_CONTRACT = "0x57f1887a8bf19b14fc0df6fd9b2acc9af147ea85";
const BASE_SCORE = 500;

const AAVEGOV_URI = (address) =>
  `https://aave-api-v2.aave.com/data/governance-user-search?address=${address}`;
const COVALENT_URI = (chainId) =>
  `https://api.covalenthq.com/v1/${chainId}/address`;
const COMPOUND_URI = (address, chainId) =>
  `${COVALENT_URI(chainId)}/${address}/stacks/compound/acts/?key=${
    process.env.COVALENT_KEY
  }`;

// ###################### USER BALANCE / TOKENS #############################

async function getAllTokenBalances(address, chainId) {
  /**
   * @param {arr is the response of covalent api} arr
   * @returns take the api response and turns it into a beautiful human readable array
   */
  function transformArray(arr) {
    const newTab = [];
    for (const obj in arr) {
      newTab.push({
        token: arr[obj].contract_ticker_symbol,
        amount: Web3.utils.fromWei(arr[obj].balance),
        USD: arr[obj].quote,
      });
    }
    return newTab;
  }
  const balances = [];
  try {
    // call api
    const res = await axios.get(
      `${COVALENT_URI(chainId)}/${address}/balances_v2/?nft=false&key=${
        process.env.COVALENT_KEY
      }`
    );
    const balances = await transformArray(res.data.data.items);

    return balances;
  } catch (e) {
    console.error(e);
    // toast.error("Couldn't fetch Covalent balances. See console.");
  }
}

async function getUSDBalance(tokenList) {
  const balanceArray = tokenList;
  let result = 0;
  for (const obj in balanceArray) {
    result += balanceArray[obj].USD;
  }
  return result;
}

async function getQuantityOfTokens(tokenList) {
  const balanceArray = tokenList;
  let result = 0;
  for (const obj in balanceArray) {
    if (balanceArray[obj].amount != 0) {
      result += 1;
    }
  }
  return result;
}

async function getScamTokens(tokenList) {
  return tokenList
    .map((token) => token.token)
    .filter((t) => SCAM_TOKENS.includes(t));
}

// ###################### GOVERNANCE SCORE #############################
// Governance tokens holdings + votes
// for the hackaton, tokens = ENS + aave/stkAave + Comp + CRV

async function getGovernanceTokens(tokenList) {
  return tokenList
    .map((token) => token.token)
    .filter((t) => GOV_TOKENS.includes(t));
}

async function getAaveGovernanceVotes(address) {
  const response = await axios.get(AAVEGOV_URI(address));
  let score = 0;
  if (response.data != null) {
    score = response.data.votingHistory;
  }
  return score;
}

async function getCompInteractions(address, chainId) {
  try {
    const response = await axios.get(COMPOUND_URI(address, chainId));
    return response.data.data.items;
  } catch (e) {
    console.error(e);
    // toast.error("Error fetching Compound data. See console.");
  }
}

// ###################### ENS #############################
// export async function getEns(address) {
//   const provider = new ethers.providers.JsonRpcProvider(
//     "https://mainnet.infura.io/v3/" + process.env.INFURA_ID
//   );
//   const ens = new ENS({ provider, ensAddress: getEnsAddress("1") });
//   const name = await ens.getName(address).then(r => console.log("ens",r));
//   return name;
// }

// ###################### NFTs #############################

async function getNfts(address) {
  const options = {
    method: "GET",
    url: `https://api.nftport.xyz/v0/accounts/${address}`,
    params: { chain: "ethereum" },
    headers: {
      "Content-Type": "application/json",
      Authorization: process.env.NFTPORT_KEY,
    },
  };

  try {
    const res = await axios.request(options);
    return res.data.nfts;
  } catch (e) {
    console.log(e);
  }
}

async function getENSNfts(nfts) {
  return nfts.filter((nft) => nft.contract_address === ENS_CONTRACT);
}

async function getZapperNfts(nfts) {
  return nfts.filter((nft) => nft.contract_address === ZAPPER_CONTRACT);
}

// ###################### TOTAL SCORE #############################

async function getData(address, chainId, provider) {
  // Base Score
  const tokenList = await getAllTokenBalances(address, chainId);
  const quantityOfTOkens = await getQuantityOfTokens(tokenList);
  const usdBalance = await getUSDBalance(tokenList);
  const scamTokens = await getScamTokens(tokenList);
  const govTokens = await getGovernanceTokens(tokenList);
  const compInteractions = await getCompInteractions(address, chainId);
  const nfts = await getNfts(address);

  // Protocol Score
  const aaveVotes = await getAaveGovernanceVotes(address);

  // const ens = await getEns(address, provider);
  const ens = await getENSNfts(nfts);

  const zapperNfts = await getZapperNfts(nfts);
  console.log("ENS", ens);
  return {
    usdBalance,
    tokenList,
    quantityOfTOkens,
    scamTokens,
    govTokens,
    compInteractions,
    nfts,
    aaveVotes,
    ens,
    zapperNfts,
  };
}

async function getRawValues(address, chainId, provider) {
  const data = await getData(address, chainId, provider);
  const {
    // base
    usdBalance,
    tokenList,
    quantityOfTOkens,
    scamTokens,
    govTokens,
    compInteractions,
    nfts,
    // protocols
    aaveVotes,
    ens,
    zapperNfts,
  } = data;
  console.log(nfts);
  return {
    usd_balance: usdBalance,
    token_holdings_raw: quantityOfTOkens,
    scam_raw: scamTokens.length,
    governance_raw: govTokens.length,
    compound_interactions_raw: compInteractions.length,
    NFT_score_raw: nfts.length,
    aave_votes_raw: aaveVotes,
    ens_raw: { amount: ens.length, name: ens[0].name },
    zapperNfts_raw: zapperNfts.length,
  };
}

async function computeScoreFromRaw(rawValues) {
  let score = BASE_SCORE;
  // get scores
  let USDScore = 0;
  if (rawValues.usd_balance > 0 && rawValues.usd_balance <= 100) {
    USDScore = 10;
  } else if (rawValues.usd_balance > 100 && rawValues.usd_balance <= 1000) {
    USDScore = 20;
  } else if (rawValues.usd_balance > 1000 && rawValues.usd_balance <= 10000) {
    USDScore = 50;
  } else if (rawValues.usd_balance > 10000) {
    USDScore = 75;
  }
  const tokenHoldingsScore = rawValues.token_holdings_raw * 5;
  const scamTokenScore = rawValues.scam_raw * 10;
  const govTokenScore = rawValues.governance_raw * 10;
  const compInteractionScore = rawValues.compound_interactions_raw * 10;
  const NFTScore = rawValues.NFT_score_raw * 10;
  // TODO: check if good scoring
  const aaveGovScore = rawValues.aave_votes_raw * 10;
  const ensScore = rawValues.ens_raw ? 100 : 0;
  const zapperNftsScore = rawValues.zapperNfts_raw * 50;

  score +=
    -scamTokenScore +
    govTokenScore +
    compInteractionScore +
    NFTScore +
    USDScore +
    tokenHoldingsScore +
    aaveGovScore +
    ensScore +
    zapperNftsScore;
  return {
    total_score: score,
    usd_score: USDScore,
    token_holdings_score: tokenHoldingsScore,
    scam_score: scamTokenScore,
    governance_score: govTokenScore,
    compound_interactions: compInteractionScore,
    NFT_score: NFTScore,
    aave_votes: aaveGovScore,
    ens_score: ensScore,
    zapperNfts_score: zapperNftsScore,
  };
}

export async function computeScore(address, chainId, provider) {
  const data = await getData(address, chainId, provider);
  const rawScores = await getRawValues(address, chainId, provider);
  const scores = await computeScoreFromRaw(rawScores);
  return {
    // Base Score
    total_score: scores.total_score,
    usd: {
      value: rawScores.usd_balance.toFixed(2),
      score: scores.usd_score,
    },
    token_holdings: {
      value: rawScores.token_holdings_raw,
      score: scores.token_holdings_score,
    },
    scam: {
      value: rawScores.scam_raw,
      score: scores.scam_score,
    },
    governance: {
      value: rawScores.governance_raw,
      score: scores.governance_score,
    },
    compound: {
      value: rawScores.compound_interactions_raw,
      score: scores.compound_interactions,
    },
    nft: {
      value: rawScores.NFT_score_raw,
      score: scores.NFT_score,
    },
    // Protocol Score
    aave: {
      value: rawScores.aave_votes_raw,
      score: scores.aave_votes,
    },
    ens: {
      value: data.ens.amount,
      name: data.ens.name,
      score: scores.ens_score,
    },
    zapper: {
      value: data.zapperNfts_raw,
      score: scores.zapperNfts_score,
    },
  };
}
