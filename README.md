# FetchClient

A lightweight, extensible HTTP client built around the native Fetch API, with custom error handling and advanced JSON serialization support. Designed as a simplified alternative to Axios.

## 🚀 Features

- ✅ Custom `FetchClientError` with Axios-style properties
- 🔁 Automatic serialization of complex types (`Date`, `BigInt`, `Map`, `Set`)
- 🔄 Circular reference detection
- 💥 Centralized error handling
- 🧪 Fully typed with TypeScript

---

## 📦 Installation

```bash
npm install
# or
yarn install
```

This module assumes you are using it within a TypeScript project.

---

## 🛠 Usage

### Initialization

```ts
import FetchClient from "./FetchClient";

const api = new FetchClient("https://api.example.com");
```

### Example Requests

#### GET

```ts
const data = await api.get("/users");
```

#### POST

```ts
const newUser = await api.post("/users", {
  name: "Nico",
  createdAt: new Date(),
});
```

#### PUT / PATCH

```ts
await api.put("/users/123", { name: "Updated Name" });
await api.patch("/users/123", { name: "Partial Update" });
```

#### DELETE

```ts
await api.delete("/users/123");
```

---

## ❗ Error Handling

All failed responses (non-2xx status codes) throw a `FetchClientError`, which mimics the structure of an Axios error:

```ts
try {
  await api.get("/fail");
} catch (err) {
  if (err instanceof FetchClientError) {
    console.error("Error status:", err.response?.status);
    console.error("Response data:", err.data);
    console.error("Request config:", err.config);
  }
}
```

---

## 🔧 Advanced Serialization

Supports:

- `Date` → ISO string
- `BigInt` → string
- `Map` / `Set` → serializable object format
- Circular references → safely replaced with `"[Circular Reference]"`

---

## 📄 License

MIT

---

## ✍️ Author

Created by [Your Name].
