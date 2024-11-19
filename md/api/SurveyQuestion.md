# SurveyQuestion CRUD

## Create [POST]

```bash
/survey-question/
```

POST params (JSON-body):
```js
{
    "surveyId": 1,         // typeof <Number>, [Required*]
    "question": "q",       // typeof <String>, [Required*]
    "type": "text",        // typeof <String>, [Required*]

    "description": "test", // typeof <String>, [Optional]
    "data": ""             // typeof <String>, [Optional]
}
```

## Get ALL [GET]

```bash
/survey-question/
```

GET params: Not provided

## Get ONE [GET]

```bash
/survey-question/:id
```

GET params: Not provided

## Update [PUT]

```bash
/survey-question/:id
```

params (JSON-body):
```js
{
    "surveyId": 1,         // typeof <Number>, [Optional]
    "question": "q",       // typeof <String>, [Optional]
    "type": "text",        // typeof <String>, [Optional]

    "description": "test", // typeof <String>, [Optional]
    "data": ""             // typeof <String>, [Optional]
}
```

## Delete [DELETE]

```bash
/survey-question/:id
```

GET params: Not provided