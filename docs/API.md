# API Documentation - Fecha Ferida IA

## Base URL
```
http://localhost:3001/api
```

## Authentication

### POST /auth/register
Registra um novo usuário no sistema.

**Request Body:**
```json
{
  "name": "string",
  "email": "string",
  "password": "string",
  "specialty": "string",
  "crm": "string",
  "institution": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Usuário registrado com sucesso",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "specialty": "string",
    "crm": "string",
    "institution": "string"
  },
  "token": "string"
}
```

### POST /auth/login
Autentica um usuário existente.

**Request Body:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login realizado com sucesso",
  "user": {
    "id": "number",
    "name": "string",
    "email": "string",
    "specialty": "string",
    "crm": "string",
    "institution": "string"
  },
  "token": "string"
}
```

## Patients

### GET /patients
Lista todos os pacientes (com paginação).

**Query Parameters:**
- `page` (optional): Número da página (default: 1)
- `limit` (optional): Itens por página (default: 10)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "patients": [
    {
      "id": "number",
      "name": "string",
      "age": "number",
      "gender": "string",
      "medical_history": "string",
      "created_at": "string",
      "updated_at": "string"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### GET /patients/:id
Busca um paciente específico por ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "patient": {
    "id": "number",
    "name": "string",
    "age": "number",
    "gender": "string",
    "medical_history": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### POST /patients
Cria um novo paciente.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "age": "number",
  "gender": "string",
  "medical_history": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Paciente criado com sucesso",
  "patient": {
    "id": "number",
    "name": "string",
    "age": "number",
    "gender": "string",
    "medical_history": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### PUT /patients/:id
Atualiza um paciente existente.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "string",
  "age": "number",
  "gender": "string",
  "medical_history": "string"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Paciente atualizado com sucesso",
  "patient": {
    "id": "number",
    "name": "string",
    "age": "number",
    "gender": "string",
    "medical_history": "string",
    "created_at": "string",
    "updated_at": "string"
  }
}
```

### DELETE /patients/:id
Remove um paciente.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Paciente removido com sucesso"
}
```

## Analyses

### POST /analyze
Analisa uma imagem de ferida com IA.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body (FormData):**
- `image`: File (imagem da ferida)
- `patientContext`: String (JSON com contexto do paciente)

**Response:**
```json
{
  "success": true,
  "analysis": "string",
  "imageUrl": "string",
  "timestamp": "string",
  "analysisId": "number"
}
```

### GET /analyses
Lista análises do usuário (com paginação).

**Query Parameters:**
- `page` (optional): Número da página (default: 1)
- `limit` (optional): Itens por página (default: 10)

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analyses": [
    {
      "id": "number",
      "image_url": "string",
      "analysis_result": "string",
      "patient_context": "string",
      "created_at": "string"
    }
  ],
  "pagination": {
    "page": "number",
    "limit": "number",
    "total": "number",
    "totalPages": "number"
  }
}
```

### GET /analyses/:id
Busca uma análise específica.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analysis": {
    "id": "number",
    "image_url": "string",
    "analysis_result": "string",
    "patient_context": "string",
    "created_at": "string"
  }
}
```

### DELETE /analyses/:id
Remove uma análise específica.

**Headers:**
```
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "message": "Análise removida com sucesso"
}
```

### DELETE /analyses/bulk
Remove múltiplas análises.

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "ids": ["number", "number", ...]
}
```

**Response:**
```json
{
  "success": true,
  "message": "X análises removidas com sucesso",
  "deletedCount": "number"
}
```

## Error Responses

Todos os endpoints podem retornar os seguintes erros:

### 400 Bad Request
```json
{
  "success": false,
  "message": "Dados inválidos",
  "errors": ["array de erros específicos"]
}
```

### 401 Unauthorized
```json
{
  "success": false,
  "message": "Token não fornecido" | "Token inválido"
}
```

### 404 Not Found
```json
{
  "success": false,
  "message": "Recurso não encontrado"
}
```

### 500 Internal Server Error
```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

## Rate Limiting

A API possui rate limiting configurado:
- **Limite:** 100 requisições por 15 minutos por IP
- **Headers de resposta:**
  - `X-RateLimit-Limit`: Limite total
  - `X-RateLimit-Remaining`: Requisições restantes
  - `X-RateLimit-Reset`: Timestamp do reset

## File Upload

### Restrições de Upload
- **Tamanho máximo:** 10MB
- **Tipos permitidos:** JPG, JPEG, PNG, GIF, WEBP
- **Pasta de destino:** `/backend/uploads/`

### Formato do nome do arquivo
```
image-{timestamp}-{random}.{extension}
```