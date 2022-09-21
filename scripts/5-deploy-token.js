import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const tokenAddress = await sdk.deployer.deployToken({
      name: "DATS Governance Token",
      symbol: "DGT",
      primary_sale_recipient: AddressZero,
    });
    console.log(
      " Successfully Deployed Token Module, Address: ",
      tokenAddress,
    );
  } catch (error) {
    console.error("Failed To Deploy Token Module", error);
  }
})();
