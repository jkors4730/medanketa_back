# SurveyQuestion CRUD

SurveyQuestion model and methods

## Create [POST]

```bash
/survey-question/
```

POST params (JSON-body):

```js
{
    // typeof Array, [Required*]
    "questions": [
        {
            "surveyId": 1,         // typeof <Number>, [Required*]
            "question": "q",       // typeof <String>, [Required*] Min 1 symbol
            "type": "text",        // typeof <String>, [Required*] Min 1 symbol
            "status": true,        // typeof <Boolean>,[Required*]

            "description": "test", // typeof <String>, [Optional] Min 1 symbol
            "data": ""             // typeof <String>, [Optional]
            "sortId": 0            // typeof <Number>, [Optional]
        }
    ]
}
```

## Get ALL [GET]

```bash
/survey-question/
```

GET (query params):

```bash
# surveyId | typeof <Number>
# get questions by surveyId
?surveyId=1
```

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
    "question": "q",       // typeof <String>, [Optional] Min 1 symbol
    "type": "text",        // typeof <String>, [Optional] Min 1 symbol
    "status": false        // typeof <Boolean>, [Optional]

    "description": "test", // typeof <String>, [Optional] Min 1 symbol
    "data": ""             // typeof <String>, [Optional] Min 1 symbol
    "sortId": 0            // typeof <Number>, [Optional] Min 1 symbol
}
```

## Delete [DELETE]

```bash
/survey-question/:id
```

GET params: Not provided
