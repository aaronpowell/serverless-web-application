import { input } from "@azure/functions";

const baseCosmosBinding = input.cosmosDB({
  databaseName: "TodoList",
  collectionName: "Items",
  connectionStringSetting: "CosmosConnectionString",
});
export const baseCosmosInputBinding = {
  ...baseCosmosBinding,
  direction: "in",
};
export const baseCosmosOutputBinding = {
  ...baseCosmosBinding,
  direction: "out",
};
