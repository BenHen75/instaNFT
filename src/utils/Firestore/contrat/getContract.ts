// import { IUser } from "../../context/Auth/Auth";
import { firestore } from "../../../Firebase";
import { errorHandler } from "../../errorHandler";

export const getContract = async (
  contractAddress?: string
): Promise<
  | {
      success: true;
      contract: any;
    }
  | {
      success: false;
      error: string;
    }
> => {
  if (!contractAddress) return { success: false, error: "No user id provided" };
  try {
    const snapshot = await firestore().collection("contract").doc(contractAddress).get();
    if (snapshot.exists) {
      return {
        success: true,
        contract: { address: snapshot.id, ...snapshot.data() } as IUser,
      };
    }
    return { success: false, error: "User not found" };
  } catch (error: any) {
    errorHandler(error, "getUser.ts -> line 26");
    return {
      success: false,
      error: error.message,
    };
  }
};
