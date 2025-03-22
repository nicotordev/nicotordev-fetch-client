import { FetchClientError } from "./errors";

/**
 * FetchClient is a lightweight HTTP client wrapper around the Fetch API,
 * providing automatic error handling and JSON serialization for complex data.
 */
export default class FetchClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  /**
   * Recursively transforms complex values (Date, BigInt, Map, Set) to be safely JSON-serialized.
   * Also detects and handles circular references.
   */
  private transformObjectForSerialization<P = unknown, T = unknown>(
    obj: P,
    seen: WeakSet<object> = new WeakSet()
  ): T {
    if (typeof obj === "bigint") {
      return obj.toString() as T;
    } else if (obj instanceof Date) {
      return obj.toISOString() as T;
    } else if (obj instanceof Map) {
      return {
        type: "Map",
        value: Array.from(obj.entries()).map(([key, value]) => [
          this.transformObjectForSerialization(key, seen),
          this.transformObjectForSerialization(value, seen),
        ]),
      } as T;
    } else if (obj instanceof Set) {
      return {
        type: "Set",
        value: Array.from(obj).map((item) =>
          this.transformObjectForSerialization(item, seen)
        ),
      } as T;
    } else if (obj === null || typeof obj !== "object") {
      return obj as unknown as T;
    }

    if (seen.has(obj)) {
      return "[Circular Reference]" as T;
    }
    seen.add(obj);

    if (Array.isArray(obj)) {
      return obj.map((item) =>
        this.transformObjectForSerialization(item, seen)
      ) as T;
    } else {
      return Object.fromEntries(
        Object.entries(obj).map(([key, value]) => [
          key,
          this.transformObjectForSerialization(value, seen),
        ])
      ) as T;
    }
  }

  /**
   * Handles the fetch response, throwing a custom FetchClientError if the response is not ok.
   */
  private async handleResponse<T>(
    response: Response,
    config: RequestInit
  ): Promise<T> {
    const contentType = response.headers.get("Content-Type") || "";
    const isJson = contentType.includes("application/json");

    const dataReceived = isJson ? await response.json() : await response.text();

    if (!response.ok) {
      throw new FetchClientError("Fetch error", {
        config,
        code: `${response.status}`,
        request: undefined,
        response,
        data: dataReceived,
      });
    }

    return dataReceived as T;
  }

  /**
   * Performs a GET request.
   */
  public async get<T = unknown>(
    endpoint: string,
    config: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = { ...config.headers };
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        method: "GET",
        headers,
      });
      return await this.handleResponse<T>(response, config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Performs a POST request with a JSON body.
   */
  public async post<T = unknown>(
    endpoint: string,
    data: any,
    config: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        method: "POST",
        headers,
        body: JSON.stringify(this.transformObjectForSerialization(data)),
      });

      return await this.handleResponse<T>(response, config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Performs a PUT request with a JSON body.
   */
  public async put<T = unknown, P = unknown>(
    endpoint: string,
    data: P,
    config: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        method: "PUT",
        headers,
        body: JSON.stringify(this.transformObjectForSerialization(data)),
      });

      return await this.handleResponse<T>(response, config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Performs a DELETE request.
   */
  public async delete<T = unknown>(
    endpoint: string,
    config: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = { ...config.headers };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        method: "DELETE",
        headers,
      });

      return await this.handleResponse<T>(response, config);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Performs a PATCH request with a JSON body.
   */
  public async patch<T = unknown, P = unknown>(
    endpoint: string,
    data: P,
    config: RequestInit = {}
  ): Promise<T> {
    try {
      const headers = {
        ...config.headers,
        "Content-Type": "application/json",
      };

      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...config,
        method: "PATCH",
        headers,
        body: JSON.stringify(this.transformObjectForSerialization(data)),
      });

      return await this.handleResponse<T>(response, config);
    } catch (error) {
      throw error;
    }
  }
}
