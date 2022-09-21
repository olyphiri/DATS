import { useAddress, useMetamask, useEditionDrop, useToken, useVote, useNetwork } from '@thirdweb-dev/react';
import { ChainId } from '@thirdweb-dev/sdk'
import { useState, useEffect, useMemo } from 'react';
import { AddressZero } from "@ethersproject/constants";

const App = () => {
  const address = useAddress();
  const network = useNetwork();
  const connectWithMetamask = useMetamask();
  console.log("👋Address:", address);

  const editionDrop = useEditionDrop("0x3c7B0b0C0EEa6634aff39383ba8EeF6F44603c49");
  const token = useToken("0x2EF5ea46fe4072db1569F71f9BC132F560164ee3");
  const vote = useVote("0x9d195D0912375dC8814cf3429bB58799f7f09CCf");
  const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
  const [memberAddresses, setMemberAddresses] = useState([]);

  const shortenAddress = (str) => {
    return str.substring(0, 6) + "..." + str.substring(str.length - 4);
  };

  const [proposals, setProposals] = useState([]);
  const [isVoting, setIsVoting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }
    const getAllProposals = async () => {
      try {
        const proposals = await vote.getAll();
        setProposals(proposals);
        console.log("Proposals: ", proposals);
      } catch (error) {
          console.log("Failed To Get Proposals", error);
      }
    };
    getAllProposals();
  }, [hasClaimedNFT, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    if (!proposals.length) {
      return;
    }

    const checkIfUserHasVoted = async () => {
      try {
        const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
        setHasVoted(hasVoted);
        if (hasVoted) {
          console.log("User Has Already Voted");
        } else {
            console.log("User Has Not Voted Yet");
        }
      } catch (error) {
          console.error("Failed To Check If Wallet Has Voted", error);
      }
    };
    checkIfUserHasVoted();

  }, [hasClaimedNFT, proposals, address, vote]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllAddresses = async () => {
      try {
        const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
        setMemberAddresses(memberAddresses);
        console.log("🚀Membership List: ", memberAddresses);
      } catch (error) {
          console.error("Failed To Get Membership List", error);
      }

    };
    getAllAddresses();
  }, [hasClaimedNFT, editionDrop.history]);

  useEffect(() => {
    if (!hasClaimedNFT) {
      return;
    }

    const getAllBalances = async () => {
      try {
        const amounts = await token.history.getAllHolderBalances();
        setMemberTokenAmounts(amounts);
        console.log("👜Balance's: ", amounts);
      } catch (error) {
          console.error("Failed To Get Membership List Balance's", error);
      }
    };
    getAllBalances();
  }, [hasClaimedNFT, token.history]);

  const memberList = useMemo(() => {
    return memberAddresses.map((address) => {
      const member = memberTokenAmounts?.find(({ holder }) => holder === address);
      return {
        address,
        tokenAmount: member?.balance.displayValue || "0",
      }
    });
  }, [memberAddresses, memberTokenAmounts]);

  useEffect(() => {
    if (!address) {
      return;
    }

    const checkBalance = async () => {
      try {
        const balance = await editionDrop.balanceOf(address, 0);
        if (balance.gt(0)) {
          setHasClaimedNFT(true);
          console.log("User has DMT NFT!");
        } else {
          setHasClaimedNFT(false);
          console.log("User doesn't have DMT NFT!");
        }
      } catch (error) {
        setHasClaimedNFT(false);
        console.error("Failed To Get User DMT NFT Balance", error);
      }
    };
    checkBalance();
  }, [address, editionDrop]);

  const mintNft = async () => {
    try {
      setIsClaiming(true);
      await editionDrop.claim("0", 1);
      console.log(`Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
      setHasClaimedNFT(true);
    } catch (error) {
      setHasClaimedNFT(false);
      console.error("Failed To Mint DMT NFT", error);
    } finally {
      setIsClaiming(false);
    }
  };

  if (hasClaimedNFT) {
    return (
      <div className="member-page">
        <h1><font color = "#000414">DATS Control Panel</font></h1>
        <p></p>
        <div>
          <div>
            <h2><font color = "#000414">Member List</font></h2>
            <table className="card">
              <thead>
                <tr>
                  <th>Address</th>
                  <th>Token Amount</th>
                </tr>
              </thead>
            <tbody>
            {memberList.map((member) => {
              return (
                <tr key={member.address}>
                  <td>{shortenAddress(member.address)}</td>
                  <td>{member.tokenAmount}</td>
                </tr>
              );
            })}
            </tbody>
            </table>
          </div>
          <div>
            <h2><font color = "#000414">Active Proposals</font></h2>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                e.stopPropagation();

                setIsVoting(true);

                const votes = proposals.map((proposal) => {
                  const voteResult = {
                    proposalId: proposal.proposalId,
                    vote: 2,
                  };
                  proposal.votes.forEach((vote) => {
                    const elem = document.getElementById(
                      proposal.proposalId + "-" + vote.type
                    );

                    if (elem.checked) {
                      voteResult.vote = vote.type;
                      return;
                    }
                  });
                  return voteResult;
                });

                try {
                  const delegation = await token.getDelegationOf(address);
                  if (delegation === AddressZero) {
                    await token.delegateTo(address);
                  }
                  try {
                    await Promise.all(
                      votes.map(async ({ proposalId, vote: _vote }) => {
                        const proposal = await vote.get(proposalId);
                        if (proposal.state === 1) {
                          return vote.vote(proposalId, _vote);
                        }
                        return;
                      })
                    );
                    try {
                      await Promise.all(
                        votes.map(async ({ proposalId }) => {
                          const proposal = await vote.get(proposalId);

                          if (proposal.state === 4) {
                            return vote.execute(proposalId);
                          }
                        })
                      );
                      setHasVoted(true);
                      console.log("Successfully Voted");
                    } catch (err) {
                      console.error("Failed To Execute Votes", err);
                    }
                  } catch (err) {
                    console.error("Failed To Vote", err);
                  }
                } catch (err) {
                  console.error("Failed To Delegate Tokens");
                } finally {
                  setIsVoting(false);
                }
              }}
            >
              {proposals.map((proposal) => (
                <div key={proposal.proposalId} className="card">
                  <h5>{proposal.description}</h5>
                  <div>
                    {proposal.votes.map(({ type, label }) => (
                      <div key={type}>
                        <input
                          type="radio"
                          id={proposal.proposalId + "-" + type}
                          name={proposal.proposalId}
                          value={type}
                          defaultChecked={type === 2}
                        />
                        <label htmlFor={proposal.proposalId + "-" + type}>
                          {label}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button disabled={isVoting || hasVoted} type="submit">
                {isVoting
                  ? "Voting..."
                  : hasVoted
                    ? "You Already Voted"
                    : "Submit Vote"}
              </button>
              {!hasVoted && (
                <small>
                  This Will Trigger Multiple Transaction Processes That You Have To Sign.
                </small>
              )}
            </form>
          </div>
        </div>
      </div>
    );
  };

  if (address && (network?.[0].data.chain.id !== ChainId.Rinkeby)) {
    return (
      <div className="unsupported-network">
        <h2>Please connect to Rinkeby</h2>
        <p>This dapp only works on the Rinkeby network, please switch network in your connected wallet.</p>
      </div>
    );
  }

  if (!address) {
    return (
      <div className="landing">
        <h1><font color = "black">Decentralized Autonomous Tender System</font></h1>
        <button onClick={connectWithMetamask} className="btn-hero">
          Connect Wallet
        </button>
      </div>
    );
  }
  else {
    return (
      <div className="mint-nft">
        <h1><font color = "black">Mint Your Free DATS Membership NFT Now!</font></h1>
        <button
          disabled={isClaiming}
          onClick={mintNft}
        >
          {isClaiming ? "Minting..." : "Mint NFT"}
        </button>
      </div>
    );
  }
}

export default App;
