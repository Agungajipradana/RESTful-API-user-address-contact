# User API Spec

## Register API Spec

Endpoint : POST /api/users

Request Body :

```json
{
  "username": "aji",
  "password": "rahasia",
  "name": "Agung Aji"
}
```

Response Body Success :

```json
{
  "data": {
    "username": "aji",
    "name": "Agung Aji"
  }
}
```

Response Body Error :

```json
{
  "errors": "Username already registered"
}
```

## Login API Spec

Endpoint : POST /api/users/login

Request Body :

```json
{
  "username": "aji",
  "password": "rahasia"
}
```

Request Body Success :

```json
{
  "data": {
    "token": "unique-token"
  }
}
```

Request Body Error :

```json
{
  "errors": "Username or password wrong"
}
```

## Update API Spec

Endpoint : PATCH /api/users/current

Headers :

- Authorization : token

Request Body :

```json
{
  "name": "Agung Aji Lagi", // optional
  "password": "new password" //optional
}
```

Response Body Success :

```json
{
  "data": {
    "username": "aji",
    "name": "Agung Aji Lagi"
  }
}
```

Response Body Error :

```json
{
  "errors": "Name length max 100"
}
```

## Get API Spec

Endpoint : GET

Headers :

- Authorization : token

Response Body Success:

```json
{
  "data": {
    "username": "aji",
    "name": "Agung Aji"
  }
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```

## Logout API Spec

Endpoint : DELETE /api/users/logout

Headers :

- Authorization : token

Response Body Success :

```json
{
  "data": "OK"
}
```

Response Body Error :

```json
{
  "errors": "Unauthorized"
}
```
