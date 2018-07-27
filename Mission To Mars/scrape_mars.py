
# coding: utf-8
# # Importing Dependencies
import pandas as pd
import requests
from bs4 import BeautifulSoup
from splinter import Browser


# Setting up a browser object with chrome webdriver and navigating with browser.visit()
def init_browser(url):
    executable_path = {'executable_path': 'chromedriver.exe'}
    browser = Browser('chrome', **executable_path, headless=False)
    browser.visit(url)
    return browser

# # NASA Mars News
# 
# Scrape the NASA Mars News Site and collect the latest News Title and Paragraph Text. 
def get_nasa_mars_news(url):
    browser = init_browser(url)
    mars_news_dict = {}
    try:
        html = browser.html
        soup = BeautifulSoup(html, 'lxml')

        news_title = soup.find('div', class_='content_title').a.text
        news_paragraph = soup.find('div', class_='article_teaser_body').text
        
        mars_news_dict["news_title"] = news_title
        mars_news_dict["news_p"] = news_paragraph

    except AttributeError as e:
        print(e)
        
    browser.quit()
    return (mars_news_dict)


# # JPL Mars Space Images - Featured Image
# 1. Visit the url(https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars) for JPL Featured Space Image.
# 
# 2. Use splinter to navigate the site and find the image url for the current Featured Mars Image and assign the url string to a variable called featured_image_url.
# 
# 3. Make sure to find the image url to the full size .jpg image.
# 
# 4. Make sure to save a complete url string for this image.
def get_featured_image_url(url):
    browser = init_browser(url)
    try:
        html = browser.html
        soup = BeautifulSoup(html, 'lxml')
        partial_link = soup.find("a" , {"id": "full_image"})["data-link"]
        mediumsize_image_url = "https://www.jpl.nasa.gov" + partial_link

        browser.visit(mediumsize_image_url)
        html = browser.html
        soup = BeautifulSoup(html, 'lxml')
        fullsize_image_partial_url = soup.find("figure", class_="lede").a["href"]
        full_image_url = "https://www.jpl.nasa.gov" + fullsize_image_partial_url
    except AttributeError as e:
        print(e)
    browser.quit()   
    return full_image_url

# # Mars Weather
# - Visit the Mars Weather twitter account(https://twitter.com/marswxreport?lang=en) and scrape the latest Mars weather tweet from the page. Save the tweet text for the weather report as a variable called mars_weather.
def get_mars_weather(url):
    try:
        browser = init_browser(url)

        html = browser.html
        soup = BeautifulSoup(html, 'lxml')
        mars_weather = soup.find("p", class_="tweet-text").text
    except AttributeError as e:
        print(e)
    browser.quit()
    return mars_weather

# # Mars Facts
# - Visit the Mars Facts webpage,https://space-facts.com/mars/ and use Pandas to scrape the table containing facts about the planet including Diameter, Mass, etc.
# 
# - Use Pandas to convert the data to a HTML table string.
def get_mars_facts_dataframe(url):
    # parse the html and get tables
    tables = pd.read_html(url)
    
    # Generated table is 'list' type, to get the table retreive for index=0
    mars_facts_df = tables[0]
    mars_facts_df.columns = ["Description", "Value"]
    mars_facts_df.set_index("Description", inplace=True)
    return mars_facts_df

# # Mars Hemispheres
# - Visit the USGS Astrogeology site, https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars to obtain high resolution images for each of Mar's hemispheres.
# 
# - You will need to click each of the links to the hemispheres in order to find the image url to the full resolution image.
# 
# - Save both the image url string for the full resolution hemisphere image, and the Hemisphere title containing the hemisphere name. Use a Python dictionary to store the data using the keys img_url and title.
# 
# - Append the dictionary with the image url string and the hemisphere title to a list. This list will contain one dictionary for each hemisphere.
def find_mars_hemisphere_images(url):
    browser = init_browser(url)
    print(browser)
    html = browser.html
    soup = BeautifulSoup(html, 'lxml')
    try:
        mars_images = soup.find_all("div", class_="description")
        
        mars_images_list = []
        for image in mars_images:
            mars_images_dict = {}
            # get the image title
            image_title = image.h3.text
            
            # click the image link
            browser.click_link_by_partial_text(image_title)
            
            # Get the html for the current page and navigate to the full_image link
            html = browser.html
            soup = BeautifulSoup(html, 'lxml')
            full_image_partial_link = soup.find("img", {"class": "wide-image"})["src"]
            
            # Appending the root url to the partial link(for full image)
            full_image_link = "https://astrogeology.usgs.gov" + full_image_partial_link
            
            # Adding title and image url to a dictionary
            mars_images_dict["title"] = image_title
            mars_images_dict["image_url"] = full_image_link
            
            # Adding each dictionary to a list
            mars_images_list.append(mars_images_dict)
            
            # Go back to the previous page
            browser.find_link_by_text("Back").first.click()
            
        # Close the browser    
        browser.quit()
    except AttributeError as e:
        print(e)
    return mars_images_list

'''
# Scraping Mars data from the following sources
# 1. Mars News from NASA
# 2. 'JPL Featured Space Image' from 'jpl.nasa.gov'
# 3. 'Mars Weather' from 'Mars Weather Twitter'
# 4. 'Mars Facts Table' from 'Space-facts' site using Pandas
# 5.  Mars Hemisphere Images from 'USGS Astrogeology site'
'''
def scrape():
    scrape_mars_data = {}

    # Scraping Mars News from NASA
    nasa_url = "https://mars.nasa.gov/news"
    nasa_mars_news = get_nasa_mars_news(nasa_url)

    # Scraping 'JPL Featured Space Image' from 'jpl.nasa.gov'
    jpl_nasa_url = "https://www.jpl.nasa.gov/spaceimages/?search=&category=Mars"
    featured_image_url = get_featured_image_url(jpl_nasa_url)
    
    # Scraping 'Mars Weather' from 'Mars Weather Twitter'
    mars_weather_twitter_url = "https://twitter.com/marswxreport?lang=en"
    mars_weather = get_mars_weather(mars_weather_twitter_url)

    # Scraping 'Mars Facts Table' from 'Space-facts' site
    mars_facts_url = "https://space-facts.com/mars"
    mars_facts_df = get_mars_facts_dataframe(mars_facts_url)
    # Converting the dataframe to 'Html-Table' String
    html_table = mars_facts_df.to_html()

    # Scraping Mars Hemisphere Images from 'USGS Astrogeology site'
    mars_hemispheres_url = "https://astrogeology.usgs.gov/search/results?q=hemisphere+enhanced&k1=target&v1=Mars"
    hemisphere_image_urls = find_mars_hemisphere_images(mars_hemispheres_url)

    scrape_mars_data = {
        "Mars_News":  nasa_mars_news,
        "Featured_Image": featured_image_url,
        "Mars_Weather": mars_weather,
        "Mars_Facts": html_table,
        "Hemispheres_Images":  hemisphere_image_urls
    }

    return scrape_mars_data

# scrape_mars_data = scrape()

# print(scrape_mars_data)