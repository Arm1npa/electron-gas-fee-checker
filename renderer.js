const axios = require("axios");

// Your Infura API key
const INFURA_API_KEY = "YOUR_API_KEY"; // Use your actual Infura API Key

// The chain ID of the Ethereum mainnet (1 = Ethereum mainnet)
const chainId = 1;

// Variables to store previous gas fees for comparison
let previousGasFees = null;

// Function to determine the change class based on current and previous values
function getChangeClass(current, previous) {
  if (previous === null) return "";
  if (current > previous) return "up";
  if (current < previous) return "down";
  return "";
}

// Function to convert Gwei to ETH
function gweiToEth(gwei) {
  return (gwei / 1e9).toFixed(9); // 1 Gwei = 1e-9 ETH
}

// Function to fetch gas fees
async function fetchGasFees() {
  // Show loading spinner and text
  document.getElementById("gasPriceLoading").classList.remove("hidden");
  document.getElementById("gasPrice").classList.add("hidden");
  document.getElementById("gasPriceLoadingText").classList.remove("hidden");

  try {
    const { data } = await axios.get(
      `https://gas.api.infura.io/v3/${INFURA_API_KEY}/networks/${chainId}/suggestedGasFees`
    );

    const high = data.high;
    const medium = data.medium;
    const low = data.low;

    // Determine change classes
    const highChangePriority = getChangeClass(
      parseFloat(high.suggestedMaxPriorityFeePerGas),
      previousGasFees?.high?.suggestedMaxPriorityFeePerGas
    );
    const highChangeFee = getChangeClass(
      parseFloat(high.suggestedMaxFeePerGas),
      previousGasFees?.high?.suggestedMaxFeePerGas
    );

    const mediumChangePriority = getChangeClass(
      parseFloat(medium.suggestedMaxPriorityFeePerGas),
      previousGasFees?.medium?.suggestedMaxPriorityFeePerGas
    );
    const mediumChangeFee = getChangeClass(
      parseFloat(medium.suggestedMaxFeePerGas),
      previousGasFees?.medium?.suggestedMaxFeePerGas
    );

    const lowChangePriority = getChangeClass(
      parseFloat(low.suggestedMaxPriorityFeePerGas),
      previousGasFees?.low?.suggestedMaxPriorityFeePerGas
    );
    const lowChangeFee = getChangeClass(
      parseFloat(low.suggestedMaxFeePerGas),
      previousGasFees?.low?.suggestedMaxFeePerGas
    );

    // Build HTML with colored spans and converted ETH values
    document.getElementById("gasPrice").innerHTML = `
      <p><strong>High:</strong> 
        <span class="${highChangePriority}">${
      high.suggestedMaxPriorityFeePerGas
    } Gwei (${gweiToEth(
      high.suggestedMaxPriorityFeePerGas
    )} ETH)</span> (Max Priority Fee), 
        <span class="${highChangeFee}">${
      high.suggestedMaxFeePerGas
    } Gwei (${gweiToEth(high.suggestedMaxFeePerGas)} ETH)</span> (Max Fee)
      </p>
      <p><strong>Medium:</strong> 
        <span class="${mediumChangePriority}">${
      medium.suggestedMaxPriorityFeePerGas
    } Gwei (${gweiToEth(
      medium.suggestedMaxPriorityFeePerGas
    )} ETH)</span> (Max Priority Fee), 
        <span class="${mediumChangeFee}">${
      medium.suggestedMaxFeePerGas
    } Gwei (${gweiToEth(medium.suggestedMaxFeePerGas)} ETH)</span> (Max Fee)
      </p>
      <p><strong>Low:</strong> 
        <span class="${lowChangePriority}">${
      low.suggestedMaxPriorityFeePerGas
    } Gwei (${gweiToEth(
      low.suggestedMaxPriorityFeePerGas
    )} ETH)</span> (Max Priority Fee), 
        <span class="${lowChangeFee}">${
      low.suggestedMaxFeePerGas
    } Gwei (${gweiToEth(low.suggestedMaxFeePerGas)} ETH)</span> (Max Fee)
      </p>
    `;

    // Hide loading spinner and show data
    document.getElementById("gasPriceLoading").classList.add("hidden");
    document.getElementById("gasPriceLoadingText").classList.add("hidden");
    document.getElementById("gasPrice").classList.remove("hidden");

    // Update previousGasFees for the next comparison
    previousGasFees = data;
  } catch (error) {
    console.error("Error fetching gas fees:", error);
    document.getElementById("gasPrice").innerHTML =
      "<p class='error-text'>Error fetching gas fees</p>";
    document.getElementById("gasPriceLoading").classList.add("hidden");
    document.getElementById("gasPriceLoadingText").classList.add("hidden");
  }
}

// Function to fetch ETH price in USD and USDT, and determine trend
async function fetchEthPrice() {
  // Show loading spinner and text
  document.getElementById("ethPriceLoading").classList.remove("hidden");
  document.getElementById("ethPrice").classList.add("hidden");
  document.getElementById("ethPriceLoadingText").classList.remove("hidden");

  try {
    // Fetch current ETH price in USD and USDT
    const { data } = await axios.get(
      "https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd,usdt"
    );
    const ethPriceInUsd = data.ethereum.usd;
    const ethPriceInUsdt = data.ethereum.usdt;

    // Fetch ETH price 24 hours ago (using USD)
    const historicalData = await axios.get(
      "https://api.coingecko.com/api/v3/coins/ethereum/market_chart?vs_currency=usd&days=1"
    );
    const historicalPrice = historicalData.data.prices[0][1]; // Price at the start of the day

    // Determine price trend based on USD price
    const priceTrend = ethPriceInUsd > historicalPrice ? "up" : "down";
    const priceColor = priceTrend === "up" ? "green" : "red";

    document.getElementById("ethPrice").innerHTML = `
      <p style="color: ${priceColor};"><strong>ETH Price:</strong> $${ethPriceInUsd.toFixed(
      2
    )} `;

    // Hide loading spinner and show data
    document.getElementById("ethPriceLoading").classList.add("hidden");
    document.getElementById("ethPriceLoadingText").classList.add("hidden");
    document.getElementById("ethPrice").classList.remove("hidden");
  } catch (error) {
    console.error("Error fetching ETH price:", error);
    document.getElementById("ethPrice").innerHTML =
      "<p class='error-text'>Error fetching ETH price</p>";
    document.getElementById("ethPriceLoading").classList.add("hidden");
    document.getElementById("ethPriceLoadingText").classList.add("hidden");
  }
}

// Function to refresh data
function refreshData() {
  // Reset UI elements
  document.getElementById("gasPrice").innerHTML = "";
  document.getElementById("ethPrice").innerHTML = "";

  // Re-fetch gas fees and ETH price
  fetchGasFees();
  fetchEthPrice();
}

// Fetch both gas fees and ETH price when the page loads
(async () => {
  await Promise.all([fetchGasFees(), fetchEthPrice()]);
})();
