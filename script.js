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