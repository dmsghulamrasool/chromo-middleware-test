"use client";
import React, { useEffect } from "react";

const App = () => {
  const apitest = async () => {
    const res = await fetch("https://api.15.240.101.30.nip.io/countries/list", {
      method: "get",
    });
    const data = await res.json();
    console.log(data);
  };

  useEffect(() => {
    apitest();
  }, []);
  return <div>app</div>;
};

export default App;
