import "dotenv/config";
import express from "express";
import * as path from "path";
import cors from "cors";
import sequelize from "./sequelize";
import subscriptionRoutes from "./routes/subscriptionRoution";
import authRoutes from "./routes/authRoutes";
import bodyParser from "body-parser";

const app: any = express();

app.use('/api/subscription/webhook', bodyParser.raw({ type: 'application/json' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());


app.use('/api/subscription', subscriptionRoutes);
app.use('/api/auth', authRoutes);
app.get("/", (req: any, res: any) => {
  res.json({
    message: "Hello World!",
  });
});



app.use(express.static(path.join(__dirname, "public")));
const main = async () => {
 
  sequelize
    .authenticate()
    .then(() => {
      console.log("Connection has been established successfully.");

      app.listen({ port: process.env.PORT || 4000 }, () =>
        console.log(
          `Server ready at http://localhost:${process.env.PORT || 4000}`
        )
      );
    })
    .catch((error) => {
      console.error("Unable to connect to the database: ", error);
    });
};

main().catch(console.error);
