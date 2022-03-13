# YangForm Backend

### Auth

| PATH | METHOD | OPERATION | STATUS |
| --- | --- | --- | --- |
| /auth/register | POST | Registers a User | 200,OK |
| /auth/login | POST | Logins a User | 200,OK |

### FormData

| PATH | METHOD | OPERATION | STATUS |
| --- | --- | --- | --- |
| /formdata/recent | GET | Get Recent FormData | 200,OK |
| /formdata/recent/:id | GET | Get recent formdata with :id data | 200,OK |

### Form Submit

| PATH | METHOD | OPERATION | STATUS |
| --- | --- | --- | --- |
| /formsubmit/add | POST | Submit Form  | 200,OK |