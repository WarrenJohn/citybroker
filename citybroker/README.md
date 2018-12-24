## Citybroker Transaction Management

This app allows the user to keep regulatory compliant records for trades in real estate easily.

When all information is inputted, and all documents are uploaded, the app will send a pre-package email and send it to all parties involved,
outlining the important dates, terms and conditions with the documents attached. Trade records are generated for every transaction, detailing the flow
of money and the timeline of the transaction.

The app is hosted on Digital Ocean using Ubuntu 16.04. It uses the python framework Flask, an nginx reverse proxy and gunicorn wsgi.

Methodology followed when designing the app: http://exploreflask.com/en/latest/index.html

### What this app does

* Handle users logging in and out
* Changing passwords
* Add extra sales people
* Input real estate trade details in a regulation compliant manner
* Modify any logical aspect of the trade at a later date if needed
* Add and handle a dynamic/arbitrary number of referrals (internal, or external), and conditions/terms (such as well water testing) to the transaction
while maintaining financial integrity in the calculations
* Tracking trade status
* Perform all financial calculations, create a trade record, and display all information necessary to comply with regulations
* Automatically email documents uploaded to all necessary parties (mortgage brokers, lawyers, etc..), and all needed information (like conditions due dates, or terms)
    * Sent using mailgun API
    * Documents size checked, sorted into nested lists based on file size limit of API and then sends one email per nested list.
* Add listings for marketing purposes
* Show current, real time (updated hourly) local real estate market data in an easily understandable format
    * Days on market for the city and by area, over time
    * Average sale prices for the city and by area, over time
    * Number of listings, pending sales, and firm sales by day and week, over time
* Gets most recent news from Tarion New Home Warranty, and the Bank of Canada to display on main page
* Simple zoning keyword lookup - allows user to easily determine what potential zoning their use-case (hotel, gas station, etc.. ) will fall under.
The city website does not offer any search function for zoning, and you would need to look through 50+ sections to find the needed info.

### Database structure

The databases are structured with a JSON column, and 2 - 5 other columns containing information commonly queried. Database i/o is handled with a custom
module I created for another project (simplesql3) and was used extensively to help easily manage database connections, selections, updates, and
insertions and maintain readability.

### Other stuff

There is an instance folder in the root dir containing a config.py that stores the API key, API links, and session key. I have obviously omitted this.

There's a cron/ folder that holds a few scripts for fetching data. The various cronjobs I have set up run the scripts in this folder. They are mainly
auxiliary functions of the website, but include things like parsing data then running the calculations needed for the market insights, accessing gmail
for data processing using the gmail api, and grabbing the latest news from the BoC and Tarion websites. I omitted some scripts in this directory
because there is private data in the scripts.
