# -*- coding: utf-8 -*-
# Prototype Flask app for MSOA names

# Imports --------------------------------------------------------------------

import os
import psycopg2

from flask import Flask
from flask import g
from flask import redirect
from flask import render_template
from flask import request
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
def map():
    return render_template('map.html')

@app.route('/submit', methods=['GET', 'POST'])
def submit():
    if request.method == 'POST':
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
    else:
        return redirect(url_for('map'))

# Database -------------------------------------------------------------------

def connect():
    con = psycopg2.connect( \
        database=MSOA_DB_NAME,
        user=MSOA_DB_USERNAME,
        password=MSOA_DB_PASSWORD,
        host=MSOA_DB_HOST,
        port=MSOA_DB_PORT,
        connect_timeout=10)

    return con

# Main -----------------------------------------------------------------------

if __name__ == "__main__":
    # app.debug = True
    app.run(host='0.0.0.0', port="3001")
