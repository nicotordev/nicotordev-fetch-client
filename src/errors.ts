class FetchClientError<T = any> extends Error {
  public config?: RequestInit;
  public code?: string;
  public request?: Request;
  public response?: Response;
  public isAxiosError: boolean;
  public data: T;

  constructor(
    message: string,
    options: {
      config?: RequestInit;
      code?: string;
      request?: Request;
      response?: Response;
      data: T;
    }
  ) {
    super(message);
    this.name = "FetchClientError";
    this.config = options.config;
    this.code = options.code;
    this.request = options.request;
    this.response = options.response;
    this.data = options.data;
    this.isAxiosError = true; // para que puedas detectar errores al estilo axios
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      config: this.config,
      request: this.request,
      response: this.response,
      data: this.data,
    };
  }
}

export { FetchClientError };
