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
    return render_template('redirect.html')

@app.route('/msoanames/map')
def msoas():
    """Render the MSOA map."""
    return render_template('redirect.html')

@app.route('/msoanames/assets/<path:filename>')
def serve_assets(filename):
    return send_from_directory('assets', filename)

@app.route('/msoanames/static/<path:filename>')
def serve_static(filename):
    base_url = 'https://houseofcommonslibrary.github.io/msoanames/'
    url = '{0}{1}'.format(base_url, filename)
    return redirect(url, code=308) 

# Main -----------------------------------------------------------------------

if __name__ == "__main__":
    app.debug = False
    app.run(host='0.0.0.0', port="3001")
