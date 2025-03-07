# Upload CRUD

File upload methods

## Create [POST] (FormData)

```bash
/upload/
```

POST params (form-data):

```js
{
    "file": "", // typeof <Binary>, [Required*]
}
```

## Create [POST] (Base64)

```bash
/upload/base64
```

POST params (JSON-body):

```js
{
    "file": "", // typeof <String>, [Required*]
    "name": "", // typeof <String>, [Required*]
}
```

## Delete [DELETE]

```bash
/upload/:url
```

GET params: Not provided
