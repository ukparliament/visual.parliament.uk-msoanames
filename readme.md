# visual.parliament.uk-msoanames

A small web app for showcasing a set of natural names for Middle-Layer Super Output Areas (MSOAs) and collecting suggestions for alternatives.

## Setup

The application uses `flask` for the server component and `psycopg2` for the database connection. To start the server locally, set the environment variables for the database connection and run:

```bash
python app.py
```

To compile and bundle the JavaScript run:

```bash
npm install
npm run webpack
```
