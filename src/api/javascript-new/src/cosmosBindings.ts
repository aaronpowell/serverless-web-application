import { input, output } from "@azure/functions";

export const cosmosSettings = {
  databaseName: "TodoList",
  collectionName: "Items",
  connectionStringSetting: "CosmosConnectionString",
};
export const baseCosmosInputBinding = input.cosmosDB(cosmosSettings);
export const baseCosmosOutputBinding = output.cosmosDB(cosmosSettings);
