# Dict API

Dicts model and methods

## Create [POST]

```bash
/dicts
```

POST params (JSON-body):

```js
{
    
    "title": "empty",      // typeof <String>, [Required*] Min 1 symbol
    "description": "desc", // typeof <String>, [Required*] Min 1 symbol
    "common": true,        // typeof <Boolean>, [Required*]
    "status": true,        // typeof <Boolean>, [Required*]
    "userId": 1,           // typeof <Number>, [Required*]

    // typeof Array, [Optional]
    "values": [
        {
            "value": "text",  // typeof <String>, [Optional]
            "sortId": 1       // typeof <Number>, [Optional]
        }
    ]
}
```

## Get Dict By Id [GET]

```bash
/dicts/:id
```

GET params: Not provided

## Get Values by Id and Query [GET]

```bash
/dicts/values/:id
```

GET (query params):

```bash
# q | typeof <String>
# filter by query
?q=text
```

## GetByUser [GET]

```bash
/dicts/user/:id
```

GET (query params):

```bash
# page - typeof <Number>
# size - typeof <Number>
?page=1&size=20
```

## Update [PUT]

```bash
/dicts/:id
```

params (JSON-body):

```js
{
    "title": "test",       // typeof <String>, [Optional]
    "description": "test", // typeof <String>, [Optional]
    "common": true,        // typeof Boolean, [Optional]
    "status": true,        // typeof Boolean, [Optional]
    "userId": 1,           // typeof Number, [Optional]
}
```

## Delete [DELETE]

```bash
/dicts/:id
```

GET params: Not provided
