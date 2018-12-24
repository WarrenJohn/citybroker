import requests
from bs4 import BeautifulSoup
import sqlite3
import os

DATABASE = os.path.join(os.path.split(os.path.abspath(os.pardir))[0], "database", "articles.db")
conn = sqlite3.connect(DATABASE)
c = conn.cursor()


c.execute("CREATE TABLE IF NOT EXISTS tarion (indexer TEXT, article1 TEXT, article2 TEXT, article3 TEXT)")

c.execute("CREATE TABLE IF NOT EXISTS boc (indexer TEXT, article1 TEXT, article2 TEXT, article3 TEXT, ir_table TEXT)")


# TARION BLOG
link = "https://blog.tarion.com/archive/"

r = requests.get(link)
soup = BeautifulSoup(r.content, "html.parser")

# Contact Us link is list index [8]

blogs = soup.body.find_all("a")

most_recent = blogs[9:15]

# tarion blogsnip1
t = requests.get(most_recent[1].get('href'))
tsoup = BeautifulSoup(t.content, "html.parser")
tsnip1 = tsoup.find_all("p")
for each in tsnip1:
    parsed_tsnip1 = each.text
    break
parsed_tsnip1 = parsed_tsnip1[:300] + "..."

# tarion blognsip2
t = requests.get(most_recent[3].get('href'))
tsoup = BeautifulSoup(t.content, "html.parser")
tsnip2 = tsoup.find_all("p")
for each in tsnip2:
    parsed_tsnip2 = each.text
    break
parsed_tsnip2 = parsed_tsnip2[:300] + "..."

# tarion blogsnip3
t = requests.get(most_recent[5].get('href'))
tsoup = BeautifulSoup(t.content, "html.parser")
tsnip3 = tsoup.find_all("p")
for each in tsnip3:
    parsed_tsnip3 = each.text
    break
parsed_tsnip3 = parsed_tsnip3[:300] + "..."

recent1 = (most_recent[0].find('img').get('src'), most_recent[1].text, most_recent[1].get(
    'href'), parsed_tsnip1)  # img link, blog title, blog link, blog snip
recent2 = (most_recent[2].find('img').get('src'), most_recent[3].text, most_recent[3].get('href'), parsed_tsnip2)
recent3 = (most_recent[4].find('img').get('src'), most_recent[5].text, most_recent[5].get('href'), parsed_tsnip3)

# Get the Blog text, either in full or a snippet

# BANK OF CANADA

# Interest Rate Announcements
IR_link = "https://www.bankofcanada.ca/core-functions/monetary-policy/key-interest-rate/"
IR = requests.get(IR_link)
IR_soup = BeautifulSoup(IR.content, "html.parser")

IR_heading = IR_soup.find_all("h2")[34].text
IR_table = IR_soup.find_all("table")
IR_table = IR_table[1]

# Press Releases
PR_link = "https://www.bankofcanada.ca/press/press-releases/"
PR = requests.get(PR_link)
PR_soup = BeautifulSoup(PR.content, "html.parser")

PR_heading = PR_soup.body.find_all("a")
PR_parsed = [each for each in PR_heading if each.get("data-content-type") == "Press Releases"]

# boc blog 1
b = requests.get(PR_parsed[0].get("href"))  # Getting the blog snippet
bsoup = BeautifulSoup(b.content, "html.parser")
spans = bsoup.find_all("span", {"class": "post-content"})

for each in spans:
    spans_parsed = each.text
boc_snip1 = spans_parsed[:300] + "..."
# boc blog 2
b = requests.get(PR_parsed[1].get("href"))  # Getting the blog snippet
bsoup = BeautifulSoup(b.content, "html.parser")
spans = bsoup.find_all("span", {"class": "post-content"})

for each in spans:
    spans_parsed = each.text
boc_snip2 = spans_parsed[:300] + "..."
# boc blog 3
b = requests.get(PR_parsed[2].get("href"))  # Getting the blog snippet
bsoup = BeautifulSoup(b.content, "html.parser")
spans = bsoup.find_all("span", {"class": "post-content"})

for each in spans:
    spans_parsed = each.text
boc_snip3 = spans_parsed[:300] + "..."


PR_recent1 = (PR_parsed[0].text, PR_parsed[0].get("href"), boc_snip1)  # Title, Link, Snip
PR_recent2 = (PR_parsed[1].text, PR_parsed[1].get("href"), boc_snip2)
PR_recent3 = (PR_parsed[2].text, PR_parsed[2].get("href"), boc_snip3)


c.execute("UPDATE tarion SET article1 = ? WHERE indexer= 'blogimg'", (recent1[0],))
conn.commit()
c.execute("UPDATE tarion SET article1 = ? WHERE indexer= 'blogtitle'", (recent1[1],))
conn.commit()
c.execute("UPDATE tarion SET article1 = ? WHERE indexer= 'bloglink'", (recent1[2],))
conn.commit()
c.execute("UPDATE tarion SET article1 = ? WHERE indexer= 'blogsnip'", (recent1[3],))
conn.commit()

c.execute("UPDATE tarion SET article2 = ? WHERE indexer= 'blogimg'", (recent2[0],))
conn.commit()
c.execute("UPDATE tarion SET article2 = ? WHERE indexer= 'blogtitle'", (recent2[1],))
conn.commit()
c.execute("UPDATE tarion SET article2 = ? WHERE indexer= 'bloglink'", (recent2[2],))
conn.commit()
c.execute("UPDATE tarion SET article2 = ? WHERE indexer= 'blogsnip'", (recent2[3],))
conn.commit()

c.execute("UPDATE tarion SET article3 = ? WHERE indexer= 'blogimg'", (recent3[0],))
conn.commit()
c.execute("UPDATE tarion SET article3 = ? WHERE indexer= 'blogtitle'", (recent3[1],))
conn.commit()
c.execute("UPDATE tarion SET article3 = ? WHERE indexer= 'bloglink'", (recent3[2],))
conn.commit()
c.execute("UPDATE tarion SET article3 = ? WHERE indexer= 'blogsnip'", (recent3[3],))
conn.commit()


c.execute("UPDATE boc SET article1 = ? WHERE indexer= 'blogtitle'", (PR_recent1[0],))
conn.commit()
c.execute("UPDATE boc SET article1 = ? WHERE indexer= 'bloglink'", (PR_recent1[1],))
conn.commit()
c.execute("UPDATE boc SET article1 = ? WHERE indexer= 'blogsnip'", (PR_recent1[2],))
conn.commit()

c.execute("UPDATE boc SET article2 = ? WHERE indexer= 'blogtitle'", (PR_recent2[0],))
conn.commit()
c.execute("UPDATE boc SET article2 = ? WHERE indexer= 'bloglink'", (PR_recent2[1],))
conn.commit()
c.execute("UPDATE boc SET article2 = ? WHERE indexer= 'blogsnip'", (PR_recent2[2],))
conn.commit()

c.execute("UPDATE boc SET article3 = ? WHERE indexer= 'blogtitle'", (PR_recent3[0],))
conn.commit()
c.execute("UPDATE boc SET article3 = ? WHERE indexer= 'bloglink'", (PR_recent3[1],))
conn.commit()
c.execute("UPDATE boc SET article3 = ? WHERE indexer= 'blogsnip'", (PR_recent3[2],))
conn.commit()

c.execute("UPDATE boc SET ir_table = ? WHERE indexer= 'ir_table'", (str(IR_table),))
conn.commit()

c.execute("SELECT article1 FROM tarion")
tarion_stuff = c.fetchall()


conn.close()
