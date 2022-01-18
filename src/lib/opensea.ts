/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";

// import { covalentInstance } from ".";
import { errorHandler } from "../utils/errorHandler";
// import { INFT } from "../../utils/Firestore/nft/addNfts";

export async function getOpenseaContract(
  chain_id: any,
  contractAddress: string | undefined
): Promise<
  { contract: any; success: true } | { error: string; success: false }
> {
  if (!contractAddress) return { error: "No account address", success: false };

  const networkPrefix = chain_id === 1 ? '' : `${chain_id}-`;

  const url = `https://${networkPrefix}api.opensea.io/api/v1/asset_contract/${contractAddress}/?key=`+process.env.REACT_APP_COVALENT_KEY;

  try {
    const res = await axios.get(url, {
      headers: {
        'Accept': 'application/json',
       // 'X-Api-Key': process.env.REACT_APP_OPENSEA_KEY,
      },
      params: {
        //limit: UNIQUE_TOKENS_LIMIT_PER_PAGE,
        //offset: offset,
        //owner: address,
      },
      timeout: 10000,
    });

    console.log(res)

    if (res.status != 200) {
      return { error: "No contract found", success: false };
    }
    
    const contract = res.data;

    return {
      contract,
      success: true,
    };
  } catch (error: any) {
    errorHandler(error, "getOpenseaContract contract -> line 47");
    return {
      error: error.message,
      success: false,
    };
  }
}
