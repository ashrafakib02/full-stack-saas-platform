import { useEffect } from "react";
import { testApi } from "./api/test";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await testApi();
        console.log("API Response:", data);
      } catch (error) {
        console.error("Error:", error);
      }
    };

    fetchData();
  }, []);

  return <h1>Check Console</h1>;
}

export default App;