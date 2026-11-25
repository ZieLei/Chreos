import "dotenv/config";
import app from "./app.js";

const PORT = process.env.PORT;

app.listen(PORT, (): void => {
  console.log("Listening on port: ", PORT);
});
