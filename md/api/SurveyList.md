# SurveyList CRUD

List of completed surveys (by userId)

## Create [POST]

```bash
/survey-list/
```

POST params (JSON-body):
```js
{
    "userId": 1,        // typeof <Number>, [Required*]
    "surveyId": 1       // typeof <Number>, [Required*] 

    "privacy": false    // typeof <Boolean>, [Optional] 

    "tsStart": "2024-12-04T12:15:17.416Z"  // typeof <Timestamp>, [Optional] new Date().toISOString()
    "tsEnd": "2024-12-04T12:15:17.416Z"    // typeof <Timestamp>, [Optional] new Date().toISOString()

    // typeof Array, [Optional]
    "answers": [
        {
            "id": 1,            // typeof <Number>, [Optional]
            "answer": "text"    // typeof <String>, [Optional]
        }
    ]
}
```

## Get ALL [GET]

```bash
/survey-list/
```

GET (query params):

```bash
# userId | typeof <Number>
# filter by userId
?userId=1
```