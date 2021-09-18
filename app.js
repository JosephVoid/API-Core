const express = require('express'),
	app = express(),
	{ ApolloServer } = require('apollo-server-express'),
	{ mergeSchemas } = require('graphql-tools'),
	{ getIntrospectSchema } = require('./introspection');

const endpoints = [
	// 'https://sebsib-api-v2.herokuapp.com/graphql/',
	'http://localhost:4024/graphql',
	'https://text-auth-twilio.herokuapp.com/'
];

(async function () {
	try {
		//promise.all to grab all remote schemas at the same time, we do not care what order they come back but rather just when they finish
		allSchemas = await Promise.all(endpoints.map(ep => getIntrospectSchema(ep)));
		//create function for /graphql endpoint and merge all the schemas
        const server = new ApolloServer({ schema: mergeSchemas({ schemas: allSchemas }), playground: true, introspection: true })
        server.applyMiddleware({ app, path: "/" })
        const PORT = process.env.PORT || 8090;
        app.listen({ port: PORT }, () => {
            console.log(`🚀Apollo Server running on http://localhost:${PORT}/`)
        })
	} catch (error) {
		console.log('ERROR: Failed to grab introspection queries', error);
	}
})();