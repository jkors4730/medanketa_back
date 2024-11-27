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