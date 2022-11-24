//import ethers from './node_modules/ethers';
//import { ethers } from "https://cdn.ethers.io/lib/ethers-5-2.umd.min.js";

import contract from './bike.json' assert{ type: "json" };

const contractAddress = "0x37917bD177F41Ca4c5002688914Ea8Fd1a0800aD";  // smart contract address
const abi = contract.abi;
//const PINATA_KEY = "6cf6cfac822af77d68d1";
//const PINATA_SECRETKEY = "49e08832da9a3aeb6a762c93cc08c822e821b414765c5ad807290bd056a83f18";

//const pinataSDK = require('@pinata/sdk');
//const pinata = pinataSDK(PINATA_KEY, PINATA_SECRETKEY);


async function connect() {
  if (window.ethereum) {
     await window.ethereum.request({ method: "eth_requestAccounts" });
     window.web3 = new Web3(window.ethereum);
     const account = web3.eth.accounts;
     //Get the current MetaMask selected/active wallet
     const walletAddress = account.givenProvider.selectedAddress;
     console.log(`Wallet: ${walletAddress}`);

  } else {
   console.log("No wallet");
  }
}
document.querySelector("#con").addEventListener("click", connect);


async function uploadBike(_brand, _year, _price, _contact, _uri) {
    try {
      const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const bikeContract = new ethers.Contract(contractAddress, abi, signer);

            console.log("Initialize payment");
            let nftTxn = await bikeContract.uploadsell(_brand, _year, _price, _contact, _uri, { value: ethers.utils.parseEther("0.000001") });

            console.log(nftTxn);
            console.log("please wait...");

            console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

        } else {
          console.log("Ethereum object does not exist");
        }
    } catch (err) {
      console.log(err);
    }
}
document.querySelector("#upload").addEventListener("click", () => {
    uploadBike("song", 2020, 100000, "010-1234-5678", "https://ipfs.io/ipfs/QmWn5ZAEM73FP6XRn9QrqCBMbkS7WVbUCxkyFfgJT2fVdd?filename=bike1.png");
});


async function viewList() {
    try {
      const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const bikeContract = new ethers.Contract(contractAddress, abi, signer);

            console.log("success1");

            let result = new Array();
            let data = new Object();

            let nftTxn = await bikeContract.sellingList(0);


            data.brand = nftTxn[0];
            data.year = Number(nftTxn[1].toString());
            data.price = Number(nftTxn[2].toString());
            data.contact = nftTxn[3];
            data.tokenId = Number(nftTxn[4].toString());
            data.seller = nftTxn[5];
            data.uri = nftTxn[6]

            result.push(data);
            console.log(result);

            return data;

        } else {
          console.log("Ethereum object does not exist");
        }
    } catch (err) {
      console.log(err);
    }
}
document.querySelector("#view").addEventListener("click", viewList);


async function buyBike(tokenId) {
    try {
      const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const bikeContract = new ethers.Contract(contractAddress, abi, signer);

            await window.ethereum.request({ method: "eth_requestAccounts" });
            window.web3 = new Web3(window.ethereum);
            const account = web3.eth.accounts;
            let ipfsuri = "https://ipfs.io/ipfs/QmTFpDDS1cFkey7jAkHNrxnLPJDhAS5V7nvsqfXsdoohXV?filename=SongBike.json";

            console.log("success2");
            let nftTxn = await bikeContract.buy(tokenId, { value: ethers.utils.parseEther("0.000001") });

            console.log(nftTxn);
            console.log("please wait...");

            console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

            let nftTxn2 = await bikeContract.NFTmint(account, tokenId, ipfsuri);
            console.log(nftTxn2);


        } else {
          console.log("Ethereum object does not exist");
        }
    } catch (err) {
      console.log(err);
    }
}
document.querySelector("#buy").addEventListener("click", () => {
    buyBike(0);
});


async function getRefund() {
    try {
      const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const bikeContract = new ethers.Contract(contractAddress, abi, signer);

            console.log("success2");
            let nftTxn = await bikeContract.refundMoney();

            console.log(nftTxn);
            console.log("please wait...");

            console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

        } else {
          console.log("Ethereum object does not exist");
        }
    } catch (err) {
      console.log(err);
    }
}
document.querySelector("#refund").addEventListener("click", getRefund);


async function purchase_confirmation() {
    try {
      const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const bikeContract = new ethers.Contract(contractAddress, abi, signer);

            console.log("success2");
            let nftTxn = await bikeContract.purchase_confirmation();

            console.log(nftTxn);
            console.log("please wait...");

            console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

        } else {
          console.log("Ethereum object does not exist");
        }
    } catch (err) {
      console.log(err);
    }
}
document.querySelector("#fix_buyer").addEventListener("click", purchase_confirmation);


async function seller_getMoney(buyer_address) {
    try {
      const { ethereum } = window;

        if (ethereum) {
            const provider = new ethers.providers.Web3Provider(ethereum);
            const signer = provider.getSigner();
            const bikeContract = new ethers.Contract(contractAddress, abi, signer);

            console.log("success2");
            let nftTxn = await bikeContract.seller_confirmation(buyer_address);

            console.log(nftTxn);
            console.log("please wait...");

            console.log(`Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`);

        } else {
          console.log("Ethereum object does not exist");
        }
    } catch (err) {
      console.log(err);
    }
}
document.querySelector("#fix_seller").addEventListener("click", seller_getMoney);


//uploadBike("song", 2020, 100000, "010-1234-5678", "https://ipfs.io/ipfs/QmWn5ZAEM73FP6XRn9QrqCBMbkS7WVbUCxkyFfgJT2fVdd?filename=bike1.png");

//viewList();
//buyBike(0);

//getRefund();
//purchase_confirmation();
//seller_getMoney(주소);
