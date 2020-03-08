import { Server, Model, Response } from 'miragejs';
import CryptoJS from 'crypto-js';

var salt = CryptoJS.lib.WordArray.random(128 / 8);

function hashPassword(password) {
	return CryptoJS.PBKDF2(password, salt).toString(CryptoJS.enc.Base64);
}

export default () =>
	new Server({
		models: {
			user: Model
		},
		routes() {
			this.namespace = '/api';

			this.post('/login', (schema, request) => {
				const { requestBody: body } = request;
				const { email, password } = body;
				const user = {
					email,
					password: hashPassword(password)
				};

				if (schema.users.findBy(user)) {
					return new Response(200, {}, { message: 'user found' });
				} else {
					return new Response(400, {}, { error: 'user not found' });
				}
			});

			this.post('/signup', (schema, request) => {
				const { requestBody: body } = request;
				const { email, password } = body;
				const user = {
					email,
					password: hashPassword(password)
				};
				const foundUser = schema.users.findBy(user);
				if (!foundUser) {
					schema.users.create(user);
					return new Response(200, {}, { message: 'user created' });
				} else {
					return new Response(400, {}, { error: 'user already exists' });
				}
			});

			this.post('/forgot-password', (schema, request) => {
				const { requestBody: body } = request;
				const { email } = body;
				const foundUser = schema.users.findBy({ email });

				// send success message regardless if user exists or not
				if (!foundUser) {
					return new Response(200, {}, { message: 'email sent' });
				} else {
					// send real email to user's email address
					return new Response(200, {}, { message: 'email sent' });
				}
			});
		},
		seeds(server) {
			server.create('user', {
				email: 'user@test.com',
				password: hashPassword('password')
			});
		}
	});
