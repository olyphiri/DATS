import sdk from "./1-initialize-sdk.js";

const vote = sdk.getVote("0x9d195D0912375dC8814cf3429bB58799f7f09CCf");
const token = sdk.getToken("0x2EF5ea46fe4072db1569F71f9BC132F560164ee3");

(async () => {
  try {
    await token.roles.grant("minter", vote.getAddress());
    console.log(
      "Successfully Gave Vote Contract Permissions To Act On DGT Contract"
    );
  } catch (error) {
    console.error(
      "Failed To Grant Vote Contract Permissions On DGT Contract",
      error
    );
    process.exit(1);
  }

  try {
    const ownedTokenBalance = await token.balanceOf(
      process.env.WALLET_ADDRESS
    );

    const ownedAmount = ownedTokenBalance.displayValue;
    const percent90 = Number(ownedAmount) / 100 * 60;

    await token.transfer(
      vote.getAddress(),
      percent90
    );

    console.log(" SuccessfullyTransferred " + percent90 + " DGT To DGVT Contract");
  } catch (err) {
    console.error("Failed To Transfer Tokens To Vote Contract", err);
  }
})();
