
# News Aggregator API

This project aims to build a RESTful API using Node.js and Express.js that allows users to fetch news articles from multiple sources based on their preferences. The API will provide registration, authentication, and news preference management functionalities. It will also incorporate 3 external news APIs for fetching news articles and implement asynchronous processing and filtering based on user preferences.

## Installation

1. Clone the repository:

   ```
   git clone https://github.com/jish0desarkar/news-aggregator-api.git
   ```

2. Navigate to the project directory:

   ```
   cd news-aggregator-api
   ```

3. Install the dependencies:

   ```
   npm install
   ```

4. Create a `.env` file in the root directory and specify the following environment variables:

	```
		ACCESS_TOKEN_SECRET=token-secret
		NEWS_API_KEY=api-key
		NEWSCATCHER_API_KEY=api-key
		NEWS_DATA_API_KEY =api-key
		MEILI_MASTER_KEY=meili-master-key
	```


5. Start the server:

   ```
   npm start
   ```

6. The API will now be accessible at `http://localhost:3000`.

NOTE: MeiliSearch is required as a dependency for this project. A self-hosted instance handles the searching and filtering of the stored articles. To use MeiliSearch locally read how to install and run it [here](https://www.meilisearch.com/docs/learn/getting_started/installation). Or to use the already set-up MeiliSearch instance please get the Master Key from the code maintainer.

## API Endpoints

### User Registration

**Endpoint:** `POST /register`

Registers a new user with the provided email and password. There are email and password validations in place. Make sure to input a valid email and a password of length 6 or more

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response

- Status: 201 Created

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZjNjNmYyLTM3ZDItNGY4Yy04NTI0LWJhNTI1YWIzZTBlNiIsImlhdCI6MTYyMzQ1MjA4OX0.1Hyy4BT1AQVriBb9xRq5lMTAz_GA-DmtvgJQ3GG7-vg"
}
```

### User Login

**Endpoint:** `POST /login`

Logs in a user and generates a JWT token for authentication.

#### Request Body

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

#### Response

- Status: 200 OK

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjViZjNjNmYyLTM3ZDItNGY4Yy04NTI0LWJhNTI1YWIzZTBlNiIsImlhdCI6MTYyMzQ1MjA4OX0.1Hyy4BT1AQVriBb9xRq5lMTAz_GA-DmtvgJQ3GG7-vg"
}
```

### Retrieve News Preferences

**Endpoint:** `GET /preferences`

Retrieves the news preferences for the logged-in user. 

#### Request Headers

- Authorization: Bearer `<token>`

#### Response

- Status: 200 OK

```json
{
  "preferences": ["business", "technology"],
  "sources": ["newsapi", "newsdataapi"]
}
```

### Update News Preferences

**Endpoint:** `PUT /preferences`

Updates the news preferences for the logged-in user. There are a predifined list of 10 preferences and 3 sources. There's a validation in place which ensures only those as input would be accepted.

#### Request Headers

- Authorization: Bearer `<token>`

#### Request Body

```json
{
  "preferences": ["business", "technology", "entertainment"],
  "sources": ["newsapi", "newsdataapi"]
}
```

#### Response

- Status: 200 OK

```json
{
  "message": "News preferences updated successfully."
}
```

### Fetch News Articles

**Endpoint:** `GET /news`

Fetches news articles based on the logged-in user's preferences and sources.

#### Request Headers

- Authorization: Bearer `<token>`

#### Response

- Status: 200 OK

```json
{


  "articles": [
    {
      "title": "Article 1",
      "description": "This is the first article.",
      "source": "newsapi",
      "url": "https://www.example.com/article1"
    },
    {
      "title": "Article 2",
      "description": "This is the second article.",
      "source": "newscatcherapi",
      "url": "https://www.example.com/article2"
    }
  ]
}
```

### Mark Article as Read

**Endpoint:** `POST /news/:id/read`

Marks a news article as read.

#### Request Headers

- Authorization: Bearer `<token>`

#### Response

- Status: 200 OK

```json
{
	"message":  "Article marked as read successfully",
	"readArticleIds":  [
	"635fed32-a597-484e-bc98-d13869279041",
	"a3e0953f-59e1-4110-94b3-ed2f33b51d50",
	"a108a331-c01f-4868-8850-9fe2d607830c"
	]
}
```

### Mark Article as Favorite

**Endpoint:** `POST /news/:id/favorite`

Marks a news article as a favorite.

#### Request Headers

- Authorization: Bearer `<token>`

#### Response

- Status: 200 OK

```json
{
	"message":  "Article marked as favorite successfully",
	"favoriteArticleIds":  [
	"635fed32-a597-484e-bc98-d13869279041",
	"a3e0953f-59e1-4110-94b3-ed2f33b51d50",
	"a108a331-c01f-4868-8850-9fe2d607830c"
	]
}
```

### Retrieve Read Articles

**Endpoint:** `GET /news/read`

Retrieves all read news articles.

#### Request Headers

- Authorization: Bearer `<token>`

#### Response

- Status: 200 OK

```json
{
		"message":  "Read articles found",
		"readArticles":  [
			{
				"author":  "Charlotte Alter",
				"title":  "Whitney Wolfe Herd Wants Technology to Cure Loneliness",
				"content":  "I first interviewed Whitney Wolfe Herd in 2015, back when she was just Whitney Wolfe, a 25 year old who had recently started a little company called Bumble. For those of you who aren’t on dating apps… [+5193 chars]",
				"source":  "newsapi",
				"id":  "a108a331-c01f-4868-8850-9fe2d607830c"
			}
	]
}
```

### Retrieve Favorite Articles

**Endpoint:** `GET /news/favorites`

Retrieves all favorite news articles.

#### Request Headers

- Authorization: Bearer `<token>`

#### Response

- Status: 200 OK

```json
{
		"message":  "Favorite articles found",
		"favoriteArticles":  [
			{
				"author":  "Charlotte Alter",
				"title":  "Whitney Wolfe Herd Wants Technology to Cure Loneliness",
				"content":  "I first interviewed Whitney Wolfe Herd in 2015, back when she was just Whitney Wolfe, a 25 year old who had recently started a little company called Bumble. For those of you who aren’t on dating apps… [+5193 chars]",
				"source":  "newsapi",
				"id":  "a108a331-c01f-4868-8850-9fe2d607830c"
			}
	]
}
```

### Search News Articles

**Endpoint:** `GET /news/search/:keyword`

Searches for news articles based on the provided keyword.

#### Response

- Status: 200 OK

```json
{
  "articles": [
    {
      "title": "Article with Keyword",
      "description": "This article contains the keyword in the title.",
      "source": "BBC News",
      "url": "https://www.example.com/article-with-keyword"
    },
    {
      "title": "Another Article with Keyword",
      "description": "This article mentions the keyword in the description.",
      "source": "CNN",
      "url": "https://www.example.com/another-article-with-keyword"
    }
  ]
}
```

## Error Handling

The API includes proper error handling for various scenarios, including:

- Invalid requests
- Authentication errors
- Authorization errors

In case of an error, the API will respond with an appropriate error message and status code.

## Testing

You can test the API using tools like Postman or Curl to ensure it works as expected. Make requests to the defined endpoints with the required headers and request bodies.

## Optional Extensions

The following optional extensions can be implemented to enhance the functionality of the API:

- Implement a caching mechanism to store news articles and reduce external API calls. The articles are stored locally. 
- A cron job runs every 2 hours which fetches new articles from the sources and indexes to the MeiliSearch engine.  
- All REST calls fetch the articles local store. Articles are filtered and searched using MeiliSearch search engine.
- Allow users to mark articles as read or favorite.
- Implement additional endpoints for retrieving read and favorite articles.
- Implement a search endpoint to search for news articles based on keywords.
- Implement a mechanism to periodically update


## Conclusion

This project provides a RESTful API that allows users to fetch news articles from multiple sources based on their preferences. 
