async function connectWallet() {
    const walletInput = document.getElementById("walletInput");
    const connectButton = document.getElementById("connectButton");
    const walletMenu = document.getElementById("walletMenu");

    if (typeof window.ethereum === "undefined") {
        showToast("No wallet found");
        return;
    }

    try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts"
        });

        const wallet = accounts[0];

        const message =
            "I am verifying ownership of this wallet for One Circle Alpha. This action does not move funds or require gas.";

        await window.ethereum.request({
            method: "personal_sign",
            params: [message, wallet]
        });

        walletInput.value = wallet;
        connectButton.textContent = wallet.slice(0, 6) + "..." + wallet.slice(-5);
        walletMenu.style.display = "inline-block";

        showToast("Wallet verified successfully");
    } catch (error) {
        showToast("Wallet connection cancelled");
    }
}

function showToast(message) {
    const toast = document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(() => {
        toast.classList.remove("show");
    }, 2000);
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
        result.style.color = "#00ff99";
        result.textContent = "Eligible. This wallet passed the demo check.";
    } else {
        result.style.color = "#ff4d4d";
        result.textContent = "Not eligible. This wallet did not pass the demo check.";
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