################################################
# Importing Dependencies
################################################
import sqlalchemy
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func, and_

from flask import Flask, jsonify

import pandas as pd
import numpy as np

import datetime as dt
from dateutil.relativedelta import relativedelta

#################################################
# Database Setup
#################################################
engine = create_engine('sqlite:///Resources/hawaii.sqlite', connect_args={'check_same_thread': False})

# reflect an existing database into a new model
Base = automap_base()
# reflect the tables
Base.prepare(engine, reflect=True)

# Save references to the tables
Measurement = Base.classes.measurements
Station = Base.classes.stations

# Create session from Python to the DB
session = Session(engine)

#################################################
# Flask Setup 
#################################################
app = Flask(__name__)

#################################################
# Flask Routes
#################################################
# last 12 months date from the recent date of 'Measurements' table
recent_date = session.query(Measurement.date).order_by(Measurement.date.desc()).first().date
max_date =  dt.datetime.strptime(recent_date, "%Y-%m-%d")       
last_12months_date = max_date - relativedelta(months=12)

@app.route("/")
def welcome():
    return (
        f"Welcome to the Hawaii Weather API!<br/>"
        f"--"
        f"Note: Enter the dates in the (YYYY-MM-DD) format<br/><br/>"
        f"<strong>Available Routes:<strong><br/>"
        f"/api/v1.0/precipitation<br/>"
        f"/api/v1.0/stations<br/>"
        f"/api/v1.0/tobs<br/>"        
        f"/api/v1.0/start_date<br/>"
        f"/api/v1.0/start_date/end_date<br/>"
    )

"""
# Route: /api/v1.0/precipitation
# Query for the dates and precipitation from the last year.
# Convert the query results to a Dictionary using date as the key and prcp as the value.
# Return the JSON representation of your dictionary.
"""
@app.route("/api/v1.0/precipitation")
def precipitation():
    prcp_results = session.query(Measurement.date, func.avg(Measurement.prcp).label("avg_prcp")).\
                filter(Measurement.date >= last_12months_date).\
                group_by(Measurement.date).all()
    return jsonify(dict(prcp_results))

"""
# Route: /api/v1.0/stations
# Return a JSON list of stations from the dataset.
"""
@app.route("/api/v1.0/stations")
def stations():
    station_results = session.query(Station.station, Station.name).all()
    return jsonify(dict(station_results))

"""
# Route: /api/v1.0/tobs
# Return a JSON list of Temperature Observations (tobs) for the previous year
"""
@app.route("/api/v1.0/tobs")
def tobs():
    tobs_results = session.query(Measurement.date, Measurement.tobs).\
                    filter(Measurement.date >= last_12months_date).all()
    return jsonify(dict(tobs_results))

"""
# Route: /api/v1.0/<start>
# Return a JSON list of the minimum temperature, the average temperature, and the max temperature for a given start or start-end range.
# When given the start only, calculate TMIN, TAVG, and TMAX for all dates greater than and equal to the start date.
"""
# Check to see if the requested date is valid
def validate(date_text):
    '''
    Input: 
    date_text (date): Date to be validated for the format 'YYYY-mm-dd'
    Output:
    True : If the date is valid
    Exp : Exception error as a value
    '''
    try:
        if date_text != dt.datetime.strptime(date_text, "%Y-%m-%d").strftime('%Y-%m-%d'):
            raise ValueError
        else:
            return True
    except ValueError as exp:
        return exp

@app.route("/api/v1.0/<start_date>")
@app.route("/api/v1.0/<start_date>/<end_date>")
def temperature(start_date, end_date=None):
    
    # validation of the start date for the correct date format 'YYYY-mm-dd'
    is_date_Valid = validate(start_date)
    if(is_date_Valid is True):
        start_date = dt.datetime.strptime(start_date, "%Y-%m-%d")
    else:
        return jsonify({"ERROR": f"{is_date_Valid}"})
    
    # If end_date is missing then validate the start_date if it exceeds the max_date in the data
    # If start_date is valid, query the temperature, else jsonify the Error message to the client
    if (end_date is None):
        if start_date > max_date:
            return jsonify({"ERROR": f"Requested start_date,({start_date.date()}) is greater than the most recent date,({max_date.date()}) from the available data"}), 404   
        else:
            temp_results = session.query(func.min(Measurement.tobs).label("Minimum Temp"), func.avg(Measurement.tobs).label("Average Temp"),\
                                         func.max(Measurement.tobs).label("Maximum Temp")).\
                                    filter(Measurement.date >= start_date).all()
            temp_list = [temp._asdict() for temp in temp_results]
            return jsonify(temp_list), 200
    else:
        # validate(end_date) for the date format
        is_date_Valid = validate(end_date)
        if(is_date_Valid is True):
            end_date = dt.datetime.strptime(end_date, "%Y-%m-%d") 
        else:
            return jsonify({"ERROR": f"{is_date_Valid}"})

        # Validate if end_date do not exceed the max_date in the data.
        # If end_date is valid, query the temperature, else jsonify the Error message to the client
        if (end_date > max_date):
            return jsonify({"ERROR": f"Requested end_date,({end_date.date()}) is greater than the most recent date,({max_date.date()}) from the available data"}), 404
        else:
            temp_results = session.query(func.min(Measurement.tobs).label("Minimum Temp"), func.avg(Measurement.tobs).label("Average Temp"),\
                                         func.max(Measurement.tobs).label("Maximum Temp")).\
                                    filter(and_(Measurement.date >= start_date, Measurement.date <= end_date)).all()
            temp_list = [temp._asdict() for temp in temp_results]
            return jsonify(temp_list), 200

if __name__ == "__main__":
    app.run(debug=True)