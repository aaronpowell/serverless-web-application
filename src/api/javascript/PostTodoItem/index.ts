import { AzureFunction, Context, HttpRequest } from "@azure/functions";

const idGenerator = () => {
  const chars = "qwertyuioplkjhgfdsazxcvbnm";

  let code = "";

  for (let i = 0; i < 4; i++) {
    const random = Math.floor(Math.random() * chars.length);
    code += chars[random];
  }

  return code;
};

const httpTrigger: AzureFunction = async function (
  context: Context,
  req: HttpRequest
): Promise<void> {
  const id = idGenerator();
  const todo = { ...req.body, id, status: false };

  context.bindings.todo = JSON.stringify(todo);

  context.res = {
    status: 201,
    body: todo,
    headers: {
      "content-type": "application/json",
    },
  };
};

export default httpTrigger;
