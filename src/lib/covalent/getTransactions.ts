/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/naming-convention */
import axios from "axios";

// import { covalentInstance } from ".";
import _ from "lodash";
import { errorHandler } from "../../utils/errorHandler";
// import { INFT } from "../../utils/Firestore/nft/addNfts";
import { getContract } from "../../utils/Firestore/contrat/getContract";
import { updateContract } from "../../utils/Firestore/contrat/updateContract";
import { getOpenseaContract } from "../opensea";

async function mapResponseBody(address: any, rawData: any) {
  const collectionsArray: ICollection[] = await Promise.all(
    rawData.map(async (element: any) => {
      const date = new Date(element.block_signed_at);

      let month = date.getMonth() + 1;
      let day = date.getDate();

      month = month < 10 ? '0' + month : month;
      day = day < 10 ? '0' + day : day;

      const tx = {
        hash: element.tx_hash,
        value: element.value,
        from: element.from_address,
        to: element.to_address,
        timeStamp: element.block_signed_at,
        confirmations: element.successful,
        blockNumber: element.block_height,
        logEvents: element.log_events,
        gasSpent: element.gas_spent,

        date: `${date.getFullYear()}-${month}-${day}`,
      };

      const contractAdress = tx.to === address ? tx.from : tx.to;

      /*
    const contract = await getContract(contractAdress);
    
    if(!contract.success) {
      const contract2 = await getOpenseaContract(1, contractAdress);
      console.log(contract2)
      if(contract2.success) {
        tx.contract = contract2.contract;
    //const updateContrat2 = updateContract(contractAdress, {ok: 1});

        
      }
    } */

      return tx;
    })
  );
  return collectionsArray;
}

function addItemCounts(long_array: any, groupByKeys: any[]) {
  const groups = _.groupBy(long_array, (obj) => {
    return groupByKeys.map((key) => obj[key]).join("-");
  });

  return _.map(groups, (g) => ({
    ...g[0],
    count: g.length,
    level: g.length,
  }));
}

export async function getTransactions(
  chain_id: any,
  accountAddress: string | undefined
): Promise<
  | { transactions: Array<any>; transactionsHeatmap: Array<any>; success: true }
  | { error: string; success: false }
> {
  if (!accountAddress) return { error: "No account address", success: false };

  const url = `https://api.covalenthq.com/v1/${chain_id}/address/${accountAddress}/transactions_v2/?key=${process.env.REACT_APP_COVALENT_KEY}`;

  try {
    const res = await axios.get(url);

    if (res.status !== 200) {
      return { error: "No nfts found", success: false };
    }

    const transactions = await mapResponseBody(
      accountAddress,
      res.data.data.items
    );
    const transactionsHeatmap = addItemCounts(transactions, ["date"]).reverse();

    return {
      transactions,
      transactionsHeatmap,
      success: true,
    };
  } catch (error: any) {
    errorHandler(error, "getTransactions");
    return {
      error: error.message,
      success: false,
    };
  }
}
