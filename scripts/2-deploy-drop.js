import { AddressZero } from "@ethersproject/constants";
import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

(async () => {
  try {
    const editionDropAddress = await sdk.deployer.deployEditionDrop({
      name: "DATS-Membership",
      description: "A Decentralized Autonomous Tender System",
      image: readFileSync("scripts/assets/favicon.png"),
      primary_sale_recipient: AddressZero,
    });
    const editionDrop = sdk.getEditionDrop(editionDropAddress);

    const metadata = await editionDrop.metadata.get();

    console.log(
      " Successfully deploye DATS Drop contract, address: ",
      editionDropAddress,
    );
    console.log("DATS Drop metadata: ", metadata);
  } catch (error) {
    console.log("Failed to deploy DATS Drop contract: ", error);
  }
})();
