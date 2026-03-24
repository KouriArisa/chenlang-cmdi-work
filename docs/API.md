<!-- 备注：对应培训阶段 8（文档完善），关联设计文档第 7 节“API 设计”。 -->

# API 文档

## 通用约定

- Base URL：`http://localhost:3000`
- Content-Type：`application/json`
- 成功响应：`{ "success": true, "data": ... }`
- 失败响应：`{ "success": false, "error": { "code", "message" } }`

## 1. 健康检查

### 请求

- 路径：`/api/health`
- 方法：`GET`

### 响应示例

```json
{
  "success": true,
  "data": {
    "status": "ok",
    "time": "2026-03-24T12:00:00.000Z"
  }
}
```

## 2. 查询排行榜

### 请求

- 路径：`/api/scores`
- 方法：`GET`
- 查询参数：`limit`，可选，范围 `1-20`

### 响应示例

```json
{
  "success": true,
  "data": [
    {
      "id": "2f9ad6a8-d198-4f35-a111-6cbcf927314d",
      "playerName": "Arisa",
      "score": 120,
      "durationMs": 68400,
      "createdAt": "2026-03-24T12:10:11.000Z",
      "rank": 1
    }
  ]
}
```

## 3. 查询单条成绩

### 请求

- 路径：`/api/scores/:id`
- 方法：`GET`

### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "2f9ad6a8-d198-4f35-a111-6cbcf927314d",
    "playerName": "Arisa",
    "score": 120,
    "durationMs": 68400,
    "createdAt": "2026-03-24T12:10:11.000Z"
  }
}
```

## 4. 新增成绩

### 请求

- 路径：`/api/scores`
- 方法：`POST`

### 请求体

```json
{
  "playerName": "Arisa",
  "score": 120,
  "durationMs": 68400
}
```

### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "2f9ad6a8-d198-4f35-a111-6cbcf927314d",
    "playerName": "Arisa",
    "score": 120,
    "durationMs": 68400,
    "createdAt": "2026-03-24T12:10:11.000Z"
  }
}
```

## 5. 更新成绩昵称

### 请求

- 路径：`/api/scores/:id`
- 方法：`PATCH`

### 请求体

```json
{
  "playerName": "UpdatedName"
}
```

## 6. 删除成绩

### 请求

- 路径：`/api/scores/:id`
- 方法：`DELETE`

### 响应示例

```json
{
  "success": true,
  "data": {
    "id": "2f9ad6a8-d198-4f35-a111-6cbcf927314d",
    "playerName": "Arisa",
    "score": 120,
    "durationMs": 68400,
    "createdAt": "2026-03-24T12:10:11.000Z"
  }
}
```

## 7. 错误码

| 错误码 | 说明 |
|--------|------|
| `BAD_REQUEST` | 请求体格式错误 |
| `VALIDATION_ERROR` | 参数校验失败 |
| `NOT_FOUND` | 记录不存在 |
| `UNSUPPORTED_MEDIA_TYPE` | Content-Type 不是 `application/json` |
| `INTERNAL_SERVER_ERROR` | 服务内部错误 |
