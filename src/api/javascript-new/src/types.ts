import { Resource } from "@azure/cosmos";

export type TodoItem = {
  id: string;
  owner: string;
  description: string;
  status: boolean;
} & Resource;
