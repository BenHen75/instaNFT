import { firestore } from "../../../Firebase";
import { errorHandler } from "../../errorHandler";

export const updateContractData = async (
  contractAddress: string | undefined,
  contractData: any
): Promise<{
  success: boolean;
  message: string;
}> => {
  if (!contractAddress) return { success: false, message: "Contract not found" };

  try {
    /*if (contractData?.username) {
      const userRef = await firestore()
        .collection("contract")
        .where("username", "==", contractData.username)
        .get();

      if (!userRef?.empty) {
        return {
          success: false,
          message: "Username already exists",
        };
      }
    }*/

    const userRef = firestore().doc(`contract/${contractAddress}`);
    await userRef.update(contractData);
    return {
      success: true,
      message: "Contract data updated successfully",
    };
  } catch (error: any) {
    errorHandler(error, "updateContractData");
    return {
      success: false,
      message: error?.message,
    };
  }
};
