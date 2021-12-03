import { QueuePlugin } from "../queue-plugin";

const error: QueuePlugin["error"] = async ({ error }) => {
  console.log("Olha o erro, mano!", error);
};

const ErrorReporter: QueuePlugin = {
  error,
};
export default ErrorReporter;
