const config = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId
}
var firebase = require("firebase/app");
require("firebase/storage");
require("firebase/firestore");

if (!firebase.apps.length) {
  firebase.initializeApp(config);
}

const express = require('express')
const next = require('next')
const open = require('open')
const nextI18NextMiddleware = require('next-i18next/middleware').default
const nextI18next = require('./i18n')
const uuidv1 = require('uuid/v1');
const nodeMailer = require('nodemailer');

const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.prepare()
  .then(() => {
    const server = express()
    server.use(require("body-parser").text());
    server.use(require("body-parser").json());
    server.use(express.static('static'));
    server.use(nextI18NextMiddleware(nextI18next))
    

    server.post("/feedback", async (req, res) => {
      const firestoreRef = firebase.firestore();
      console.log(req.body);
      var feedback = {
        rating: req.body.rating, 
        time: new Date().toISOString()
      };
      if(!!req.body.feedback) {
        feedback.feedback = req.body.feedback;
      }
      firestoreRef.collection("Feedback").doc(req.body.videoName).collection("Feedback").doc(req.body.id).set(feedback);
      res.json({status: true});
    });

    //Stripe Payment
    server.post("/charge", async (req, res) => {
      try {
        if(req.body.paymentType == 'card') {
          response = await stripe.charges.create({
            amount: req.body.total,
            currency: "thb",
            description: `A video from ${req.body.creator} to ${req.body.for}`,
            source: req.body.token,
            metadata: {
              creator: req.body.creator,
              tip: req.body.tip,
              line: req.body.line,
              for: req.body.for,
              details: req.body.details
            }
          });
        const firestoreRef = firebase.firestore();
        firestoreRef.collection("Orders").doc(response.id).set({...req.body, stripeId: response.id});
        var status = response.status;
        res.json({status});
        }
        else {
          const firestoreRef = firebase.firestore();
          var response = {id: "tr_" + uuidv1()};
          firestoreRef.collection("Orders").doc(`${response.id}`).set({...req.body, stripeId: null});
          res.json({status: response.id});
        }
        let transporter = nodeMailer.createTransport({
          host: 'smtp.gmail.com',
          port: 465,
          secure: true,
          auth: {
            // should be replaced with real sender's account
            user: process.env.ORDER_EMAIL,
            pass: process.env.ORDER_EMAIL_PASSWORD
          }
        });
        let mailOptions = {
          to: process.env.ORDER_EMAIL,
          subject: "Theres a new order!",
          text: JSON.stringify({
            creator: req.body.creator,
            line: req.body.line,
            for: req.body.for,
            details: req.body.details,
            paymentType: req.body.paymentType,
            id: response.id,
            makePublic: req.public
          }),
          html: `
            <p><strong style="width: 65px;" style="width: 65px;">Creator:</strong> ${req.body.creator}</p>
            <p><strong style="width: 65px;">Email:</strong> ${req.body.email}</p>
            <p><strong style="width: 65px;">Line:</strong> ${req.body.line}</p>
            <p><strong style="width: 65px;">Name: </strong> ${req.body.for}</p>
            <p><strong style="width: 65px;">Details: </strong> ${req.body.details}</p>
            <p><strong style="width: 65px;" style="width: 65px;">Allow Public:</strong> ${req.body.public}</p>
            <p><strong style="width: 65px;">Payment: </strong> ${req.body.paymentType}</p>
            <p><strong style="width: 65px;">ID: </strong> ${response.id}</p>
          `
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            return console.log(error);
          }
        });
      } catch (err) {
        console.log(err);
        res.statusMessage = err.raw.message;
        res.status(400).end();
      }
    });


    server.get('/video/:firebaseHash', (req, res) => {
      const queryParams = { hash: req.params.firebaseHash};
      return app.render(req, res, "/video", queryParams)
    })
    server.get('/profile/:creator', (req, res) => {
      const queryParams = { creator: req.params.creator, stripeKey: process.env.STRIPE_PUB_KEY};
      return app.render(req, res, "/creator-profile", queryParams)
    })
    server.get('/checkout/:name', (req, res) => {
      const queryParams = { name: req.params.name, stripeKey: process.env.STRIPE_PUB_KEY};
      return app.render(req, res, "/checkout", queryParams)
    })
    server.get('*', (req, res) => {
      return handle(req, res)
    })

    var port = process.env.PORT || 5000;

    server.listen(port, (err) => {
      if (err) throw err
      console.log('> Ready on http://localhost:5000')
    })
  })
  .catch((ex) => {
    console.error(ex.stack)
    process.exit(1)
  })