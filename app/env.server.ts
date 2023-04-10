import invariant from "tiny-invariant";
/**
 * to make env accessible on the client
 * @returns
 */
export function getEnv() {
  invariant(process.env.APP_TITLE, "APP_TITLE should be defined");
  return {
    APP_TITLE: process.env.APP_TITLE,
  };
}

type ENV = ReturnType<typeof getEnv>;

declare global {
  var ENV: ENV;
}
