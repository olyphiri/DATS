import sdk from "./1-initialize-sdk.js";
import { readFileSync } from "fs";

const editionDrop = sdk.getEditionDrop("0x3c7B0b0C0EEa6634aff39383ba8EeF6F44603c49");

(async () => {
  try {
    await editionDrop.createBatch([
      {
        name: "DATS Official Logo",
        description: "This NFT will give you access to DATS!",
        image: readFileSync("scripts/assets/dats.png"),
      },
    ]);
    console.log(" Successfully created a new NFT!");
  } catch (error) {
    console.error("Failed to create the new NFT", error);
  }
})();
