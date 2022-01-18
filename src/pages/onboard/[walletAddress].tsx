import { Flex, Box, Divider, Stack, Heading, Text , Button, Center} from "@chakra-ui/layout";

import React, { useCallback, useEffect, useReducer, useState, useContext } from "react";
import router, { useRouter } from "next/router";
import { Spinner } from "@chakra-ui/spinner";
import { useToast } from "@chakra-ui/toast";
import {
  Layout,
  Transaction,
  PinnedNFT,
  ProfileTabs,
  UpperProfile,
  SidebarOnboard,
  Stepper
} from "../../components";
import useAuth, { IUser } from "../../context/Auth/Auth";
// eslint-disable-next-line max-len
import useCovalent from "../../lib/covalent";

import ActivityCalendar from "react-activity-calendar";
import ReactTooltip from "react-tooltip";

import {getTransactions} from "../../lib/covalent/getTransactions";
import {getBalances} from "../../lib/covalent/getBalances";
// import {getEventsTopics} from "../../lib/covalent/getEventsTopics";

import { AiFillEdit } from "react-icons/ai";

import { getItem } from "../../utils/localStorage/getItem";

const LIMIT = 8;

function Tribu(): JSX.Element {
  const { isLoading, isAuthenticated, user, authDispatch } = useAuth();

  const { query, isReady } = useRouter();
  const toast = useToast();
  const [userDetails, setUserDetails] = useState<IUser>();

  const [account, setAccount] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [transactionsOld, setTransactionsOld] = useState([]);
  const [transactionsHeatmap, setTransactionsHeatmap] = useState([]);


    //const context = useContext(Web3Context);

     //const walletAddress = getItem("walletAddress");



//console.log(context)
  // const [transactionsHeatmap, setTransactionsHeatmap] = useState([]);

  // const [miniLoader, setMiniLoader] = useState(false);
  // const [allNftsAreLoaded, setAllNftsAreLoaded] = useState(false);

  // eslint-disable-next-line consistent-return

  useEffect(() => {
    if (isReady) {
      const fetchTransactions = async () => {
        /*const transactions2 = await getTransactions(
          1,
          "0x24Fe69fF072606034757D886AA7E37Ae9c032C15"
        );

        await getAccount(1, "0x24Fe69fF072606034757D886AA7E37Ae9c032C15");*/

        const allEventsTopics = await getBalances(1, "0x24Fe69fF072606034757D886AA7E37Ae9c032C15");


        

console.log(allEventsTopics)



        const allTransactions = await getTransactions(1, query.walletAddress);

console.log(allTransactions.transactionsHeatmap)
        setTransactions(allTransactions.transactions);
        setTransactionsOld(allTransactions.transactions);

        setTransactionsHeatmap(allTransactions.transactionsHeatmap);
        };

      fetchTransactions();
      
    }
  }, [isReady]);

  useEffect(() => {
    const filterTransactions = async () => {
      
    };

    filterTransactions();
  }, [transactions]);

  //const currentUser = query.username !== user?.username ? userDetails : user;  

  const TransactionsTable = () => {
    return (
      <div className="transactions-data">
        {transactions?.length > 0 ? (
          transactions.map((transaction, i) => {

            return (
              <Box key={`single-post-${i}`}>
                <Transaction {...transaction} user={userDetails} />
                      <Divider
                        borderColor="rgba(255, 255, 255, 0.125)"
                        my={3}
                      />
              </Box>
            );
          })
        ) : (
          <span className="no-data">Loading data...</span>
        )}
      </div>
    );
  };

  return (
    <Layout
      title="instaNFT | Connect Wallet"
      key="connect-wallet-page"
      keywords="instanft, connect, wallet"
      description="Connect your wallet to start using instaNFT"
      expandedNav
    >
      <Flex w="full" h="full" justify="center" align="center">
        <Flex w="full" h="full" maxW="1400px">
          <SidebarOnboard />
          <Stack
            w="full"
            h="full"
            maxW="1400px"
            spacing={9}
            mt="3rem"
            mx={{
              base: 4,
              md: 10,
              lg: 16,
            }}
          >
            <Flex w="full" flexDir="column" mb="1rem">
              <Heading
                fontSize="1.8rem"
                fontWeight="bold"
                color="gray.700"
              >
                Add New Wallet
              </Heading>
              <Text color="gray.500" fontSize="sm" mt="0.4rem">
                Connect your wallet to start using instaNFT
              </Text>
              <ActivityCalendar
              theme={{
                level0: "#F0F0F0",
                level1: "#FF0000",
                level2: "#000000",
                level3: "#F73859",
                level4: "#000000",
              }}
              // weekStart={1}
              data={transactionsHeatmap}      
              labels={{
                legend: {
                  less: "Less",
                  more: "More",
                },
                months: [
                  "Jan",
                  "Feb",
                  "Mar",
                  "Apr",
                  "May",
                  "Jun",
                  "Jul",
                  "Aug",
                  "Sep",
                  "Oct",
                  "Nov",
                  "Dec",
                ],
                totalCount: "{{count}} transactions in {{year}}",
                weekdays: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
              }}
              loading={transactionsHeatmap?.length === 0}
              showWeekdayLabels
              eventHandlers={{
                onClick: event => data => {
                  const newTransactions = transactionsOld.filter(function (e) {
                    return e.date === data.date;
                  })

                  setTransactions(newTransactions);
                }
              }}
              
            >
              {transactionsHeatmap?.length > 0 && <ReactTooltip html />}
            </ActivityCalendar>



            
        {//Stepper()
        }
        {TransactionsTable()}
            </Flex>

            <Flex w="full" flexDir="column" mb="1rem">
              
              ok
            </Flex>
            <br />
            <br />
          </Stack>
        </Flex>
      </Flex>
    </Layout>
  );

}

export default Tribu;

