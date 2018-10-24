const {RippleAPI} = require('ripple-lib')

// Test Net accounts
const wallets = {
  "a": {
    "address": "rKsdkGhyZH6b2Zzd5hNnEqSv2wpznn4n6N",
    "secret": "ssn95weHThkzNMZjmWJrtB68Bsd75"
  },
  "b": {
    "address": "rPEJ5n5NnfiqNjWouxmyoX1vJNuRivwUSj",
    "secret": "snTwY9wi8jMvn4hfpthp6anqrFPpS"
  }
}

const api = new RippleAPI({server: 'wss://s.altnet.rippletest.net:51233'})

async function DepositPreauth() {
  await api.connect()

  let res = await api.request('deposit_authorized', {
    source_account: wallets.b.address,
    destination_account: wallets.a.address
  })

  console.log(JSON.stringify(res, null, 2))

  const tx = await api.prepareTransaction({
    TransactionType: 'DepositPreauth',
    Account: wallets.a.address,
    Authorize: wallets.b.address
  })
  console.log('tx', tx)
  const signed = api.sign(tx.txJSON, wallets.a.secret)
  console.log('signed', signed)

  const response = await api.submit(signed.signedTransaction)
  console.log(response)

  await sleep(5000)

  const status = await api.getTransaction(signed.id)
  console.log('status', JSON.stringify(status, null, 2))

  // process.exit(0)
}

function sleep(ms) {
  return new Promise(resolve => {
      setTimeout(resolve, ms)
  })
}

DepositPreauth()
