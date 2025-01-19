# Survey CRUD

Survey model and methods

## Create [POST]

```bash
/survey/
```

POST params (JSON-body):

```js
{
    "userId": 1,        // typeof <Number>, [Required*]
    "image": "empty",   // typeof <String>, [Required*] Min 1 symbol
    "title": "test",    // typeof <String>, [Required*] Min 1 symbol
    "slug": "abc",      // typeof <String>, [Required*] Min 1 symbol
    "status": true,     // typeof <Boolean>, [Required*]

    "access": false,     // typeof <Boolean>, [Optional]
    "description": "test", // typeof <String>, [Optional] Min 1 symbol
    "expireDate": new Date(2020, 11, 31), // typeof <Date>, [Optional]

    // typeof Array, [Optional]
    "questions": [
        {
            "question": "Новый вопрос №1", // typeof <String>, [Required* (if item provided)]
            "type": "text",                // typeof <String>, [Required* (if item provided)]
            "status": true,                // typeof <Boolean>,[Required* (if item provided)]

            "description": "t",             // typeof <String>, [Optional] Min 1 symbol
            "data": "t"                     // typeof <String>, [Optional] Min 1 symbol
        }
    ]
}
```

## Get ALL [GET]

```bash
/survey/
```

GET (query params):

```bash
# userId | typeof <Number>
# get surveys by userId
?userId=1
```

## Get ONE [GET]

```bash
/survey/:id
```

GET (query params):

```bash
# answers | typeof <Boolean>
# get survey answers
?answers=true
```

## Get by userId (Completed Surveys) [GET]

```bash
/survey/completed/user/:id
```

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
    "access": true,     // typeof Boolean, [Optional]

    "description": "test", // typeof <String>, [Optional]
    "expireDate": new Date(2020, 11, 31) // typeof <Date>, [Optional]
}
```

## Delete [DELETE]

```bash
/survey/:id
```

GET params: Not provided
