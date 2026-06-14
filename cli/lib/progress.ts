import ora from "ora";

export async function withSpinner<T>(
  message: string,
  task: () => Promise<T>,
  getSuccessMessage?: (result: T) => string,
): Promise<T> {
  const spinner = ora(message).start();

  try {
    const result = await task();
    spinner.succeed(getSuccessMessage?.(result) ?? message);
    return result;
  } catch (error) {
    spinner.fail(message);
    throw error;
  }
}

export function createProgressSpinner(message: string) {
  const spinner = ora(message).start();

  return {
    update(message: string) {
      spinner.text = message;
    },
    succeed(message: string) {
      spinner.succeed(message);
    },
    fail(message: string) {
      spinner.fail(message);
    },
  };
}
