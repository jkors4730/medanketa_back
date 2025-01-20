# Dicts API

Dicts model and methods

## Create [POST]

```bash
/dicts
```

POST params (JSON-body):

```js
{
    
    "title": "empty",   // typeof <String>, [Required*] Min 1 symbol
    "common": true,      // typeof <Boolean>, [Required*]
    "status": true,     // typeof <Boolean>, [Required*]
    "userId": 1,        // typeof <Number>, [Required*]
}
```

## GetAll [GET]

```bash
/dicts
```

GET params: Not provided

## Get Values by Id and Query [GET]

```bash
/dicts/:id
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

GET params: Not provided
