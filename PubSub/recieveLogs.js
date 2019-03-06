#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

amqp.connect("amqp://localhost", function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = "logs";

    // Creating Non durable Fanout Type Exchange
    ch.assertExchange(ex, "fanout", { durable: false });

    // Creating a non-durable queue with a generated name for each instance by providing empty string as queue name
    // Exclusive flag will tell the rabbit mq to delete this queue when the instance of consumer is closed
    ch.assertQueue("", { exclusive: true }, function(err, q) {
      console.log(
        " [*] Waiting for messages in %s. To exit press CTRL+C",
        q.queue
      );

      // Binding queue to exchange with key "" - key is ignored for fanout exchanges
      ch.bindQueue(q.queue, ex, "");

      ch.consume(
        q.queue,
        function(msg) {
          if (msg.content) {
            console.log(" [x] %s", msg.content.toString());
          }
        },
        { noAck: true }
      );
    });
  });
});
