import {
  Avatar,
  Button,
  Flex,
  Stack,
  Text,
  useToast,
  Box,
  Badge,
  chakra,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { FiUserPlus } from "react-icons/fi";
import { HiOutlineThumbUp, HiThumbUp } from "react-icons/hi";
import { RiShareForwardLine } from "react-icons/ri";
// import { useNavigate } from "react-router";
import useAuth from "../../context/Auth/Auth";
import { auth, firestore } from "../../Firebase";
// import { formatFullName, makeUsernameFromEmail } from "../../utils/formatName";
import { timeAgo } from "../../utils/timeAgo";

import { TransactionEvents } from "..";
// import { removeDuplicates } from "../../utils/removeDuplicates";
// import { BiUserCheck, BiUserPlus } from "react-icons/bi";

const Web3Utils = require("web3-utils");

export function Transaction({
  user,
  blockNumber,
  confirmations,
  date,
  from,
  hash,
  timeStamp,
  to,
  value,
  contract,
  gasSpent,
  logEvents,
}) {
  const toast = useToast();
  // const { authState, authDispatch } = useAuth();
  // const alreadyLiked = likes.includes(authState?.user?.uid);
  // const navigate = useNavigate();
  const [follow, setFollow] = useState(false);
  // const [like, setLike] = useState(alreadyLiked);
  // useEffect(() => {
  // const alreadyFollowed = authState?.user?.following?.includes(user?.uid);
  // setFollow(alreadyFollowed);
  // }, [authState]);

  const amount = web3.fromWei(value, "ether");

  function getEvents(log_events: any) {
    /* Store only what is necessary from the server response */
    console.log(log_events);

    return log_events.map((log_event, i) => {
      if (log_event.decoded?.name === "Transfer") {
        return {
          symbol: log_event.sender_contract_ticker_symbol,
          name: log_event.sender_name,
          logo: log_event.sender_logo_url,
        };
      }
    });
  }

  // const transfert = getEvents(log_events);

  // console.log(log_events)
  // console.log(transfert)

  const transfert = logEvents
    .filter(function (e) {
      return e.decoded?.name === "Transfer";
    })
    .map((log_event, i) => {
      return {
        symbol: log_event.sender_contract_ticker_symbol,
        name: log_event.sender_name,
        logo: log_event.sender_logo_url,
      };
    });
  // console.log(transfert);


  // if(logEvents.length === 0 && "0x24Fe69fF072606034757D886AA7E37Ae9c032C15" === "to") action = "stake or send";

  function listEvents() {
    return logEvents.map((log_event, i) => {
      let value = null;
      let logo = null;
      let action = null;
      let tokenId = null;

      const topicTransfer = log_event.raw_log_topics[3];

      // if(topicTransfer) tokenId = Web3.Utils.hexToNumber(topicTransfer)

      if (topicTransfer) {
        // console.log(topicTransfer.substring(0, 26));

        /* if(
        topicTransfer.substring(0, 26)==="0x000000000000000000000000" 
        && Web3Utils.checkAddressChecksum(topicTransfer.slice(26))
        ) tokenId = topicTransfer.slice(26)

        
      else */ tokenId = parseInt(topicTransfer, 16);

        console.log(topicTransfer, topicTransfer);
      }

      if (log_event.decoded?.name === "Transfer") {
        log_event.decoded?.params.map((param, i) => {
          if (param.name === "value" || param.name === "value") {
            value = web3.fromWei(param.value, "ether");
          } else if (param.name === "from") {
            if (param.value === "0x0000000000000000000000000000000000000000")
              action = "mint";
            else
              action =
                param.value === "0x24fe69ff072606034757d886aa7e37ae9c032c15"
                  ? "send"
                  : "receive";
          } else if (
            param.name === "_totalTokensSent" ||
            param.name === "_totalTokensSent"
          ) {
            // value = param.value;
          } else if (param.name === "_recipientCount") {
            tokenId = param.value;
          }
        });

        /* log_event.raw_log_topics.map((topic, i) => {

        }); */

        logo = log_event.sender_logo_url;

        return (
          <Flex key={`${i}-${log_event.tx_hash}`}>
            {action} {value != 0 && value}{" "}
            {log_event.sender_contract_ticker_symbol} #{tokenId}
            <Avatar
              size="xs"
              onClick={() => {}}
              name={log_event.sender_name || ""}
              src={log_event.sender_logo_url}
              loading="lazy"
            />
          </Flex>
        );
      }
      if (log_event.decoded?.name === "Swap") {
        return <Flex key={`${i}-${log_event.tx_hash}`}>Swap</Flex>;
      }
      if (log_event.decoded?.name === "Sync") {
        return null;
      }
      if (log_event.decoded?.name === "Approval") {
        return <Flex key={`${i}-${log_event.tx_hash}`}>Approval</Flex>;
      }
      if (
        log_event.decoded?.name === "Claim" ||
        log_event.decoded?.name === "Claimed" ||
        log_event.decoded?.name === "ClaimedERC721"
      ) {
        return <Flex key={`${i}-${log_event.tx_hash}`}>Claim</Flex>;
      }
      return (
        <Flex key={`${i}-${log_event.tx_hash}`}>{log_event.decoded?.name}</Flex>
      );
    });
  }

  return (
    <Flex
      flexDir="column"
      bg="transparent"
      rounded="md"
      border="1px solid rgba(255, 255, 255, 0.125)"
      boxShadow="2xl"
      overflow="hidden"
      pos="relative"
    >
      <Box
        pos="absolute"
        top="0"
        left="0"
        w="100%"
        height="100%"
        background="radial-gradient(circle farthest-side, rgba(0,0,0,0.2), rgba(255,255,255, 0.1))"
        className="bg-blur"
        zIndex={0}
        overflow="hidden"
      />
      <Flex
        p="1.3rem 1rem"
        flexDir={{ base: "column", sm: "row" }}
        pos="relative"
        zIndex={1}
      >
        <Flex>
          <Avatar
            onClick={() => {}}
            name={contract?.name || ""}
            src={contract?.image_url}
            loading="lazy"
          />
          <Stack
            direction={{ base: "column", lg: "row" }}
            spacing={{ base: 0, lg: 4 }}
            mb={{ base: "1rem", lg: "0.3rem" }}
            justify="flex-start"
            color="gray.100"
            ml={{ base: "1rem", sm: "0" }}
            d={{ base: "flex", sm: "none" }}
          >
            <Text fontSize="md" fontWeight="400" color="white">
              {contract?.name || ""}
            </Text>
            <Text
              fontSize="0.8rem"
              fontWeight="400"
              color="gray.600"
              textTransform="none"
              as={Badge}
              rounded="full"
              px="2"
              overflow="hidden"
              pos="relative"
              bg="transparent"
              w="fit-content"
              h="20px"
            >
              <Box
                pos="absolute"
                top="0"
                left="0"
                w="100%"
                height="100%"
                background="rgba(255,255,255,0.4)"
                className="bg-blur"
                zIndex={0}
                overflow="hidden"
              />
              <Text pos="relative" zIndex={1} color="blackAlpha.700">
                dddd{contract?.symbol || ""}
              </Text>
            </Text>
          </Stack>
        </Flex>
        <Flex color="gray.100" flexDir="column" p="0 0.7rem">
          
          <Text fontSize="0.95rem" fontWeight="300" color="gray.100" />
          {listEvents()}
        </Flex>
      </Flex>
      <Flex>
        <Button
          flex={1}
          d="inline-flex"
          variant="unstyled"
          color="gray.400"
          rounded="none"
          borderRight="1px solid"
          borderColor="rgba(255, 255, 255, 0.06)"
          _hover={{ bg: "gray.700" }}
          pos="relative"
          overflow="hidden"
          className="post-btn"
          transition="all 0.2s"
        >
          <Box
            pos="absolute"
            top="0"
            left="0"
            w="100%"
            height="100%"
            background="linear-gradient(to top, rgba(0,0,0,0.15), rgba(255,255,255, 0)) 100%"
            className="bg-blur"
            zIndex={0}
            overflow="hidden"
            transition="all 0.2s"
          />
          <Text
            d="flex"
            fontSize="sm"
            color="gray.200"
            pos="relative"
            zIndex={1}
            align="center"
            justify="center"
          >
            <chakra.span d={{ base: "none", sm: "flex" }}>
              &nbsp;&nbsp; {timeAgo(timeStamp)}
            </chakra.span>
          </Text>
        </Button>
        <Button
          flex={1}
          d="inline-flex"
          variant="unstyled"
          color="blue.400"
          rounded="none"
          borderRight="1px solid"
          borderColor="rgba(255, 255, 255, 0.06)"
          _hover={{ bg: "gray.700" }}
          pos="relative"
          overflow="hidden"
          className="post-btn"
          transition="all 0.2s"
        >
          <Box
            pos="absolute"
            top="0"
            left="0"
            w="100%"
            height="100%"
            background="linear-gradient(to top, rgba(0,0,0,0.15), rgba(255,255,255, 0)) 100%"
            className="bg-blur"
            zIndex={0}
            overflow="hidden"
            transition="all 0.2s"
          />

          <Text
            d="flex"
            fontSize="sm"
            color="gray.200"
            pos="relative"
            zIndex={1}
            align="center"
            justify="center"
          >
            <chakra.span d={{ base: "none", sm: "flex" }}>
              &nbsp;&nbsp; block {blockNumber}
            </chakra.span>
          </Text>
        </Button>

        <Button
          flex={1}
          d="inline-flex"
          variant="unstyled"
          color="gray.400"
          rounded="none"
          _hover={{ bg: "gray.700" }}
          pos="relative"
          overflow="hidden"
          className="post-btn"
          transition="all 0.2s"
        >
          <Box
            pos="absolute"
            top="0"
            left="0"
            w="100%"
            height="100%"
            background="linear-gradient(to top, rgba(0,0,0,0.15), rgba(255,255,255, 0)) 100%"
            className="bg-blur"
            zIndex={0}
            overflow="hidden"
            transition="all 0.2s"
          />

          <Text
            d="flex"
            fontSize="sm"
            color="gray.200"
            pos="relative"
            zIndex={1}
            align="center"
            justify="center"
          >
            <RiShareForwardLine color="#ffffff" fontSize="1.15rem" />
            <chakra.span d={{ base: "none", sm: "flex" }}>
              &nbsp;&nbsp; {amount} eth
            </chakra.span>
          </Text>
        </Button>
      </Flex>
    </Flex>
  );
}
