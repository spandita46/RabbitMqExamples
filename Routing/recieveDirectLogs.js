#!/usr/bin/env node

var amqp = require("amqplib/callback_api");

var args = process.argv.slice(2);

if (args.length == 0) {
  console.log("Usage: receive_logs_direct.js [info] [warning] [error]");
  process.exit(1);
}

// Connect To RabbitMq
amqp.connect("amqp://localhost", function(err, conn) {
  // Create Channel
  conn.createChannel(function(err, ch) {
    var ex = "direct_logs";

    // Creating Non durable Direct Type Exchange
    ch.assertExchange(ex, "direct", { durable: false });

    // Creating a non-durable queue with a generated name for each instance by providing empty string as queue name
    // Exclusive flag will tell the rabbit mq to delete this queue when the instance of consumer is closed
    ch.assertQueue("", { exclusive: true }, function(err, q) {
      console.log(" [*] Waiting for logs. To exit press CTRL+C");

      args.forEach(function(severity) {
        // Binding queue to exchange with keys - Only Queue with matching binding key will recieve message
        ch.bindQueue(q.queue, ex, severity);
      });

      ch.consume(
        q.queue,
        function(msg) {
          console.log(
            " [x] %s: '%s'",
            msg.fields.routingKey,
            msg.content.toString()
          );
        },
        { noAck: true }
      );
    });
  });
});
