'use strict';

// Load modules
const Hapi = require('hapi');
const Hoek = require('hoek');
const Mobeeus = require('../../lib');

const Simple = require('./queues/simple');
const Server = require('./queues/server');

const server = new Hapi.Server();
server.connection({ port: 3000 });

const mobeeus = {
    register: Mobeeus,
    options: {

        // Register the two queues on the server.
        register: [Simple, Server],

        // State can be an object or a function that returns
        // an object.  State is provided as the 'context' to
        // a task or a job.
        state: (done) => {

            return done(null, { subject: 'Server' });
        }
    }
};

// Register the plugin.
server.register(mobeeus, (err) => {

    Hoek.assert(!err, err);

    // Start the server.
    server.start((err) => {

        Hoek.assert(!err, err);

        // Dispatch 'simple-task' from the server.
        server.dispatcher.task('simple-task', { greeting: 'Hello from the' }, (err) => {

            Hoek.assert(!err, err);
            setTimeout(() => {

                server.stop((err) => {

                    Hoek.assert(!err, err);
                });
            }, 500);
        });
    });
});
