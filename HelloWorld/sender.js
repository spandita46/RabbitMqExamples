#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = "hello";
    var msg = "Hello World!";

    // Queue Will Lost on RabbitMq restart
    ch.assertQueue(q, { durable: false });

    // Not Persistent Message
    ch.sendToQueue(q, Buffer.from(msg));
    console.log(" [x] Sent %s", msg);
  });
  setTimeout(function() {
    conn.close();
    process.exit(0);
  }, 500);
});
