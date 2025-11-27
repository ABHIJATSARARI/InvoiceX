export const fetchEurUsdRate = async (): Promise<number> => {
  try {
    const response = await fetch('https://api.frankfurter.app/latest?from=EUR&to=USD');
    const data = await response.json();
    return data.rates.USD;
  } catch (error) {
    console.error("Failed to fetch live forex rate:", error);
    return 1.08; // Fallback if API is down
  }
};