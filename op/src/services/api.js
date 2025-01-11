export const fetchOddsData = async () => {
    try {
      const response = await fetch("http://localhost:5001/odds");
      if (!response.ok) {
        throw new Error("Failed to fetch odds data");
      }
      return await response.json();
    } catch (error) {
      console.error("API error:", error);
      throw error;
    }
  };