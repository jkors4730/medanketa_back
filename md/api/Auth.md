# Auth CRUD
### Auth model and methods
```bash
http://[host]:[port]/auth/...
```
## registration [POST]
```bash
/registration
```
[POST] params:
```bash
req.user: user typeof User
req.body.device: device typeof AuthUserDevices
```

## login [POST]
```bash
/login
```
```bash
req.user: user typeof User
req.body.device: device typeof AuthUserDevices
```

## login (admin) [POST]
```bash
/admin
```
```bash
req.user: user typeof User
req.body.device: device typeof AuthUserDevices
```
# <font color="#ADD8E6">Auth User Devices Model:</font>
```bash
@Column(type: integer, allowNull: false)
 userId : number
@Column(type: json[], allowNull: false, maxLength <= 4) 
 devices: [{
  deviceName: string;
  deviceModel: string;
  loginTime: Date();
}]
```
