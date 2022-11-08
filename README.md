# Kattis Scraper

Scrapes the entire Kattis website, downloads all problems and helps you perform complex queries to find interesting problems.

## Install

Install using:

```
npm install
```

Make sure you've installed the appropriate Node version:

```
nvm use

# or

fnm use
```

Note: The current Node version is found in `.nvmrc`.

## How to Run

The scraped URLs are cached, and will only be downloaded once, so you can run the script multiple times without using additional network resources.

Remove the `.cache` folder if you wish to clear the cached data.

### Export as CSV

Run and export the data as an CSV file:

```
npm run csv
```

### Populate a SurrealDB Database

Make sure you have [installed SurrealDB](https://surrealdb.com/docs/start/installation) before starting.

Start the SurrealDB server (this command also starts the built-in API):

```
surreal start --log debug --user root --pass root memory
```

Scrape the Kattis website and populate the database:

```
SURREALDB_USER=root SURREALDB_PASS=root npm run surrealdb
```

Then, you can query the SurrealDB API. Read the [docs](https://surrealdb.com/docs/start) to learn how to use cURL or Postman to query SurrealDB. Keep in mind the `NS` and `DB` headers should both be `kattis`. For example:

```sh
DATA="INFO FOR DB;"
curl --request POST \
	--header "Accept: application/json" \
	--header "NS: kattis" \
	--header "DB: kattis" \
	--user "root:root" \
	--data "${DATA}" \
	http://localhost:8000/sql
```

To learn how to perform advanced queries in SurrealDB, you should refer to the [official documentation](https://surrealdb.com/docs).

#### Example #1: Filter by Difficulty

```sql
SELECT slug, minDifficulty FROM problem WHERE minDifficulty > 9.3;
```

```json
"result": [
  {
    "minDifficulty": "9.4",
    "slug": "harvard"
  }
]
```

#### Example #2: Find Geometry Problems

```sql
SELECT subdomain, slug FROM problem
WHERE statement CONTAINS "coordinate"
AND statement CONTAINS "distance"
AND statement CONTAINS "polygon"
LIMIT 4;
```

```json
"result": [
  {
    "slug": "randommanhattan",
    "subdomain": "open"
  },
  {
    "slug": "marshlandrescues",
    "subdomain": "open"
  },
  {
    "slug": "puzzle2",
    "subdomain": "open"
  },
  {
    "slug": "tracksmoothing",
    "subdomain": "open"
  }
]
```

#### Example #3: Full Text Search

*Under construction. At the moment of writing, full text search is not currently supported by SurrealDB.*

#### Example #4: Count Amount of Scraped Problems

```sql
SELECT subdomain, count(subdomain) AS total
FROM problem
GROUP BY subdomain;
```

```json
"result": [
  {
    "subdomain": "icpc",
    "total": 112
  },
  {
    "subdomain": "open",
    "total": 3551
  }
]
```

## Subdomains

Currently the problems are downloaded from the following URL scopes:

```
https://icpc.kattis.com/problems/*
https://open.kattis.com/problems/*
```

More subdomains can easily be added by modifying the source code.

## Tools Used

* Node
* TypeScript
* SurrealDB
