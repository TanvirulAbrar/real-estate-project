# Authentication Endpoints Test Guide

## 1. User Registration
```bash
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "client"
}
```

## 2. Demo Login
```bash
POST /api/auth/demo-login
Content-Type: application/json

{
  "role": "client"
}
```

Response:
```json
{
  "message": "Demo credentials for client",
  "user": {
    "email": "user@example.com",
    "name": "Demo User",
    "role": "client",
    "is_demo": true
  },
  "credentials": {
    "email": "user@example.com",
    "password": "123456"
  }
}
```

## 3. Regular Login (using demo credentials)
```bash
POST /api/auth/signin
Content-Type: application/x-www-form-urlencoded

email=user@example.com&password=123456&redirect=false
```

## 4. Social Login
Google and GitHub providers are configured. Use NextAuth's built-in social login endpoints:
- `/api/auth/signin/google`
- `/api/auth/signin/github`

## 5. Get Current User
```bash
GET /api/auth/me
Authorization: Bearer <session_token>
```

## Demo Credentials
- **Client**: user@example.com / 123456
- **Agent**: agent@example.com / 123456  
- **Admin**: admin@example.com / 123456

## Frontend Integration
1. Call `/api/auth/demo-login` with desired role
2. Auto-fill login form with returned credentials
3. Call standard NextAuth signin with those credentials
4. User will be logged in with appropriate role
