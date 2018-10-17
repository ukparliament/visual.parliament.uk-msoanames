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
from flask import url_for

# Application ----------------------------------------------------------------

app = Flask(__name__)

# Constants ------------------------------------------------------------------

MSOA_DB_HOST = os.environ['MSOA_DB_HOST']
MSOA_DB_PORT = os.environ['MSOA_DB_PORT']
MSOA_DB_NAME = os.environ['MSOA_DB_NAME']
MSOA_DB_USERNAME = os.environ['MSOA_DB_USERNAME']
MSOA_DB_PASSWORD = os.environ['MSOA_DB_PASSWORD']

# Routes ---------------------------------------------------------------------

@app.route('/')
def index():
    """Render the index page."""
    return render_template('index.html')

@app.route('/map')
def msoas():
    """Render the MSOA map."""
    return render_template('map.html')

@app.route('/submit', methods=['GET', 'POST'])
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
    con = connect()
    cur = con.cursor()
    cur.execute('''
        INSERT INTO suggestions (
            ip,
            msoa11cd,
            msoa11nm,
            msoa11hclnm,
            suggestion,
            reason)
        VALUES(%s, %s, %s, %s, %s, %s);''',
                (request.remote_addr,
                 request.form['msoa11cd'],
                 request.form['msoa11nm'],
                 request.form['msoa11hclnm'],
                 request.form['suggestion'],
                 request.form['reason']))
    con.commit()
    cur.close()
    con.close()
    return '''{{
        "msoa11cd": "{0}",
        "msoa11cd": "{1}",
        "msoa11nm": "{2}",
        "msoa11hclnm": "{3}",
        "suggestion": "{4}",
        "reason": "{5}"}}'''.format(
            request.remote_addr,
            request.form['msoa11cd'],
            request.form['msoa11nm'],
            request.form['msoa11hclnm'],
            request.form['suggestion'],
            request.form['reason'])


@app.route('/select')
def select():
    html = '''
        <table>
            <tr>
                <td><b>Id</b></td>
                <td><b>IP Address</b></td>
                <td><b>Code</b></td>
                <td><b>Name</b></td>
                <td><b>HCL Name</b></td>
                <td><b>Suggestion</b></td>
                <td><b>Reason</b></td>
            </tr>
        '''
    con = connect()
    cur = con.cursor()
    cur.execute('''SELECT * FROM suggestions;''')
    for row in cur.fetchall():
        html = '''{0}
                <tr>
                    <td>{1}</td>
                    <td>{2}</td>
                    <td>{3}</td>
                    <td>{4}</td>
                    <td>{5}</td>
                    <td>{6}</td>
                    <td>{7}</td>
                </tr>'''.format(
            html, row[0], row[1], row[2], row[3], row[4], row[5], row[6])
    cur.close()
    con.close()
    html = '{0}</table>'.format(html)
    return html


@app.route('/create')
def create():
    con = connect()
    cur = con.cursor()
    cur.execute('''
        CREATE TABLE suggestions (
            suggestion_id serial primary key,
            ip varchar(64),
            msoa11cd varchar(64),
            msoa11nm varchar(64),
            msoa11hclnm varchar(64),
            suggestion varchar(64),
            reason varchar(1024));
        ''')
    con.commit()
    cur.close()
    con.close()
    return 'Created'


@app.route('/drop')
def drop():
    con = connect()
    cur = con.cursor()
    cur.execute('''
        DROP TABLE suggestions;
        ''')
    con.commit()
    cur.close()
    con.close()
    return 'Dropped'


@app.route('/delete')
def delete():
    con = connect()
    cur = con.cursor()
    cur.execute('''
        DELETE FROM suggestions;
        ''')
    con.commit()
    cur.close()
    con.close()
    return 'Deleted'


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
