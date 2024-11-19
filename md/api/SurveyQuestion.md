# SurveyQuestion CRUD

## Create [POST]

```bash
/survey-question/
```

POST params (JSON-body):
```js
{
    "surveyId": "1",     // typeof number, required*
    "question": "",       // typeof string, required*
    "type": "text",       // typeof string, required*

    "description": "test", // typeof string, optional
    "data": ""            // typeof string, optional
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
    "surveyId": "1",     // typeof number, optional
    "question": "",       // typeof string, optional
    "type": "text",       // typeof string, optional

    "description": "test", // typeof string, optional
    "data": ""             // typeof string, optional
}
```

## Delete [DELETE]

```bash
/survey-question/:id
```

GET params: Not provided