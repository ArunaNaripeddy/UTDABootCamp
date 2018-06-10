
## News Mood Analysis
---
* From the scatterplot, it shows that NYTimes and CNN have more positive tweets based on Vader Sentiment Analysis. Whereas, CBS has a negative sentiment.
* From bar graph, the average compound score for each media source is inline with the analysis from the scatterplot, which is NYtime, CNN having positive sentiments while CBS with negative sentiments. Fox and BBC around neutral.
* Based on Vader Analysis, the choice of words in CNN and NYTimes tweets are more on the positive side whereas, the choice of words from CBS seems to be on the negative side.

#### Importing Dependencies
* Tweepy API wrapper has been imported to interact with Twitter. And all the required modules numpy, pandas, matplotlib.pyplot and datetime have been imported.
* Also, SentimentIntensityAnalyzer class has been loaded from vaderSentiment class.
* Twitter API credentials has been stored in config.py and imported.
* Twitter OAuth authentication has been setup using tweepy 


```python
# Dependencies
import tweepy
import numpy as np
import pandas as pd
from datetime import datetime
import matplotlib.pyplot as plt
from matplotlib import style
style.use('ggplot')

# Import and Initialize Sentiment Analyzer
from vaderSentiment.vaderSentiment import SentimentIntensityAnalyzer
analyzer = SentimentIntensityAnalyzer()

# Twitter API Keys
from config import (consumer_key, 
                    consumer_secret, 
                    access_token, 
                    access_token_secret)

# Setup Tweepy API Authentication
auth = tweepy.OAuthHandler(consumer_key, consumer_secret)
auth.set_access_token(access_token, access_token_secret)
api = tweepy.API(auth, parser=tweepy.parsers.JSONParser())
```

### Sentiment Analysis - Media Sources
---
Sentiment analysis for media sources- BBCNews, CBSNews, CNN, FoxNews, NYTimes is done for the latest 100 tweets. Pagination is handled by initializing 'max_id' with the oldest 'tweet id'. The sentiment analysis results (positive, negative,neutral and compund scores) are saved as a list of dictionaries. And a counter has been created to keep track of number of tweets.


```python
# Target Accounts
target_user = ("@BBCNews", "@CBSNews", "@CNN", "@FoxNews", "@nytimes")

# Variables for holding sentiments
sentiments = []

# Looping through each target user
for target in target_user:
    # Variable for max_id
    oldest_tweet = None
    # Counter
    counter = 1
    
    # Loop through 5 pages of tweets (total 100 tweets)
    for x in range(5):

        # Get all tweets from home feed
        public_tweets = api.user_timeline(target, max_id = oldest_tweet)

        # Loop through all tweets 
        for tweet in public_tweets:
            
            # Run Vader Analysis on each tweet
            results = analyzer.polarity_scores(tweet["text"])
            compound = results["compound"]
            pos = results["pos"]
            neu = results["neu"]
            neg = results["neg"]
            tweets_ago = counter

            # Get Tweet ID, subtract 1, and assign to oldest_tweet
            oldest_tweet = tweet['id'] - 1

            # Add sentiments for each tweet into a list
            sentiments.append({"Media Source": target,
                               "Tweet Text": tweet["text"],
                               "Date": tweet["created_at"], 
                               "Compound": compound,
                               "Positive": pos,
                               "Negative": neu,
                               "Neutral": neg,
                               "Tweets Ago": counter})

            # Add to counter 
            counter += 1
```

### Sentiments Dataframe
Dataframe is created from list of sentiment dicitonaries


```python
# Convert sentiments to DataFrame
sentiments_pd = pd.DataFrame.from_dict(sentiments)

columns = ["Media Source", "Date", "Tweet Text", "Compound", "Positive", "Negative", "Neutral", "Tweets Ago"]
sentiments_pd = sentiments_pd[columns]

# Printing the sentiments dataframe
sentiments_pd
```

#### Saving the dataframe to a CSV file


```python
sentiments_pd.to_csv("News_Mood_Analysis.csv", index=False)
```

Select the sentiment records from the dataframe based on type of Media source.


```python
bbc = sentiments_pd.loc[sentiments_pd["Media Source"] == "@BBCNews"]
cnn = sentiments_pd.loc[sentiments_pd["Media Source"] == "@CNN"]
cbs_news = sentiments_pd.loc[sentiments_pd["Media Source"] == "@CBSNews"]
fox_news = sentiments_pd.loc[sentiments_pd["Media Source"] == "@FoxNews"]
nytimes = sentiments_pd.loc[sentiments_pd["Media Source"] == "@nytimes"]
```

## Scatter plot
---
Generate a scatter plot for compound sentiment score versus number of tweets for each media source listed. Matplotlib.pyplot library is used for plotting the scatter plot. All the required aesthetics of the plot are handled along with the plot legend. Before calling the plot.show(), the image has been saved to a .PNG file.


```python
fig = plt.figure(figsize=(8,5))
ax = fig.add_subplot(1,1,1)

# Create scatter plot
plt.scatter(bbc["Tweets Ago"],
            bbc["Compound"], 
            c="lightblue",
            s=100,
            edgecolor="black", linewidths=1, marker="o", 
            alpha=0.8, label="BBC")

plt.scatter(cbs_news["Tweets Ago"],
            cbs_news["Compound"], 
            c="green", 
            s=100,
            edgecolor="black", linewidths=1, marker="o", 
            alpha=0.8, label="CBS")

plt.scatter(cnn["Tweets Ago"],
            cnn["Compound"], 
            c="red", 
            s=100,
            edgecolor="black", linewidths=1, marker="o", 
            alpha=0.8, label="CNN")

plt.scatter(fox_news["Tweets Ago"],
            fox_news["Compound"], 
            c="purple", 
            s=100,
            edgecolor="black", linewidths=1, marker="o", 
            alpha=0.8, label="Fox")

plt.scatter(nytimes["Tweets Ago"],
            nytimes["Compound"], 
            c="gold",
            s=100,
            edgecolor="black", linewidths=1, marker="o", 
            alpha=0.8, label="New York Times")

# Incorporate the other graph properties
x_vals = cnn["Tweets Ago"]
now = datetime.now()
now = now.strftime("%m/%d/%Y")

plt.title(f"Sentiment Analysis of Media Tweets ({now})")
plt.xlim([x_vals.max()+5, x_vals.min()-5]) 
plt.ylim([-1.1, 1.1])
plt.ylabel("Tweet Polarity")
plt.xlabel("Tweets Ago")

lgnd = plt.legend(loc="center right", fontsize="large", title="Media Sources", 
                  bbox_to_anchor=(0.5, 0.5, 0.9, 0.5))
lgnd.get_title().set_fontsize("15")
lgnd.legendHandles[0]._sizes = [100]
lgnd.legendHandles[1]._sizes = [100]
lgnd.legendHandles[2]._sizes = [100]
lgnd.legendHandles[3]._sizes = [100]
lgnd.legendHandles[4]._sizes = [100]

ax.set_yticks(np.arange(-1.0,1.5,0.5))
plt.grid(True)

# Save Figure
plt.savefig("analysis/news_mood_scatter_plot.png")

plt.show()
```

### Overall Sentiment  Analysis
Average compound score is calculated for each media source and added to a list of dictionaries. Then create a dataframe from the overall sentiment analysis list.


```python
# Print the Averages
overall_sentiment_list = []
for target in target_user:
   # Create a dictionaty of results
    media_source_df = sentiments_pd.loc[sentiments_pd["Media Source"] == target]
    aggregate_dict = {
        "Media Source": target,
        "Compound Score": np.mean(media_source_df["Compound"]),
    }
    overall_sentiment_list.append(aggregate_dict)

overall_sentiment_df = pd.DataFrame(overall_sentiment_list).round(3)
overall_sentiment_df
```

## Bar Plot
Bar plot has been plotted for Compound sentiment score versus media source. And the aesthetics for the bar plot are defined.
After creating the plot, save the plot to a .PNG file.


```python
# Create an array that contains the overall compound sentiment score
x_axis = np.arange(len(overall_sentiment_df))
tick_locations = [value for value in x_axis]

fig1 = plt.figure(figsize=(8,5))
ax1 = fig1.add_subplot(1,1,1)

colors = ["cyan","green", "red", "darkblue", "gold"]
plt.bar(x_axis, overall_sentiment_df["Compound Score"],
        color=colors, alpha=0.5, width=1.0, align="center")

plt.xticks(tick_locations, overall_sentiment_df["Media Source"])
ax1.set_xticklabels(("BBC", "CBS", "CNN", "FOX", "NYT"))
ax1.set_yticks(np.arange(overall_sentiment_df["Compound Score"].min()-0.01, 
                        overall_sentiment_df["Compound Score"].max()+0.01,
                        0.05))

# Set x and y limits
plt.xlim(-0.75, len(x_axis)-0.25)
plt.ylim([overall_sentiment_df["Compound Score"].min()-0.03, overall_sentiment_df["Compound Score"].max()+0.01])

# Set a Title and labels
plt.title(f"Overall Media Sentiment based on Twitter ({now})")
plt.xlabel("Media Source", fontsize=15)
plt.ylabel("Tweet Polarity", fontsize=15)

# set individual bar lables using above list
for i in ax1.patches:
    # get_x pulls left or right; get_height pushes up or down
    ax1.text(i.get_x()+.35, i.get_height()-0.01,\
            str(round((i.get_height()), 2)), fontsize=11, color="black")

# Save graph and show
plt.tight_layout()
plt.grid(False)
plt.savefig("analysis/overall_sentiment_analysis.png")
plt.show()
```
