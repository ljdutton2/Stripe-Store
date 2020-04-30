if(process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

const stripeSecretKey = process.env.stripeSecretKey
const stripePublicKey = process.env.STRIPE_PUBLIC_KEY

const express = require('express')
const app = express()
const fs = require('fs')
const stripe = require('stripe')

app.set('view engine', 'ejs')
app.use(express.static('public'))
app.use(express.json())

app.get('/store', function(req,res) {
    fs.readFile('items.json', function(error,data){
        if (error) {
            res.status(500).end()
        } else {
            res.render('store.ejs',{
                stripePublicKey: stripePublicKey,
                items: JSON.parse(data)
                
            })
        }
    })

})
app.post('/purchase', function(req,res) {
    fs.readFile('items.json', function(error,data){
        if (error) {
            res.status(500).end()
        } else {
            const itemsJson = JSON.parse(data)
            const itemsArray = itemsJson.music.concat(itemsJson.merch)
            let total = 0
            req.body.items.ForEach(function(item) {
                const itemJson = itemsArray.find(function(i) {
                    return i.id == item.id

                })
                total = total + itemJson.price * item.quantity
            })
            stripe.charges.create({
                amount:total,
                source: req.body.stripeTokenId,
                currency: 'usd'
            }).then(function(){
                res.json({message: 'success' })

            }).catch(err){
                console.log(err.message)
            }

            })
            
                
            })
        }
    })

})

app.listen(3000)