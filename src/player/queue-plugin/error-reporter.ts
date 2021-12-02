import { QueuePlugin } from "../queue-plugin";

const onError: QueuePlugin["onError"] = async (params) => {
  console.log("Olha o erro, mano!", params);
};

const ErrorReporter: QueuePlugin = {
  onError,
};

export default ErrorReporter;
