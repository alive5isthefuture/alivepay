const express = require('express')
const app = express()
const port = 3000
const { XUMM_KEY, XUMM_SECRET } = process.env
var bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.get('/', async (req, res) => {
  res.send(req.params)
})

app.post('/xumm/init', async (req, res) => {
  // Generate the XUMM Payment Request and Send the Link.
  // In future we will add integrations to other XRP wallets. Customer will have a choice to select their wallet, 
  // and payment link will open that wallet in a seamless transcation.
  // via SMS to the customer

  const { amount, recepient, user_token } = req.body
  const reqUrl = await generateXummRequest(amount, recepient, user_token || '')
  if (reqUrl) {
    // Push this req Url to Alive5 SMS Provider or anyother third party SMS provider
    // Once the user access the url, it opens the XUMM mobile app and user authorize the transaction
    // Once the transaction is authorized /xumm/webhook endpoint will get response
  }
})

app.post('/xumm/webhook', async (req, res) => {
  // Process the Webhook Response and Save the user_token in database
  // for direct push notifications to the user's XUMM App

})

// Generate XUMM Payment Request
const generateXummRequest = async (amount, recepient, user_token) => {
  try {
    const Sdk = new XummSdk(XUMM_KEY, XUMM_SECRET)

    const newPayload = {
      txjson: {
        TransactionType: 'Payment',
        Amount: amount,
        Destination: recepient,
      },
      user_token: user_token
    }

    console.log(newPayload);

    const payload = Sdk.payload.createAndSubscribe(newPayload, e => {
      console.log(e.data)

      if (typeof e.data.signed !== 'undefined') {
        return e.data
      }
    })

    return (await payload).created.next.always;

  } catch (e) {
    console.log({ error: e.message, stack: e.stack })
  }
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})