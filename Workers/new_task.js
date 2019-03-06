#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = "task_queue";
    var msg = process.argv.slice(2).join(" ") || "Hello World!";
    // Making Queue Durable, ensures the queue do not gets lost on rabbit mq server restart
    ch.assertQueue(q, { durable: true });

    // Making Message Persistent, ensures that message do not gets lost on rabbit mq server restart
    ch.sendToQueue(q, new Buffer(msg), { persistent: true });
    console.log(" [x] Sent '%s'", msg);
  });
  setTimeout(function() {
    conn.close();
    process.exit(0);
  }, 500);
});
