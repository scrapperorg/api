// eslint-disable-next-line @typescript-eslint/no-namespace,@typescript-eslint/no-unused-vars
declare namespace Express {
  interface Request {
    user: Record<string, string | number>;
  }
}
