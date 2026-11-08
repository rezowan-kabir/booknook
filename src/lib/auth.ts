import { betterAuth } from "better-auth";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "@better-auth/mongo-adapter";

const mongoDbUrl = process.env.MONGO_DB_URL;
if (!mongoDbUrl) {
  throw new Error("MONGO_DB_URL is not configured.");
}

const client = new MongoClient(mongoDbUrl);
const db = client.db("booknook");
const githubClientId = process.env.GITHUB_CLIENT_ID;
const githubClientSecret = process.env.GITHUB_CLIENT_SECRET;

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL,
  secret: process.env.BETTER_AUTH_SECRET,
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
    autoSignIn: false,
  },
  plugins:[
    jwt(),
  ],
  session:{
    cookieCache: {
      enabled: true,
      strategy: 'jwt',
      maxAge: 5*24*60*60 //5 day
    }
  },
  ...(githubClientId && githubClientSecret
    ? {
        socialProviders: {
          github: {
            clientId: githubClientId,
            clientSecret: githubClientSecret,
          },
        },
      }
    : {}),
});