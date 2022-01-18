/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/naming-convention */
import { etherscanInstance } from "./index2";
import { errorHandler } from "../../utils/errorHandler";
import { Transactions } from "../../utils/Firestore/nft/addNfts";
// import { generatePinataLink } from "../../utils/generatePinataLink";

export async function getEtherscanTransactions(
  accountAddress: string | undefined
): Promise<
  | { nfts: Array<Transactions>; success: true }
  | { error: string; success: false }
> {
  if (!accountAddress) return { error: "No account address", success: false };

  const url = `action=txlist&address=${accountAddress}&sort=desc`;
  try {
    const res = await etherscanInstance.get(url);

    const { status, result } = res as any;
    if (status >= 200 && status < 300) {
      /* const nfts = result.json().map((nft: any) => {
        const { token_id, name, description, asset_url, contract_address } = nft;
        delete nft.asset_url;
        delete nft.contract_address;
        delete nft.token_id;
        return {
          tokenId: token_id,
          assetUrl: generatePinataLink(asset_url),
          likes: 0,
          name: name?.toLowerCase(),
          description,
          tokenAddress: contract_address?.toLowerCase(),
          ownedBy: accountAddress,
          owner,
          chain,
          createdAt: new Date().toISOString(),
          metadata: {
            ...nft,
          },
        };
      }); */
      return {
        nfts: result.json(),
        success: true,
      };
    }
    // console.log("Error has been occurred " + status);

    return { error: "No nfts found", success: false };
  } catch (error: any) {
    errorHandler(error, "getNfts nftport -> line 47");
    return {
      error: error.message,
      success: false,
    };
  }
}
