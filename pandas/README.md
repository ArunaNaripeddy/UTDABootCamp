
# Heroes Of Pymoli Data Analysis
* Of the 573 active players, the vast majority are male (81%). There also exists, a smaller, but notable proportion of female players (17.45%).

* Our peak age demographic falls between 20-24 (45%) with secondary groups falling between 15-19 (17.45%) and 25-29 (15.18%).

* Players in all age groups are equally active with purchases and the average purchase for a player is `$`2.93. Even in different age groups and demographics the average purchase price is roughly around the same(`$`2.93)
-----


```python
import pandas as pd
filename = 'purchase_data.json'
purchase_df = pd.read_json(filename)
```


```python
purchase_df.head()
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Age</th>
      <th>Gender</th>
      <th>Item ID</th>
      <th>Item Name</th>
      <th>Price</th>
      <th>SN</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>38</td>
      <td>Male</td>
      <td>165</td>
      <td>Bone Crushing Silver Skewer</td>
      <td>3.37</td>
      <td>Aelalis34</td>
    </tr>
    <tr>
      <th>1</th>
      <td>21</td>
      <td>Male</td>
      <td>119</td>
      <td>Stormbringer, Dark Blade of Ending Misery</td>
      <td>2.32</td>
      <td>Eolo46</td>
    </tr>
    <tr>
      <th>2</th>
      <td>34</td>
      <td>Male</td>
      <td>174</td>
      <td>Primitive Blade</td>
      <td>2.46</td>
      <td>Assastnya25</td>
    </tr>
    <tr>
      <th>3</th>
      <td>21</td>
      <td>Male</td>
      <td>92</td>
      <td>Final Critic</td>
      <td>1.36</td>
      <td>Pheusrical25</td>
    </tr>
    <tr>
      <th>4</th>
      <td>23</td>
      <td>Male</td>
      <td>63</td>
      <td>Stormfury Mace</td>
      <td>1.27</td>
      <td>Aela59</td>
    </tr>
  </tbody>
</table>
</div>



## Player Count


```python
# Finding total number of unique players

player_count = len(purchase_df["SN"].unique())
total_players = pd.DataFrame({"Total players": [player_count]})
total_players

```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Total players</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>573</td>
    </tr>
  </tbody>
</table>
</div>



## Purchasing Analysis (Total)


```python
# Purchasing Analysis (Total)
# Finding number of unique items in the purchase dataset
group_unique_items = purchase_df.groupby(['Item ID', 'Item Name'])
unique_items = len(group_unique_items)

# Finding the average and total amount of purchases 
avg_price = purchase_df[['Price']].mean()
total_revenue = purchase_df[['Price']].sum()

# Finding the total number of Items purchased
total_purchases = purchase_df['Item ID'].count()

# Creating a summary table for Total Purchasing Analysis
total_purchase_table = pd.DataFrame({'Number of Unique Items': [unique_items],\
                                      'Average Price': avg_price.map('${:.2f}'.format),\
                                      'Number of Purchases': total_purchases,\
                                      'Total Revenue': total_revenue.map('${:,}'.format)})

# Ordering the columns and dropping the grouped 'index' column
columns = ['Number of Unique Items', 'Average Price', 'Number of Purchases', 'Total Revenue']
total_purchase_summary_df = total_purchase_table[columns]
total_purchase_summary_df.reset_index(drop=True)
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Number of Unique Items</th>
      <th>Average Price</th>
      <th>Number of Purchases</th>
      <th>Total Revenue</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>0</th>
      <td>183</td>
      <td>$2.93</td>
      <td>780</td>
      <td>$2,286.33</td>
    </tr>
  </tbody>
</table>
</div>



## Gender Demographics


```python
# Finding total number of unique players
total_gender_count = purchase_df['SN'].nunique()

# Finding total number of unique players by gender
grouped_gender = purchase_df.groupby(['Gender'])['SN'].nunique()

# Finding percentage of players by gender
player_percentage = (grouped_gender/total_gender_count)*100

# Creating a summary table for demographics by gender
demographics = pd.DataFrame({'Percentage of Players': player_percentage.map("{:.2f}%".format),\
                              'Total Count': grouped_gender})
demographics.index.name = None
demographics.sort_values('Percentage of Players', ascending=False)


```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Percentage of Players</th>
      <th>Total Count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Male</th>
      <td>81.15%</td>
      <td>465</td>
    </tr>
    <tr>
      <th>Female</th>
      <td>17.45%</td>
      <td>100</td>
    </tr>
    <tr>
      <th>Other / Non-Disclosed</th>
      <td>1.40%</td>
      <td>8</td>
    </tr>
  </tbody>
</table>
</div>




## Purchasing Analysis (Gender)


```python
# Purchase Analysis by Gender
# Computing Purchase Count 
gender_group = purchase_df.groupby(['Gender'])
purchase_count = gender_group['Price'].count()

# Calculating the Average price per Gender group
average_price = gender_group['Price'].mean()

# Calculating the total purchases in the dataset
total_purchase = gender_group['Price'].sum()

# Calculating the unique player count per gender group
player_count = gender_group['SN'].nunique()

# Calculating the Normalized Totals for each gender
normalized_totals = (total_purchase/player_count)

# Creating the summary dataframe for Purchase Anlaysis(Gender) and formatting 
gender_purchase_analysis_df = pd.DataFrame({'Purchase Count': purchase_count, 
                                            'Average Purchase Price': average_price.map('${:.2f}'.format),
                                            'Total Purchase Value': total_purchase.map('${:,.2f}'.format),
                                            'Normalized Totals': normalized_totals.map('${:.2f}'.format)})

# Ordering the columns in the output table
columns = ['Purchase Count', 'Average Purchase Price', 'Total Purchase Value', 'Normalized Totals']
gender_purchase_analysis_df = gender_purchase_analysis_df[columns]
gender_purchase_analysis_df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Purchase Count</th>
      <th>Average Purchase Price</th>
      <th>Total Purchase Value</th>
      <th>Normalized Totals</th>
    </tr>
    <tr>
      <th>Gender</th>
      <th></th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Female</th>
      <td>136</td>
      <td>$2.82</td>
      <td>$382.91</td>
      <td>$3.83</td>
    </tr>
    <tr>
      <th>Male</th>
      <td>633</td>
      <td>$2.95</td>
      <td>$1,867.68</td>
      <td>$4.02</td>
    </tr>
    <tr>
      <th>Other / Non-Disclosed</th>
      <td>11</td>
      <td>$3.25</td>
      <td>$35.74</td>
      <td>$4.47</td>
    </tr>
  </tbody>
</table>
</div>



## Age Demographics


```python
# Age Demographics

# Copying the original dataset to a new dataframe 
purchase_demo_df = pd.DataFrame(purchase_df)

# Create the bins in which Data will be held
# Bins are (0 < x <= 9), (9 < x <= 14), (14 < x <= 19),(19 < x <= 24), 
#         (24 < x <= 29), (29 < x <= 34), (34 < x <= 39),(39 < x <= 50)
bins = [0, 9, 14, 19, 24, 29, 34, 39, 50]

# Create Labels for the bins
group_names = ['<10', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40+']

# Splitting age groups into bins and adding the resultant series to the Purchase dataframe
purchase_demo_df['Age Category']  = pd.cut(purchase_demo_df['Age'], bins, labels=group_names)

# Grouping by Age Category 
group_age_series = purchase_demo_df.groupby(['Age Category'])

# Calculating unique player count per each Age Category.
unique_players = group_age_series['SN'].nunique()
# Converting the series to a Dataframe and renaming the count column
unique_players_df = pd.DataFrame(unique_players).rename(columns={'SN': 'Total Count'})

# Calculating the total number of players in the dataset
total_player_count = unique_players.sum()

# Calculating the percentage of players per each age group, and formatting with two decimal places
percent_player_count = round((unique_players/total_player_count)*100,2)

# Converting the series to a Dataframe and renaming the percentage count column
percent_player_count_df = pd.DataFrame(percent_player_count).rename(columns={'SN': 'Percentage of Players'})

# Merging the percent_player dataframe and unique_player dataframe with 'Age Category' as index 
age_demography_df = pd.merge(percent_player_count_df, unique_players_df, left_index=True, right_index=True, how='inner')
age_demography_df.index.name=None

# Formatting the Percentage of Players column
age_demography_df['Percentage of Players'] = age_demography_df['Percentage of Players'].map('{:.2f}%'.format)
age_demography_df

```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Percentage of Players</th>
      <th>Total Count</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>&lt;10</th>
      <td>3.32%</td>
      <td>19</td>
    </tr>
    <tr>
      <th>10-14</th>
      <td>4.01%</td>
      <td>23</td>
    </tr>
    <tr>
      <th>15-19</th>
      <td>17.45%</td>
      <td>100</td>
    </tr>
    <tr>
      <th>20-24</th>
      <td>45.20%</td>
      <td>259</td>
    </tr>
    <tr>
      <th>25-29</th>
      <td>15.18%</td>
      <td>87</td>
    </tr>
    <tr>
      <th>30-34</th>
      <td>8.20%</td>
      <td>47</td>
    </tr>
    <tr>
      <th>35-39</th>
      <td>4.71%</td>
      <td>27</td>
    </tr>
    <tr>
      <th>40+</th>
      <td>1.92%</td>
      <td>11</td>
    </tr>
  </tbody>
</table>
</div>



## Purchasing Analysis (Age)


```python
# Purchase Analysis (Age)

# Copying the original dataset to a new dataframe 
purchase_age_df = pd.DataFrame(purchase_df)

# Create the bins in which Data will be held
# Bins are (0 < x <= 9), (9 < x <= 14), (14 < x <= 19),(19 < x <= 24), 
#         (24 < x <= 29), (29 < x <= 34), (34 < x <= 39),(39 < x <= 50)
bins = [0, 9, 14, 19, 24, 29, 34, 39, 50]

# Create Labels for the bins
group_names = ['<10', '10-14', '15-19', '20-24', '25-29', '30-34', '35-39', '40+']

# Splitting age groups into bins and adding the resultant series to the Purchase dataframe
purchase_age_df['Age Category']  = pd.cut(purchase_age_df['Age'], bins, labels=group_names)

# Grouping by Age Category 
group_age_series = purchase_age_df.groupby(['Age Category'])

# Calculating Total player count per each Age Category.
player_count_age_group = group_age_series['SN'].nunique()

# Calculating Purchase Count by Age Category
purchase_count = group_age_series['Price'].count()
purchase_count

# Calculating the Average Purchase Value by Age Category
average_purchase_value = group_age_series['Price'].mean()

# Calculating the Total Purchase Value by Age Category
total_purchase_value = group_age_series['Price'].sum()

# Calculating the Normalized Totals for each gender
normalized_totals = (total_purchase_value/player_count_age_group)

# Creating the summary dataframe for Purchase Anlaysis(Age) and formatting 
purchase_analysis_byage_df = pd.DataFrame({'Purchase Count': purchase_count,
                                           'Average Purchase Value': average_purchase_value.map('${:.2f}'.format),
                                           'Total Purchase Value': total_purchase_value.map('${:.2f}'.format),
                                           'Normalized Totals': normalized_totals.map('${:.2f}'.format)})

# Ordering the columns in the output table 
columns = ['Purchase Count', 'Average Purchase Value', 'Total Purchase Value', 'Normalized Totals']
purchase_analysis_byage_df = purchase_analysis_byage_df[columns]

# Dropping the index name
purchase_analysis_byage_df.index.name = None
purchase_analysis_byage_df
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Purchase Count</th>
      <th>Average Purchase Value</th>
      <th>Total Purchase Value</th>
      <th>Normalized Totals</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>&lt;10</th>
      <td>28</td>
      <td>$2.98</td>
      <td>$83.46</td>
      <td>$4.39</td>
    </tr>
    <tr>
      <th>10-14</th>
      <td>35</td>
      <td>$2.77</td>
      <td>$96.95</td>
      <td>$4.22</td>
    </tr>
    <tr>
      <th>15-19</th>
      <td>133</td>
      <td>$2.91</td>
      <td>$386.42</td>
      <td>$3.86</td>
    </tr>
    <tr>
      <th>20-24</th>
      <td>336</td>
      <td>$2.91</td>
      <td>$978.77</td>
      <td>$3.78</td>
    </tr>
    <tr>
      <th>25-29</th>
      <td>125</td>
      <td>$2.96</td>
      <td>$370.33</td>
      <td>$4.26</td>
    </tr>
    <tr>
      <th>30-34</th>
      <td>64</td>
      <td>$3.08</td>
      <td>$197.25</td>
      <td>$4.20</td>
    </tr>
    <tr>
      <th>35-39</th>
      <td>42</td>
      <td>$2.84</td>
      <td>$119.40</td>
      <td>$4.42</td>
    </tr>
    <tr>
      <th>40+</th>
      <td>17</td>
      <td>$3.16</td>
      <td>$53.75</td>
      <td>$4.89</td>
    </tr>
  </tbody>
</table>
</div>



## Top Spenders


```python
#Top 5 spenders list
sn_df = purchase_df.groupby(['SN'])

# Finding the total count, average and the total purchases in price
purchase_count = sn_df['Price'].count()
avg_purchase_price = sn_df['Price'].mean()
total_purchase_price = sn_df['Price'].sum()

# Creating a summary table for Spender's Analysis List
total_spend_table = pd.DataFrame({'Purchase Count': purchase_count,\
                                  'Average Purchase Price': avg_purchase_price.map('${:.2f}'.format),\
                                  'Total Purchase Value': total_purchase_price})

# Ordering the columns and sorting the table by descending order
columns = ['Purchase Count', 'Average Purchase Price', 'Total Purchase Value']
total_spending_df = total_spend_table[columns].sort_values('Total Purchase Value',ascending=False)

# Formatting the Total Purchase Value
total_spending_df['Total Purchase Value'] = total_spending_df['Total Purchase Value'].map('${:.2f}'.format)

# Selecting the top 5 max spenders in the dataset
total_spending_df.iloc[0:5,]
```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th>Purchase Count</th>
      <th>Average Purchase Price</th>
      <th>Total Purchase Value</th>
    </tr>
    <tr>
      <th>SN</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>Undirrala66</th>
      <td>5</td>
      <td>$3.41</td>
      <td>$17.06</td>
    </tr>
    <tr>
      <th>Saedue76</th>
      <td>4</td>
      <td>$3.39</td>
      <td>$13.56</td>
    </tr>
    <tr>
      <th>Mindimnya67</th>
      <td>4</td>
      <td>$3.18</td>
      <td>$12.74</td>
    </tr>
    <tr>
      <th>Haellysu29</th>
      <td>3</td>
      <td>$4.24</td>
      <td>$12.73</td>
    </tr>
    <tr>
      <th>Eoda93</th>
      <td>3</td>
      <td>$3.86</td>
      <td>$11.58</td>
    </tr>
  </tbody>
</table>
</div>



## Most Popular Items


```python
# Most Popular Items

# Get the unique items by grouping Item ID and Item Name columns
items_group = purchase_df.groupby(['Item ID','Item Name'])

# Getting the purchase count for each Item
purchase_count = items_group['Price'].count()

# Calculating the average price of items
avg_price = items_group['Price'].mean()

# Calculating the total purchases
total_purchase  = items_group['Price'].sum()

# Creating the summary dataframe for displaying Most Profitable Items
profitable_table = pd.DataFrame({'Purchase Count': purchase_count,
                                    'Item Price': avg_price,
                                    'Total Purchase Value': total_purchase})

# Ordering the columns in the output table
columns = ['Purchase Count','Item Price','Total Purchase Value']
profitable_table = profitable_table[columns]

# Sort the table by 'Purchase Count' in descending order
profitable_table = profitable_table.sort_values('Purchase Count', ascending=False)

# formatting the purcahse value and Item Price
profitable_table['Total Purchase Value'] = profitable_table['Total Purchase Value'].map('${:.2f}'.format)
profitable_table['Item Price'] = profitable_table['Item Price'].map('${:.2f}'.format)
profitable_table.head()

```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>Purchase Count</th>
      <th>Item Price</th>
      <th>Total Purchase Value</th>
    </tr>
    <tr>
      <th>Item ID</th>
      <th>Item Name</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>39</th>
      <th>Betrayal, Whisper of Grieving Widows</th>
      <td>11</td>
      <td>$2.35</td>
      <td>$25.85</td>
    </tr>
    <tr>
      <th>84</th>
      <th>Arcane Gem</th>
      <td>11</td>
      <td>$2.23</td>
      <td>$24.53</td>
    </tr>
    <tr>
      <th>31</th>
      <th>Trickster</th>
      <td>9</td>
      <td>$2.07</td>
      <td>$18.63</td>
    </tr>
    <tr>
      <th>175</th>
      <th>Woeful Adamantite Claymore</th>
      <td>9</td>
      <td>$1.24</td>
      <td>$11.16</td>
    </tr>
    <tr>
      <th>13</th>
      <th>Serenity</th>
      <td>9</td>
      <td>$1.49</td>
      <td>$13.41</td>
    </tr>
  </tbody>
</table>
</div>



## Most Profitable Items


```python
# Most Profitable Items

# Get the unique items by grouping Item ID and Item Name columns
items_group = purchase_df.groupby(['Item ID','Item Name'])

# Getting the purchase count for each Item
purchase_count = items_group['Price'].count()

# Calculating the average price of items
avg_price = items_group['Price'].mean()

# Calculating the total purchases
total_purchase  = items_group['Price'].sum()

# Creating the summary dataframe for displaying Most Profitable Items
profitable_table = pd.DataFrame({'Purchase Count': purchase_count,
                                    'Item Price': avg_price,
                                    'Total Purchase Value': total_purchase})

# Ordering the columns in the output table
columns = ['Purchase Count','Item Price','Total Purchase Value']
profitable_table = profitable_table[columns]

# Sort the table by total purchase value in descending order
profitable_table = profitable_table.sort_values('Total Purchase Value', ascending=False)

# formatting the purcahse value and Item Price
profitable_table['Total Purchase Value'] = profitable_table['Total Purchase Value'].map('${:.2f}'.format)
profitable_table['Item Price'] = profitable_table['Item Price'].map('${:.2f}'.format)
profitable_table.head()

```




<div>
<style scoped>
    .dataframe tbody tr th:only-of-type {
        vertical-align: middle;
    }

    .dataframe tbody tr th {
        vertical-align: top;
    }

    .dataframe thead th {
        text-align: right;
    }
</style>
<table border="1" class="dataframe">
  <thead>
    <tr style="text-align: right;">
      <th></th>
      <th></th>
      <th>Purchase Count</th>
      <th>Item Price</th>
      <th>Total Purchase Value</th>
    </tr>
    <tr>
      <th>Item ID</th>
      <th>Item Name</th>
      <th></th>
      <th></th>
      <th></th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <th>34</th>
      <th>Retribution Axe</th>
      <td>9</td>
      <td>$4.14</td>
      <td>$37.26</td>
    </tr>
    <tr>
      <th>115</th>
      <th>Spectral Diamond Doomblade</th>
      <td>7</td>
      <td>$4.25</td>
      <td>$29.75</td>
    </tr>
    <tr>
      <th>32</th>
      <th>Orenmir</th>
      <td>6</td>
      <td>$4.95</td>
      <td>$29.70</td>
    </tr>
    <tr>
      <th>103</th>
      <th>Singed Scalpel</th>
      <td>6</td>
      <td>$4.87</td>
      <td>$29.22</td>
    </tr>
    <tr>
      <th>107</th>
      <th>Splitter, Foe Of Subtlety</th>
      <td>8</td>
      <td>$3.61</td>
      <td>$28.88</td>
    </tr>
  </tbody>
</table>
</div>


