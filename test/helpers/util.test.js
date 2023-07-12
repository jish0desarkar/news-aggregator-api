const { urlEncodePreferences, updateArticleForUser, fetchArticlesForUser } = require("../../helpers/util")
const path = require("path")

beforeAll(() => {
	process.env.NODE_ENV = "test"
})

afterAll(() => {
	process.env.NODE_ENV = process.env.NODE_ENV
})

describe("Testing urlEncodePreferences function", () => {
	test("Testing urlEncodePreferences with 3 elements", () => {
		expect(urlEncodePreferences(["a", "b", "c"])).toEqual("a OR b OR c")
	})

	test("Testing urlEncodePreferences with 1 element", () => {
		expect(urlEncodePreferences(["aaaa"])).toEqual("aaaa")
	})
})

describe('Testing updateArticleForUser function', () => {
	const usersFilePath = path.resolve(__dirname, "../data_store/users_test.json")
	const articlesFilePath = path.resolve(__dirname, "../data_store/articles_test.json")
	let req = {
		user: {
			email: 'test@example.com',
		},
		params: {
			id: 'article1',
		},
	};

	afterEach(() => {
		req = {
			user: {
				email: 'test@example.com',
			},
			params: {
				id: 'article1',
			},
		};
	});
	test('should update user favorite articles and return success message', () => {
		const expectedResult = {
			statusCode: 200,
			message: 'Article added successfully',
			articles: ['article1'],
		};
		const actualResult = updateArticleForUser(req, 'favorites');
		expect(actualResult).toEqual(expectedResult);
	});

	test('should return error when article is not found', () => {
		req.params.id = 'article-not-available';

		const expectedResult = {
			statusCode: 404,
			message: 'No articles found',
			articles: [],
		};

		const actualResult = updateArticleForUser(req, 'favorites');
		expect(actualResult).toEqual(expectedResult);
	});

	test('should return error when an invalid property is provided', () => {
		const invalidProperty = 'invalid';
		const expectedError = new Error('Invalid property');
		expect(() => {
			updateArticleForUser(req, invalidProperty);
		}).toThrow(expectedError);
	});
})

describe('Testing updateArticleForUser function', () => {
	let req = {
		user: {
			email: 'test@example.com',
		},
	};

	afterEach(() => {
		req = {
			user: {
				email: 'test@example.com',
			},
		};
	})

	test('should return favorite articles when property is "favorites"', () => {
		const property = 'favorites';
		const result = fetchArticlesForUser(req, property);
		expect(result.statusCode).toBe(200);
		expect(result.message).toBe('Favorite articles found');
		expect(Array.isArray(result.articles)).toBe(true);
	});

	test('should throw an error when an invalid property is provided', () => {
		const property = 'invalidProperty';

		expect(() => {
			fetchArticlesForUser(req, property);
		}).toThrow('Invalid property');
	});

});
