import sdk from "./1-initialize-sdk.js";

(async () => {
  try {
    const voteContractAddress = await sdk.deployer.deployVote({
      name: "DATS Governance Voting Token",

      voting_token_address: "0x2EF5ea46fe4072db1569F71f9BC132F560164ee3",
      voting_delay_in_blocks: 0,
      voting_period_in_blocks: 6570,
      voting_quorum_fraction: 0,
      proposal_token_threshold: 0,
    });

    console.log(
      "Successfully Deployed Vote Contract, Address: ",
      voteContractAddress,
    );
  } catch (err) {
    console.error("Failed To Deploy Vote Contract ", err);
  }
})();
