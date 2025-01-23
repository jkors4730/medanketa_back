# DictValue API

DictValue model and methods

## Create [POST]

```bash
/dict-values
```

POST params (JSON-body):

```js
{
    
    "value": "test",     // typeof <String>, [Required*] Min 1 symbol
    "dictId": 1,         // typeof <Number>, [Required*]
    "sortId": 0,         // typeof <Number>, [Optional]
}
```

## Get DictValue By Id [GET]

```bash
/dict-values/:id
```

GET params: Not provided

## Get DictValues by DictId and Query (Pagination) [GET]

```bash
/dict-values/dict/:id
```

GET (query params):

```bash
# q - (query) typeof <String>
# page - typeof <Number>
# size - typeof <Number>
?q=text&page=1&size=20
```

## Update [PUT]

```bash
/dict-values/:id
```

params (JSON-body):

```js
{
    "value": "test",    // typeof <String>, [Optional]
    "dictId": "test",   // typeof <String>, [Optional]
    "sortId": 0,        // typeof <Number>, [Optional]
}
```

## Delete [DELETE]

```bash
/dict-values/:id
```

GET params: Not provided
