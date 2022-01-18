import { useState } from "react";
import axios from "axios";
import _ from "lodash";

interface Transaction {
  timeStamp: number;
  from: string;
  to: string;
  value: number;
  confirmations: number;
  hash: string;
  blockNumber: number;
  log_events: [];
}

function isEthereumAddress(address: string) {
  const regex = /^(0x)[0-9a-f]{40}$/i;
  return regex.test(address);
}

/* Etherscan API Key required to bypass call rate limit of 1/5 sec */
const API_KEY = process.env.REACT_APP_COVALENT_KEY;

function useCovalent(): [
  (chain_id: number, accountAddress: string) => void,
  Transaction[],
  Transaction[],
  (chain_id: number, accountAddress: string) => void,
  [],
  string,
  boolean
] {
  const [account, setAccount] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsHeatmap, setTransactionsHeatmap] = useState([]);
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading2, setIsLoading] = useState(false);

  function mapResponseBody(rawData: any) {
    /* Store only what is necessary from the server response */
    return rawData.map((element: any) => {
      const date = new Date(element.block_signed_at);

      let month = date.getMonth() + 1;
      let day = date.getDate();

    

      return {
        hash: element.tx_hash,
        value: element.value,
        from: element.from_address,
        to: element.to_address,
        timeStamp: element.block_signed_at,
        confirmations: element.successful,
        blockNumber: element.block_height,
        log_events: element.log_events,

        date: `${date.getFullYear()}-${month}-${day}`
      };
    });
  }

  function mapHeatmap(rawData: any) {
    /* Store only what is necessary from the server response */
    return rawData.map((element: any) => {
      const date = new Date(element.block_signed_at);

      let month = date.getMonth() + 1;
      let day = date.getDate();

      if (day < 10) {
        day = `0${day}`;
      }
      if (month < 10) {
        month = `0${month}`;
      }

      return {
        hash: element.tx_hash,
        value: element.value,
        from: element.from_address,
        to: element.to_address,
        timeStamp: element.block_signed_at,
        confirmations: element.successful,
        blockNumber: element.block_height,

        date: `${date.getFullYear()}-${month}-${day}`,
        level: 0,
      };
    });
  }

  function addItemCounts(long_array: any, groupByKeys: any[]) {
    const groups = _.groupBy(long_array, (obj) => {
      return groupByKeys.map((key) => obj[key]).join("-");
    });

    return _.map(groups, (g) => ({
      ...g[0],
      count: g.length,
      level: g.length
    }));
  }
  // console.log(addItemCounts(long_array, ["date"]));
  async function getAccount(chain_id: number, accountAddress: string) {
    if (!isEthereumAddress(accountAddress)) {
      setErrorMsg("Please enter a valid Ethereum address");
    } else {
      setAccount([]);
      setIsLoading(true);
      try {
        await axios
          .get(
            `https://api.covalenthq.com/v1/${chain_id}/address/${accountAddress}/balances_v2/?key=${API_KEY}&nft=true`
          )
          .then((res: any) => {
            if (res.status === 200) {
              console.warn(res);

              const data = mapResponseBody(res.data.data.items);

              setErrorMsg("");
              setAccount(data);
            } else if (res.data.message === "NOTOK") {
              setErrorMsg(res.data.result);
            } else {
              setErrorMsg(res.data.message);
            }
            setIsLoading(false);
          });
      } catch (error: any) {
        console.warn("Error: ", error);
        setErrorMsg(error);
        setIsLoading(false);
      }
    }
  }
  async function getTransactions2(chain_id: number, accountAddress: string) {
    if (!isEthereumAddress(accountAddress)) {
      setErrorMsg("Please enter a valid Ethereum address");
    } else {
      setTransactions([]);
      setIsLoading(true);
      try {
        await axios
          .get(
            `https://api.covalenthq.com/v1/${chain_id}/address/${accountAddress}/transactions_v2/?key=${API_KEY}`
          )
          .then((res: any) => {
            if (res.status === 200) {
              console.warn(res.data.data.items);

              const data = mapResponseBody(res.data.data.items);
              const dataHeatmap = addItemCounts(data, ["date"]);

              setErrorMsg("");
              setTransactions(data);
              setTransactionsHeatmap(dataHeatmap.reverse());
            } else if (res.data.message === "NOTOK") {
              setErrorMsg(res.data.result);
            } else {
              setErrorMsg(res.data.message);
            }
            setIsLoading(false);
          });
      } catch (error: any) {
        console.warn("Error: ", error);
        setErrorMsg(error);
        setIsLoading(false);
      }
    }
  }

  return [getTransactions2, transactions, transactionsHeatmap, getAccount, account, errorMsg, isLoading2];
}

export default useCovalent;
