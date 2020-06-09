var express = require("express");
var app = express();
const fetch = require("node-fetch");

app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://nenad-abramovic.github.io/"
  );
  res.setHeader("Access-Control-Allow-Headers", "*");
  next();
});

app.get("/api/weather/:city_name", async (req, res) => {
  let data;
  try {
    let response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${req.params.city_name}&appid=${process.env.APP_ID}`,
      { credentials: "include" }
    );
    data = await response.json();
    if (data.cod === "404") {
      return res.status(404).json({
        success: false,
        data: { message: "Тражено место није пронађено" },
      });
    }
  } catch (err) {
    return res.status(400).json({
      success: false,
      data: { message: "Тражено место није пронађено" },
    });
  }

  return res.status(200).json({
    success: true,
    data: data,
  });
});

app.listen(process.env.PORT, () => {
  console.log(`Server started`);
});
