import sdk from "./1-initialize-sdk.js";

const editionDrop = sdk.getEditionDrop("0x3c7B0b0C0EEa6634aff39383ba8EeF6F44603c49");
const token = sdk.getToken("0x2EF5ea46fe4072db1569F71f9BC132F560164ee3");

(async () => {
  try {
    const walletAddresses = await editionDrop.history.getAllClaimerAddresses(0);
    if (walletAddresses.length === 0) {
      console.log(
        "No $DMT's have been claimed yet, maybe get some friends to claim your free $DMT NFT!",
      );
      process.exit(0);
    }

    const airdropTargets = walletAddresses.map((address) => {
      const randomAmount = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      console.log(" Going To Airdrop ", randomAmount, " Tokens To: ", address);
      const airdropTarget = {
        toAddress: address,
        amount: randomAmount,
      };
      return airdropTarget;
    });

    console.log("Starting Airdrop... ");
    await token.transferBatch(airdropTargets);
    console.log(" Successfully Airdropped Tokens To All The Holders Of The $DMT NFT!");
  } catch (err) {
    console.error("Failed To Airdrop Tokens", err);
  }
})();
