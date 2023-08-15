const jwt = require('jsonwebtoken');
const fs = require('fs');

const { verifyAndsetCurrentUser } = require('../../middleware/auth');

// Mock data for testing
const accessToken = 'your-access-token';
const userPayload = { email: 'test@example.com' };
const userNotFoundPayload = { email: 'notfound@example.com' };

// Mock dependencies
jest.mock('jsonwebtoken', () => ({
	verify: jest.fn((token, secret, callback) => {
		if (token === accessToken) {
			callback(null, userPayload);
		} else {
			callback(new Error('Invalid token'));
		}
	}),
}));

jest.mock('fs', () => ({
	readFileSync: jest.fn(() => {
		return JSON.stringify([{ email: 'test@example.com' }]);
	}),
}));

// Mock request and response objects
const req = {
	header: jest.fn(headerName => {
		if (headerName === 'authorization') {
			return `Bearer ${accessToken}`;
		}
		return undefined;
	}),
};
const res = {
	status: jest.fn(() => res),
	send: jest.fn(),
};

// Mock next function
const next = jest.fn();

describe('verifyAndsetCurrentUser', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should set the user in the request object and call the next function if token is valid', () => {
		verifyAndsetCurrentUser(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith(
			accessToken,
			process.env.ACCESS_TOKEN_SECRET,
			expect.any(Function)
		);
		expect(req.user).toEqual({ email: 'test@example.com' });
		expect(next).toHaveBeenCalled();
		expect(res.status).not.toHaveBeenCalled();
		expect(res.send).not.toHaveBeenCalled();
	});

	it('should return an error response if no bearer token is provided', () => {
		req.header = jest.fn(() => undefined);

		verifyAndsetCurrentUser(req, res, next);

		expect(jwt.verify).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.send).toHaveBeenCalledWith({
			error: 'Bearer token must be provided to access this resource',
		});
	});

	it('should return an error response if the token is invalid', () => {
		const invalidToken = 'invalid-token';
		req.header = jest.fn(() => `Bearer ${invalidToken}`);

		verifyAndsetCurrentUser(req, res, next);

		expect(jwt.verify).toHaveBeenCalledWith(
			invalidToken,
			process.env.ACCESS_TOKEN_SECRET,
			expect.any(Function)
		);
		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(403);
		expect(res.send).toHaveBeenCalledWith({
			error: 'Invalid token',
		});
	});

	it('should return an error response if the user is not found', () => {
		jwt.verify.mockImplementation((token, secret, callback) => {
			callback(null, userNotFoundPayload);
		});

		verifyAndsetCurrentUser(req, res, next);

		expect(req.user).toBeUndefined();
		expect(next).not.toHaveBeenCalled();
		expect(res.status).toHaveBeenCalledWith(404);
		expect(res.send).toHaveBeenCalledWith({
			error: 'User with this email not found',
		});
	});
});
