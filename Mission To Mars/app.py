# import necessary libraries
from flask import Flask, render_template, redirect
from flask_pymongo import PyMongo
import scrape_mars

# create instance of Flask app
# For new version of flask_pymongo please insert app.config line like so:
app = Flask(__name__)

'''
Add this for new version of flask_pymongo
'''
app.config["MONGO_URI"] = "mongodb://localhost:27017/news_db"

# Use flask_pymongo to set up mongo connection
mongo = PyMongo(app)

# create route that renders index.html template and finds documents from mongo
@app.route("/")
def home():

    # Find data from the mongo db 
    mars_data = mongo.db.mars.find_one()
    
    # return template and data
    return render_template("index.html", mars_data=mars_data)

# Route that will trigger scrape functions
@app.route("/scrape")
def scrape():

    # Run scraped functions
    mars_data = scrape_mars.scrape()

    # Store results into a dictionary
    mars_data_dict = {
        "title": mars_data["Mars_News"]["news_title"],
        "news_p": mars_data["Mars_News"]["news_p"],
        "featured_image": mars_data["Featured_Image"],
        "weather": mars_data["Mars_Weather"],
        "facts": mars_data["Mars_Facts"],
        "hemisphere_images": mars_data["Hemispheres_Images"]
    }

    # Drop the collection if exists
    mongo.db.mars.drop()

    # Insert mars_news into database
    mongo.db.mars.insert_one(mars_data_dict)

    # Redirect back to home page
    return redirect("http://localhost:5000/", code=302)


if __name__ == "__main__":
    app.run(debug=True)
