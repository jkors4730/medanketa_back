# Survey CRUD

## Create [POST]

```bash
/survey/
```

POST params (JSON-body):
```javascript
{
    "user_id": "1",     // typeof number, required*
    "image": "empty",   // typeof string, required*
    "title": "test",    // typeof string, required*
    "slug": "abc",      // typeof string, required*
    "status": "true",   // typeof boolean, required*

    "description": "test", // typeof string, optional
    "expire_date": new Date(2020, 11, 31) // typeof Date, optional
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
```javascript
{
    "user_id": "1",     // typeof number, optional
    "image": "empty",   // typeof string, optional
    "title": "test",    // typeof string, optional
    "slug": "abc",      // typeof string, optional
    "status": "true",   // typeof boolean, optional

    "description": "test", // typeof string, optional
    "expire_date": new Date(2020, 11, 31) // typeof Date, optional
}
```

## Delete [DELETE]

```bash
/survey/:id
```

GET params: Not provided