import sdk from "./1-initialize-sdk.js";
import { ethers } from "ethers";

const vote = sdk.getVote("0x9d195D0912375dC8814cf3429bB58799f7f09CCf");
const token = sdk.getToken("0x2EF5ea46fe4072db1569F71f9BC132F560164ee3");

(async () => {
  try {
    const amount = 420_000;
    const description = "Should DATS Mint An Additional " + amount + " Of Tokens Into The Treasury?";
    const executions = [
      {
        toAddress: token.getAddress(),
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          "mintTo", [
          vote.getAddress(),
          ethers.utils.parseUnits(amount.toString(), 18),
        ]
        ),
      }
    ];

    await vote.propose(description, executions);

    console.log(" SuccessfullyCreated Proposal To Mint DGVT");
  } catch (error) {
    console.error("Failed To Create First Proposal", error);
    process.exit(1);
  }

  try {
    const amount = 10_000_000;
    const description = "Should DATS Transfer " + amount + " DGVT From The Treasury To " +
      process.env.WALLET_ADDRESS + " For Being Such An Awesome Software Engineer?";
    const executions = [
      {
        nativeTokenValue: 0,
        transactionData: token.encoder.encode(
          "transfer",
          [
            process.env.WALLET_ADDRESS,
            ethers.utils.parseUnits(amount.toString(), 18),
          ]
        ),
        toAddress: token.getAddress(),
      },
    ];

    await vote.propose(description, executions);

    console.log(
      " SuccessfullyCreated Proposal To Reward 0x4d...aced From The Treasury, Let's Hope People Vote For It!"
    );
  } catch (error) {
    console.error("Failed To Create Second Proposal", error);
  }
})();
