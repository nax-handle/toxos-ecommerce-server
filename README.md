<h1 align="center">Curxor - E-commerce</h1>

## 🚀 Project Overview

**Curxor**

## 🏆 Key Features

- Multi-strategy login (Email, Social, etc.)
- OTP-based email verification
- JWT Access and Refresh Token support
- Role-based Access Control (RBAC)
- Modular, Extensible, and Easy to Integrate

## 🏛️ Design Patterns Used

| Pattern           | Purpose                                                                | Application Example                                |
| ----------------- | ---------------------------------------------------------------------- | -------------------------------------------------- |
| Factory Pattern   | Create different login strategies based on user input                  | `LoginStrategyFactory` for Email, Google, etc.     |
| Strategy Pattern  | Define and switch between different authentication methods dynamically | `EmailLoginStrategy`, `GoogleLoginStrategy`        |
| Decorator Pattern | Extend functionalities without modifying existing structures           | `@Roles()` decorator for role-based access control |

## 🧑‍💻 Tech Stack

- **NestJS** - Backend Framework
- **TypeScript** - Strongly Typed Language
- **MySQL** - Relational Database
- **MongoDB** - NoSQL Database

- **Redis** - In-memory Data Store
- **JWT** - Token Authentication

## 📦 Project Structure

```
src/
│
├── common/                 # Shared utilities
│   ├── decorators/         # Custom decorators (e.g., @Roles)
│   ├── guards/             # Guards (e.g., AuthGuard, RolesGuard)
│   └── ...
│
├── modules/
│   ├── auth/               # Authentication Module
│   ├── user/               # User Module
│   ├── email/              # Email Service Module
│   └── ...
│
├── config/                 # Configurations (e.g., DB, API Keys)
└── utils/                  # Helper Functions
```

## ⚙️ Installation

```bash
npm install
npm run start
```

## 🧪 Running Tests

```bash
npm run test
```

## 📄 License

This project is licensed under the MIT License.

---

<p align="center">
  <img src="https://upload.wikimedia.org/wikipedia/commons/a/a7/NestJS.svg" alt="NestJS Logo" width="200" />
</p>

🌟 **Contributions are welcome!** Feel free to submit a pull request or open an issue.
