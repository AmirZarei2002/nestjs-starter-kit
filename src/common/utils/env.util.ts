export const getEnvArray = (envVar: string, fallback: string[]): string[] =>
  process.env[envVar]?.split(',') ?? fallback;
