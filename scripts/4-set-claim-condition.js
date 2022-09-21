import sdk from "./1-initialize-sdk.js";
import { MaxUint256 } from "@ethersproject/constants";

const editionDrop = sdk.getEditionDrop("0x3c7B0b0C0EEa6634aff39383ba8EeF6F44603c49");

(async () => {
  try {
    const claimConditions = [{
      startTime: new Date(),
      maxQuantity: 50_000,
      price: 0,
      quantityLimitPerTransaction: 1,
      waitInSeconds: MaxUint256,
    }]

    await editionDrop.claimConditions.set("0", claimConditions);
    console.log(" Successfully seta claim condition!");
  } catch (error) {
    console.error("Failed to set a claim condition", error);
  }
})();
