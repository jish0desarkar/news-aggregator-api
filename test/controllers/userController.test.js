const request = require('supertest');
const app = require("../../server"); // Replace with the path to your Express app file
const fs = require("fs")
const path = require("path")

let fileContent
const usersFilePath = path.join(__dirname, "../../data_store/users_test.json")
beforeAll(() => {
	fileContent = require(usersFilePath)
})
afterEach(() => {
	// Restore the users_test.json file content
	fs.writeFileSync(usersFilePath, JSON.stringify(fileContent))
})

describe('Testing user register', () => {

	it('should register a new user', async () => {
		const newUser = {
			email: 'news@example.com',
			password: '123123'
		};

		const response = await request(app)
			.post('/register')
			.send(newUser);

		expect(response.status).toBe(200);
		expect(response.body.accessToken).toBeDefined();
	});

	it('should handle user already registered', async () => {
		const existingUser = {
			email: 'test@example.com',
			password: '123123'
		};

		const response = await request(app)
			.post('/register')
			.send(existingUser);

		expect(response.status).toBe(409);
		expect(response.text).toBe('user already registered');
	});

	it('should handle email validation error', async () => {
		const invalidUser = {
			email: 'invalidemail',
			password: '123123'
		};

		const response = await request(app)
			.post('/register')
			.send(invalidUser);
		expect(response.status).toBe(422);
		expect(response.body.validationError).toBeDefined();
		expect(response.body.validationError[0].message).toBe("\"email\" must be a valid email")
	});

	it('should handle password validation error', async () => {
		const invalidUser = {
			email: 'test@example.com',
			password: '1231'
		};

		const response = await request(app)
			.post('/register')
			.send(invalidUser);
		expect(response.status).toBe(422);
		expect(response.body.validationError).toBeDefined();
		expect(response.body.validationError[0].message).toBe("\"password\" length must be at least 6 characters long")
	});
});

describe('Testing user login', () => {

	it('should login a new user', async () => {
		const userBody = {
			email: 'test@example.com',
			password: '123123'
		};

		const response = await request(app)
			.post('/login')
			.send(userBody);

		expect(response.status).toBe(200);
		expect(response.body.accessToken).toBeDefined();
	});

	it('should handle user not registered', async () => {
		const invalidUser = {
			email: 'not-registered@example.com',
			password: '123123'
		};

		const response = await request(app)
			.post('/login')
			.send(invalidUser);

		expect(response.status).toBe(404);
		expect(response.body.error).toBe("Please register first");
	});

	it('should handle email validation error', async () => {
		const invalidUser = {
			email: 'invalidemail',
			password: '123123'
		};

		const response = await request(app)
			.post('/login')
			.send(invalidUser);
		expect(response.status).toBe(422);
		expect(response.body.validationError).toBeDefined();
		expect(response.body.validationError[0].message).toBe("\"email\" must be a valid email")
	});

	it('should handle password validation error', async () => {
		const invalidUser = {
			email: 'test@example.com',
			password: '1231'
		};

		const response = await request(app)
			.post('/login')
			.send(invalidUser);
		expect(response.status).toBe(422);
		expect(response.body.validationError).toBeDefined();
		expect(response.body.validationError[0].message).toBe("\"password\" length must be at least 6 characters long")
	});

	it('should handle wrong password validation error', async () => {
		const invalidUser = {
			email: 'test@example.com',
			password: 'wrong_password'
		};

		const response = await request(app)
			.post('/login')
			.send(invalidUser);
		expect(response.status).toBe(401);
		expect(response.body.error).toBeDefined();
		expect(response.body.error).toBe("Wrong password");
	});
});
