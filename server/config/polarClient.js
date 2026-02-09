import { Polar } from "@polar-sh/sdk";

const server = process.env.POLAR_MODE === "production" ? "production" : "sandbox";

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || "",
  server,
});

export default polar;
