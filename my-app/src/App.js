import { useState, useEffect } from 'react';
import { ethers, utils } from "ethers";
import abi from "./contract/wallet.json";

function App() {
  const [isWalletConnected, setIsWalletConnected] = useState(false);
  // const [isOwner, setIsOwner] = useState(false);
  const [inputValue, setInputValue] = useState({ transferAmount: "", transferAddress: "", deposit: "", balance: "" });
  const [OwnerAddress, setOwnerAddress] = useState(null);
  const [TotalBalance, setTotalBalance] = useState(null);
  const [receiveAddress, setReceiverAddress] = useState(null);
  const [error, setError] = useState(null);

  const contractAddress = '0x1D8379999fd6B09499f1ed212eF306a5d8fC1c94';
  const contractABI = abi.abi;

  const checkIfWalletIsConnected = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        const account = accounts[0];
        setIsWalletConnected(true);
        setReceiverAddress(account);
        console.log("Account Connected: ", account);
      } else {
        setError("Please install a MetaMask wallet to use the wallet.");
        console.log("No Metamask detected");
      }
    } catch (error) {
      console.log(error);
    }
  }


  const getOwnerHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const walletContract = new ethers.Contract(contractAddress, contractABI, signer);

        let owner = await walletContract.owner();
        setOwnerAddress(owner);

        const [account] = await window.ethereum.request({ method: 'eth_requestAccounts' });

        // if (owner.toLowerCase() === account.toLowerCase()) {
        //   setIsOwner(true);
        // }
      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use the wallet.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const customerBalanceHanlder = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const walletContract = new ethers.Contract(contractAddress, contractABI, signer);

        let balance = await walletContract.getBalance();
        setTotalBalance(utils.formatEther(balance));
        console.log("Retrieved balance...", balance);

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use the wallet.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const deposityMoneyHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const walletContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await walletContract.deposit({ value: ethers.utils.parseEther(inputValue.deposit) });
        console.log("Deposting money...");
        await txn.wait();
        console.log("Deposited money...done", txn.hash);

        customerBalanceHanlder();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const transferMoneyHandler = async (event) => {
    try {
      event.preventDefault();
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const walletContract = new ethers.Contract(contractAddress, contractABI, signer);

        const txn = await walletContract.transfer(inputValue.transferAddress, ethers.utils.parseEther(inputValue.transferAmount));
        console.log("Transfering money...");
        await txn.wait();
        console.log("Money transfer", txn.hash);

        customerBalanceHanlder();

      } else {
        console.log("Ethereum object not found, install Metamask.");
        setError("Please install a MetaMask wallet to use our bank.");
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleInputChange = (event) => {
    setInputValue(prevFormData => ({ ...prevFormData, [event.target.name]: event.target.value }));
  }

  useEffect(() => {
    checkIfWalletIsConnected();
    getOwnerHandler();
    customerBalanceHanlder()
  }, [isWalletConnected])

  return (
    <main className="main-container">
      <h2 className="headline"><span className="headline-gradient">Wallet Contract Project</span> 💰</h2>
      <section className="customer-section px-10 pt-5 pb-10">
        {error && <p className="text-2xl text-red-700">{error}</p>}
        <div className="mt-7 mb-9">
          <form className="form-style">
            <input
              type="number"
              className="input-style"
              onChange={handleInputChange}
              name="deposit"
              placeholder="0.0000 ETH"
              value={inputValue.deposit}
            />
            <button
              className="btn-purple"
              onClick={deposityMoneyHandler}>Deposit Money In ETH</button>
          </form>
        </div>
        <div className="mt-10 mb-10">
          <form className="form-style">
            <input
              type="number"
              className="input-style"
              onChange={handleInputChange}
              name="transferAmount"
              placeholder="0.0000 ETH"
              value={inputValue.transferAmount}
            />
            <input
              type="text"
              className="input-style"
              onChange={handleInputChange}
              name="transferAddress"
              placeholder="0x..."
              value={inputValue.transferAddress}
            />
            <button
              className="btn-purple"
              onClick={transferMoneyHandler}>
              Transfer Money In ETH
            </button>
          </form>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Cutomer Balance: </span>{TotalBalance}</p>
        </div>
        <div className="mt-5">
          <p><span className="font-bold">Owner Address: </span>{OwnerAddress}</p>
        </div>
        <div className="mt-5">
          {isWalletConnected && <p><span className="font-bold">Your Wallet Address: </span>{receiveAddress}</p>}
          <button className="btn-connect" onClick={checkIfWalletIsConnected}>
            {isWalletConnected ? "Wallet Connected 🔒" : "Connect Wallet 🔑"}
          </button>
        </div>
      </section>

    </main>
  );
}
export default App;
