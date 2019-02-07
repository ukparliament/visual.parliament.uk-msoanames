# -*- coding: utf-8 -*-
""" Flask server component for MSOA names."""

# Imports --------------------------------------------------------------------

import os
import psycopg2

from flask import Flask
from flask import redirect
from flask import render_template
from flask import request
from flask import Response
from flask import send_from_directory
from flask import url_for
from flask import abort
from flask_wtf.csrf import CSRFProtect

# Constants ------------------------------------------------------------------

MSOA_DB_HOST = os.environ['MSOA_DB_HOST']
MSOA_DB_PORT = os.environ['MSOA_DB_PORT']
MSOA_DB_NAME = os.environ['MSOA_DB_NAME']
MSOA_DB_USERNAME = os.environ['MSOA_DB_USERNAME']
MSOA_DB_PASSWORD = os.environ['MSOA_DB_PASSWORD']
MSOA_FLASK_KEY = os.environ['MSOA_FLASK_KEY']

# Application ----------------------------------------------------------------

app = Flask(__name__)
app.secret_key = MSOA_FLASK_KEY

# CSRF -----------------------------------------------------------------------

csrf = CSRFProtect(app)

# Routes ---------------------------------------------------------------------

@app.route('/')
@csrf.exempt
def index():
    """Render the index page."""
    return render_template('index.html')

@app.route('/msoanames/map')
def msoas():
    """Render the MSOA map."""
    return render_template('map.html')

@app.route('/msoanames/submit', methods=['GET', 'POST'])
def submit():

    """Handle submitted suggestions."""

    # Redirect to the map if not a POST request
    if request.method != 'POST':
        return redirect(url_for('msoas'))

    form_keys = [
        'msoa11cd',
        'msoa11nm',
        'msoa11hclnm',
        'suggestion',
        'reason'
    ]

    # Reject request if form values do not have expected characteristics
    bad_request = Response('{"error": "Bad request"}',
                           status=400,
                           mimetype="application/json")

    for k in form_keys:
        if k not in request.form:
            return bad_request

    for k in form_keys[:-1]:
        if len(request.form[k]) > 64:
            return bad_request

    if len(request.form['reason']) > 1024:
        return bad_request

    # Otherwise write the data to the database
    try:
        con = connect()
        cur = con.cursor()
        cur.execute('''
            INSERT INTO suggestions (
                msoa11cd,
                msoa11nm,
                msoa11hclnm,
                suggestion,
                reason)
            VALUES(%s, %s, %s, %s, %s);''',
                    (request.form['msoa11cd'],
                     request.form['msoa11nm'],
                     request.form['msoa11hclnm'],
                     request.form['suggestion'],
                     request.form['reason']))
        con.commit()
        cur.close()
        con.close()
        return '''{{
            "msoa11cd": "{0}",
            "msoa11nm": "{1}",
            "msoa11hclnm": "{2}",
            "suggestion": "{3}",
            "reason": "{4}"}}'''.format(
                request.remote_addr,
                request.form['msoa11cd'],
                request.form['msoa11nm'],
                request.form['msoa11hclnm'],
                request.form['suggestion'],
                request.form['reason'])

    except psycopg2.Error as e:
        err_msg = 'Could not connect to the database'
        if e.pgcode is not None:
            err_msg = e.diag.message_primary
        app.logger.error('Error in database operation: {0}'.format(err_msg))
        abort(500)

@app.route('/msoanames/static/<path:filename>')
def serve_static(filename):
    #root_dir = os.path.dirname(os.getcwd())
    return send_from_directory('static', filename)

# Database -------------------------------------------------------------------

def connect():
    """Connect to Postgres database."""
    con = psycopg2.connect( \
        database=MSOA_DB_NAME,
        user=MSOA_DB_USERNAME,
        password=MSOA_DB_PASSWORD,
        host=MSOA_DB_HOST,
        port=MSOA_DB_PORT,
        connect_timeout=20)
    return con

# Main -----------------------------------------------------------------------

if __name__ == "__main__":
    app.debug = False
    app.run(host='0.0.0.0', port="3001")
