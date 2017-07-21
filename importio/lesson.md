## Web scraping with Import.io

**Outline:**

* Web-Interface
* Desktop version of Import.io: Connector
* Desktop version of Import.io: Extractor
* Web-Scraping with Python (demo)

**What you will need:**
Install Import.io

*Overview*: This assignment is aimed at using our workflow (Collect, Clean, Analyze) to prepare data for analysis. 

*Scenario*: A musicology researcher is interested in the locations of dance clubs in Los Angeles and wants to create a map of these; she is particularly interested in genres, so if you can get location and genre, that would be very nice. You've discovered that Yelp is a pretty up-to-date source of information.

*The Assignment*: You want to scrape information on the names, addresses, and genres of LA Dance Clubs using Import.io. Then you want to geocode the address (providing a couple of new columns -- lat & long) of each club based on the street address in OpenRefine. The goal is to have a spreadsheet with name, address (lat & lon), genres in a spreadsheet that we can start using with Tableau.

*Collect*: Import.io. You can do this assignment in the web-based Import.io. (The process will, however, be faster in the Import.io app.) Although the web-based version appears to just give you the first 10 results, you will find some functionality that allows you to add new URLs. Notice that the results, in Yelp, spread over several pages. You just keep adding slightly adjusted URLs into the program, scraping each successive page. (I will post some screenshots in Slack.)

https://www.yelp.com/search?find_desc=dance+clubs+&find_loc=Los+Angeles,+CA

Put the above URL into Import.io

https://osf.io/2e6vr/

E.g.

https://www.yelp.com/search?find_desc=dance+clubs+&find_loc=Los+Angeles,+CA&start=10

https://www.yelp.com/search?find_desc=dance+clubs+&find_loc=Los+Angeles,+CA&start=20

30, 40, 50, etc.

When you've added a whole batch of URLs, you save them, and then run the entire query. After extracting data from each one, you'll be able to save the csv file. The video above shows the process.

----------
**Other Resources:**

[Google doc][1] (brainstorming)

[Another Google doc][2] (from last  year's summer DResSUP mini-workshop on web scraping with Python)

[An older Google doc with Import.io screenshots][3]

  [1]: https://docs.google.com/document/d/1lwRgtBcBrTjbOzUNpeQYKMOA6DwM8uUlfsDhDoVMwbE/edit?usp=sharing
  [2]: https://docs.google.com/document/d/1evvpLe5gky0hhx53PRsi8KDs11PmQDghgzttFAXrWZg/edit?usp=sharing
  [3]: https://docs.google.com/document/d/1j4T6fHxZMX1aRWsV4J15DU-A_gPqDHq9vCRvI4KnCA4/edit
