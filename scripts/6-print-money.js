import sdk from "./1-initialize-sdk.js";

const token = sdk.getToken("0x2EF5ea46fe4072db1569F71f9BC132F560164ee3");

(async () => {
  try {
    const amount = 1_000_000_000;
    await token.mintToSelf(amount);
    const totalSupply = await token.totalSupply();

    console.log(" There Are", totalSupply.displayValue, "$DGT In Circulation");
  } catch (error) {
    console.error("Failed To Print Money", error);
  }
})();
