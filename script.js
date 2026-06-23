async function connectWallet() {
    const walletStatus = document.getElementById("walletStatus");
    const walletInput = document.getElementById("walletInput");

    if (typeof window.ethereum === "undefined") {
        walletStatus.style.color = "#00ff62";
        walletStatus.textContent = "No EVM wallet found. Open this site in MetaMask, Trust Wallet browser, Rabby, or another Web3 wallet.";
        return;
    }

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        const wallet = accounts[0];

        walletStatus.style.color = "#00ff99";
        walletStatus.textContent =
            "Connected: " + wallet.slice(0, 6) + "..." + wallet.slice(-4);

        walletInput.value = wallet;
    } catch (error) {
        walletStatus.style.color = "#ff4d4d";
        walletStatus.textContent = "Wallet connection cancelled.";
    }
}

function checkEligibility() {
    const wallet = document.getElementById("walletInput").value.trim();
    const result = document.getElementById("result");

    if (wallet === "") {
        result.style.color = "#ffcc00";
        result.textContent = "Please paste a wallet address first.";
        return;
    }

    if (wallet.length < 10) {
        result.style.color = "#ff4d4d";
        result.textContent = "Invalid wallet address.";
        return;
    }

    const lastChar = wallet.slice(-1).toLowerCase();
    const eligibleChars = ["0", "2", "4", "6", "8", "a", "c", "e"];

    if (eligibleChars.includes(lastChar)) {
        result.style.color = "#06f897";
        result.textContent = "Congratulations! You are eligible.";
    } else {
        result.style.color = "#fd0303";
        result.textContent = "Sorry, you are not eligible.";
    }
}

async function loadPrices() {
    const url =
        "https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana,binancecoin,ripple,dogecoin,tron,cardano,avalanche-2,chainlink&vs_currencies=usd";

    try {
        const response = await fetch(url);
        const data = await response.json();

        document.getElementById("btc").textContent = "$" + data.bitcoin.usd;
        document.getElementById("eth").textContent = "$" + data.ethereum.usd;
        document.getElementById("sol").textContent = "$" + data.solana.usd;
        document.getElementById("bnb").textContent = "$" + data.binancecoin.usd;
        document.getElementById("xrp").textContent = "$" + data.ripple.usd;
        document.getElementById("doge").textContent = "$" + data.dogecoin.usd;
        document.getElementById("trx").textContent = "$" + data.tron.usd;
        document.getElementById("ada").textContent = "$" + data.cardano.usd;
        document.getElementById("avax").textContent = "$" + data["avalanche-2"].usd;
        document.getElementById("link").textContent = "$" + data.chainlink.usd;
    } catch (error) {
        console.log("Price loading error:", error);
    }
}

loadPrices();
setInterval(loadPrices, 10000);