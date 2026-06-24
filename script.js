let connectedWallet = "";

const AIRDROP_CONTRACT = "0xa71fda0C3C2F7f418a5A3352D36A7F4f64138960";

const AIRDROP_ABI = [
  "function claimable(address) view returns (uint256)",
  "function hasClaimed(address) view returns (bool)",
  "function claim()"
];

const connectTop = document.getElementById("connectTop");
const connectMain = document.getElementById("connectMain");
const claimBtn = document.getElementById("claimBtn");

const walletText = document.getElementById("walletText");
const statusText = document.getElementById("statusText");
const amountText = document.getElementById("amountText");

async function connectWallet() {
  if (!window.ethereum) {
    alert("MetaMask not found");
    return;
  }

  const accounts = await window.ethereum.request({
    method: "eth_requestAccounts"
  });

  connectedWallet = accounts[0];

  const shortWallet =
    connectedWallet.slice(0, 6) + "..." + connectedWallet.slice(-4);

  connectTop.innerText = shortWallet;
  connectMain.innerText = "Wallet Connected";
  walletText.innerText = "Wallet: " + shortWallet;

  await checkEligibility();
}

async function checkEligibility() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const contract = new ethers.Contract(AIRDROP_CONTRACT, AIRDROP_ABI, provider);

  const amount = await contract.claimable(connectedWallet);
  const claimed = await contract.hasClaimed(connectedWallet);

  const formattedAmount = ethers.utils.formatUnits(amount, 18);

  if (claimed) {
    statusText.innerText = "Status: Already Claimed";
    amountText.innerText = "Claimable: " + formattedAmount + " OCA";
    claimBtn.disabled = true;
  } else if (amount.gt(0)) {
    statusText.innerText = "Status: Eligible";
    amountText.innerText = "Claimable: " + formattedAmount + " OCA";
    claimBtn.disabled = false;
  } else {
    statusText.innerText = "Status: Not Eligible";
    amountText.innerText = "Claimable: 0 OCA";
    claimBtn.disabled = true;
  }
}

async function claimOCA() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const signer = provider.getSigner();

  const contract = new ethers.Contract(AIRDROP_CONTRACT, AIRDROP_ABI, signer);

  const tx = await contract.claim();
  alert("Claim submitted. Wait for confirmation.");

  await tx.wait();

  alert("Claim successful. OCA sent to your wallet.");
  await checkEligibility();
}

connectTop.addEventListener("click", connectWallet);
connectMain.addEventListener("click", connectWallet);
claimBtn.addEventListener("click", claimOCA);