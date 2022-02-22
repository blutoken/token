import { useState, useEffect } from "react";
import { ethers } from "ethers";
import blu from "./BLU.json";
import "./index.css";

export default function App() {
  const bluTokenAddress = "0x718CCd5627De71a3eF0012191D7EF5f010F0e653";
  const bluLPAddress = "0x979C7e2e691331F6eb491d36b4213c3D232401F4";

  const [holderInfo, setHolderInfo] = useState({
    addressTrunc: "-",
    tokenBalance: "-",
    lpBalance: "-",
    activityText: ""
  });

  const [link, setLink] = useState({
    uniToken: `https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=${bluTokenAddress}&chain=mainnet`,
    uniLP: `https://app.uniswap.org/#/add/v2/${bluTokenAddress}/ETH?chain=mainnet`,
    esWallet: "./",
    esToken: "./",
    esTokenWallet: ",/",
    esLP: "./",
    esLPWallet: "./",
    esTarget: "_self"
  });



  useEffect(() => {

    const getBluBalance = async () => {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);

      const bluToken = new ethers.Contract(bluTokenAddress, blu.abi, provider);
      const bluLP = new ethers.Contract(bluLPAddress, blu.abi, provider);

      const signer = await provider.getSigner();
      const holder = await signer.getAddress();
      var holderTrunc = "-";
      const aLen = holder.length;
      if(aLen !== 42) { return; }
      holderTrunc = holder[0] + holder[1] + holder[2] + holder[3] + holder[4] +
                   holder[5] + "..." + holder[aLen-4] + holder[aLen-3] +
                   holder[aLen-2] + holder[aLen-1];

      const bluTokenDecimals = await bluToken.decimals();
      const bluTokenXwei = Math.pow(10, bluTokenDecimals);
      const bluLPDecimals = await bluLP.decimals();
      const bluLPDXwei = Math.pow(10, bluLPDecimals);

      const bluTokenBalance = await bluToken.balanceOf(holder)/bluTokenXwei;
      const bluLPBalance = await bluLP.balanceOf(holder)/bluLPDXwei;

      setHolderInfo({
        addressTrunc: holderTrunc,
        tokenBalance: String(bluTokenBalance),
        lpBalance: String(bluLPBalance),
        activityText: "(activity)"
      });

      setLink({
        uniToken: `https://app.uniswap.org/#/swap?inputCurrency=eth&outputCurrency=${bluTokenAddress}&chain=mainnet`,
        uniLP: `https://app.uniswap.org/#/add/v2/${bluTokenAddress}/ETH?chain=mainnet`,
        esWallet: `https://etherscan.io/address/${holder}`,
        esToken: `https://etherscan.io/address/${bluTokenAddress}`,
        esLP: `https://etherscan.io/address/${bluLPAddress}`,
        esTokenWallet: `https://etherscan.io/token/${bluTokenAddress}?a=${holder}`,
        esLPWallet: `https://etherscan.io/token/${bluLPAddress}?a=${holder}`,
        esTarget: "_blank"
      });

    };

    getBluBalance();
  }, []);



  return (
    <div className="all">

      <table className="button-group">
        <tr>
          <td className="button-individual">
            <form action={link.uniLP}>
              <input className="input-individual" type="submit" value="Add Liquidity"/>
            </form>
          </td>
          <td className="button-individual">
            <form action={link.uniToken}>
              <input className="input-individual" type="submit" value="Buy BLU Token"/>
            </form>
          </td>
        </tr>
      </table>

      <table className="table-format">
        <tr>
          <td className="token-label">
            <a className="token-label-link" target={link.esTarget} rel="noreferrer" href={link.esWallet}>Your Wallet</a>:
          </td>
          <td className="token-value">{holderInfo.addressTrunc}</td>
        </tr>
        <tr>
          <td className="token-label">
            <a className="token-label-link" target={link.esTarget} rel="noreferrer" href={link.esToken}>BLU Tokens</a>:
          </td>
          <td className="token-value">{holderInfo.tokenBalance}&nbsp;
            <a className="activity-link" target="_blank" rel="noreferrer" href={link.esTokenWallet}>
              {`${holderInfo.activityText}`}
            </a>
          </td>
        </tr>
        <tr>
          <td className="token-label">
            <a className="token-label-link" target={link.esTarget} rel="noreferrer" href={link.esLP}>LP Tokens</a>:
          </td>
          <td className="token-value">{holderInfo.lpBalance}&nbsp;
            <a className="activity-link" target={link.esTarget} rel="noreferrer" href={link.esLPWallet}>
              {`${holderInfo.activityText}`}
            </a>
          </td>
        </tr>
      </table>

    </div>
  );
}
