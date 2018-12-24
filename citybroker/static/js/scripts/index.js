
// Last 7 days
const market = indexJSON.market;
const new_listings = market.na + market.sa + market.ea;
const cond_listings = market.nc + market.sc + market.ec;
const sold_listings = market.ns + market.ss + market.es;

const new_seven = document.getElementById("new_seven");
const cond_seven = document.getElementById("cond_seven");
const sold_seven = document.getElementById("sold_seven");

const market_outlook = document.getElementById("market");

let market_type = "";
let market_ratio = sold_listings / new_listings;

if (market_ratio > 0.55){
    market_type = "Seller's Market";
}
else if (market_ratio < 0.55 && market_ratio > 0.45){
    market_type = "Balanced Market";
}
else{
    market_type = "Buyer's Market";
}
market_outlook.textContent = market_type;
new_seven.textContent = new_listings;
cond_seven.textContent = cond_listings;
sold_seven.textContent = sold_listings;

const boc = indexJSON.boc;
const tarion = indexJSON.tarion;

irtable.innerHTML = indexJSON.boc.table;

boc1_link.setAttribute("href", boc.boc1_link);
boc1_title.textContent = boc.boc1_title;
boc1_snip.textContent = boc.boc1_snip;

boc2_link.setAttribute("href", boc.boc2_link);
boc2_title.textContent = boc.boc2_title;
boc2_snip.textContent = boc.boc2_snip;

boc3_link.setAttribute("href", boc.boc3_link);
boc3_title.textContent = boc.boc3_title;
boc3_snip.textContent = boc.boc3_snip;

tarion1_image.setAttribute("src", tarion.tarion1_image);
tarion1_title.textContent = tarion.tarion1_title;
tarion1_link.setAttribute("href", tarion.tarion1_link);
tarion1_snip.textContent = tarion.tarion1_snip;

tarion2_image.setAttribute("src", tarion.tarion2_image);
tarion2_title.textContent = tarion.tarion2_title;
tarion2_link.setAttribute("href", tarion.tarion2_link);
tarion2_snip.textContent = tarion.tarion2_snip;

tarion3_image.setAttribute("src", tarion.tarion3_image);
tarion3_title.textContent = tarion.tarion3_title;
tarion3_link.setAttribute("href", tarion.tarion3_link);
tarion3_snip.textContent = tarion.tarion3_snip;

const index_blog = indexJSON.blogs;
const blog1_link = document.getElementById("blog1_link");
const blog1_image = document.getElementById("blog1_image");
const blog1_heading = document.getElementById("blog1_heading");
const blog1_snip = document.getElementById("blog1_snip");
const blog2_link = document.getElementById("blog2_link");
const blog2_image = document.getElementById("blog2_image");
const blog2_heading = document.getElementById("blog2_heading");
const blog2_snip = document.getElementById("blog2_snip");
const blog3_link = document.getElementById("blog3_link");
const blog3_image = document.getElementById("blog3_image");
const blog3_heading = document.getElementById("blog3_heading");
const blog3_snip = document.getElementById("blog3_snip");

blog1_link.setAttribute("href", "blog/"+index_blog.blog1_link);
blog1_image.setAttribute("src", "static/images/articles/"+index_blog.blog1_thumbnail);
blog1_heading.textContent = index_blog.blog1_heading;
blog1_snip.innerHTML = index_blog.blog1_snip + "...";

blog2_link.setAttribute("href", "blog/"+index_blog.blog2_link);
blog2_image.setAttribute("src", "static/images/articles/"+index_blog.blog2_thumbnail);
blog2_heading.textContent = index_blog.blog2_heading;
blog2_snip.innerHTML = index_blog.blog2_snip + "...";

blog3_link.setAttribute("href", "blog/"+index_blog.blog3_link);
blog3_image.setAttribute("src", "static/images/articles/"+index_blog.blog3_thumbnail);
blog3_heading.textContent = index_blog.blog3_heading;
blog3_snip.innerHTML = index_blog.blog3_snip + "...";
