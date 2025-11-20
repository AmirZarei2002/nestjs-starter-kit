export interface ICorsConfig {
  origin:
    | string[]
    | string
    | boolean
    | ((
        origin: string | undefined,
        callback: (err: Error | null, allow?: boolean) => void,
      ) => void);

  methods: string;
  preflightContinue: boolean;
  optionsSuccessStatus: number;
  credentials: boolean;
  allowedHeaders: string[];
}
