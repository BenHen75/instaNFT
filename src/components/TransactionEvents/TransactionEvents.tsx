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
// import { removeDuplicates } from "../../utils/removeDuplicates";
// import { BiUserCheck, BiUserPlus } from "react-icons/bi";

export function TransactionEvents({
  log_events
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

  /*useEffect(() => {
    const fetchtransactions = async () => {
      // hh
    };

    fetchtransactions();
  }, [log_events]);*/


  function getEvents() {    
    return log_events.reverse().map((log_event, i) => {

      if (log_event.decoded?.name === "Transfer") {

        return (<Flex>
        <Avatar
            onClick={() => {}}
            name={log_event.sender_name || ""}
            src={log_event.sender_logo_url}
            loading="lazy"
          />
          {log_event.sender_contract_ticker_symbol}
        </Flex>)
      }
      else if (log_event.decoded?.name === "Swap") {

        return (<Flex>
        Swap
        </Flex>)
      }
      else if (log_event.decoded?.name === "Sync") {

        return (<Flex>
        Sync
        </Flex>)
      }
      else if (log_event.decoded?.name === "Approval") {

        return (<Flex>
        Approval
        </Flex>)
      }
      else if (log_event.decoded?.name === "Claim" || log_event.decoded?.name === "Claimed" || log_event.decoded?.name === "ClaimedERC721") {

        return (<Flex>
        Claim
        </Flex>)
      }
      else {

        return (<Flex>
        {log_event.decoded?.name}
        </Flex>)
      };
    });
  }

  //const transfert = getEvents(log_events);

  //console.log(getEvents)
  //console.log(transfert)

 


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
      {getEvents()}
    </Flex>
  );
}
