## Documations To Read:

- Node.js
- Express
- mongoose
- MongoDB
- Cloudinary
- multer

<hr>

## Install 3 npm packages

1. mongoose
2. express
3. dotenv

run command:

```
npm i mongoose express dotenv
```

<hr>

## For handling Cookies and for Middlewares

```
npm i cookie-parser cors
```

<hr>

## For writing MongoDB queries:

run:

```
npm i mongoose-aggregate-paginate-v2
```

This is used as a middleware plugin.
It is very usefull to handle large dataset.
divides the total dataset into pages, which will be helpfull for searching through the dataset

- aggregation queries -> some set of steps that can be performed on the dataset, eg. filtering, sorting, grouping, and calculating totals.

<hr>

## For hasing Password and handle Token:

run:

```
npm i bcrypt jsonwebtoken
```

- bcypt -> This Library is used for hashing the passwords and storing,comparing them in the DB , helps in Password security.
- jsonwebtoken(JWT) -> This Library is used from authentication and autherization of users by creating tokens at client end and then requesting permission to server.

<hr>

## File Handling and Storing:

```
npm i cloudinary multer
```

- cloudinary -> Cloud service to store all the files/videos/images/pdf... from the user . It only stores the Files.
- multer -> A middleware which is used to handle the file upload from the backend.

<hr>
<hr>

# While connecting to DB

Always remember 2 things:

- Wrap the connection code in Try-Catch
- Always use async-await

<hr>
