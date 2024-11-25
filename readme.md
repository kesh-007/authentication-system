# Authentication Backend with Role-Based Access Control and Token Versioning

## **Overview**
This project is a robust authentication backend built with TypeScript and modern industry standards. It provides essential features like user registration, login, and password change while incorporating advanced functionalities like role-based access control (RBAC) and token versioning for enhanced security. The backend ensures that if a user changes their password, all active sessions on other devices or systems are invalidated.

---

## **Features**
### **1. User Authentication**
- **Registration**: Allows users to register with their email, password, role, and name.
- **Login**: Authenticates users with email and password, returning a secure JSON Web Token (JWT).
- **Password Change**: Users can securely change their passwords, automatically invalidating all existing tokens.

### **2. Role-Based Access Control (RBAC)**
- Enables different levels of access based on user roles (e.g., `admin`, `user`,`moderator`, etc.).
- Middleware ensures that only authorized roles can access specific routes.

### **3. Token Versioning**
- Enhances token-based authentication by associating a `tokenVersion` with each user.
- When a user changes their password, the `tokenVersion` increments, invalidating all previously issued tokens.

### **4. Security**
- Secure password hashing using `bcrypt`.
- JWT for stateless and scalable authentication.
- Environment-based configuration for secrets and sensitive data.

---

## **Technologies Used**
- **TypeScript**: Strongly-typed language for writing robust and maintainable code.
- **Express.js**: Lightweight and flexible Node.js web framework.
- **Drizzle ORM**: Simple and type-safe SQL query builder.
- **JWT (jsonwebtoken)**: Secure token generation and validation.
- **bcrypt**: Library for hashing and comparing passwords.

---
