# alivepay

AlivePay is the ability to take payments over any chat channel to accelerate the sales process. For this project, we're developing endpoints for transacting with multiple wallets (starting with XUMM) and multiple chat communication channels (starting with live chat, SMS).


# usage

```
npm install
npm start // Application will start at port 3000
```

# flow

`POST /xumm/init` endpoint generates a rquest for the payment from XUMM API and then sends the generated link to the user provided in the body.

`POST /xumm/webhook` endpoint gets the response from the XUMM API once the user approve / reject the authorization / payment request. On approval the user's token will be stored in databsae for future push notifications directly to the XUMM app.
