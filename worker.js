
import { Hono } from "hono";
import {
  paymentMiddleware,
  x402ResourceServer,
} from "@x402/hono";
import { HTTPFacilitatorClient } from "@x402/core/server";
import { ExactEvmScheme } from "@x402/evm/exact/server";

const app = new Hono();

const PAY_TO = "0x16d5C74b160fe680B8295E06e0C91Ea9702F1B53";
const NETWORK = "eip155:8453";

const quotes = [
  "Great things take time. Keep building.",
  "Consistency beats temporary motivation.",
  "Your future is created by what you do today.",
  "Small steps lead to big achievements.",
  "Never stop learning and improving.",
  "Build something meaningful every day.",
  "Success comes from patience and persistence."
];

const facilitator = new HTTPFacilitatorClient({
  url: "https://facilitator.payai.network"
});

const resourceServer = new x402ResourceServer(facilitator)
  .register(NETWORK, new ExactEvmScheme());

app.use(
  paymentMiddleware(
    {
      "GET /quote": {
        accepts: {
          scheme: "exact",
          price: "$0.01",
          network: NETWORK,
          payTo: PAY_TO
        },
        description: "Get one motivational quote",
        mimeType: "application/json"
      }
    },
    resourceServer
  )
);

app.get("/", (c) => {
  return c.json({
    name: "Akash Quote API",
    status: "online",
    endpoint: "/quote",
    payment: "0.01 USDC",
    network: "Base Mainnet"
  });
});

app.get("/quote", (c) => {
  const index = Math.floor(Math.random() * quotes.length);

  return c.json({
    success: true,
    quote: quotes[index],
    provider: "Akash Quote API"
  });
});

export default app;
