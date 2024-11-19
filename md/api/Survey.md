# Survey CRUD

## Create [POST]

```bash
/survey/
```

POST params (JSON-body):
```js
{
    "userId": 1,        // typeof <Number>, [Required*]
    "image": "empty",   // typeof <String>, [Required*]
    "title": "test",    // typeof <String>, [Required*]
    "slug": "abc",      // typeof <String>, [Required*]
    "status": true,     // typeof <Boolean>, [Required*]

    "description": "test", // typeof String, [Optional]
    "expireDate": new Date(2020, 11, 31) // typeof Date, [Optional]
}
```

## Get ALL [GET]

```bash
/survey/
```

GET params: Not provided

## Get ONE [GET]

```bash
/survey/:id
```

GET params: Not provided

## Update [PUT]

```bash
/survey/:id
```

params (JSON-body):
```js
{
    "userId": 1,        // typeof <Number>, [Optional]
    "image": "empty",   // typeof <String>, [Optional]
    "title": "test",    // typeof <String>, [Optional]
    "slug": "abc",      // typeof <String>, [Optional]
    "status": true,     // typeof Boolean, [Optional]

    "description": "test", // typeof <String>, [Optional]
    "expireDate": new Date(2020, 11, 31) // typeof <Date>, [Optional]
}
```

## Delete [DELETE]

```bash
/survey/:id
```

GET params: Not provided