const background_img = document.getElementById("blog_bg");
const picture_heading = document.getElementById("picture_heading");
const blog_title = document.getElementById("blog_title");
const blog_content = document.getElementById("blog_content");
const blog_sidebar = document.getElementById("blog_sidebar");
const page_title = document.getElementById("title");

background_img.style.backgroundImage = "url(/static/images/articles/"+blogJSON.titlepic+")";
background_img.style.backgroundImage += "background-repeat: no-repeat;";
picture_heading.textContent = blogJSON.title;
blog_title.textContent = blogJSON.title;
page_title.textContent = blogJSON.title + " - CityBroker Real Estate London, ON";
blog_content.innerHTML = blogJSON.content;

for (let blog in blogJSON.other){
    let blog_snip = document.createElement("p");
    let blog_div = document.createElement("div");
    let blog_card = document.createElement("div");
    let blog_link = document.createElement("a");
    let blog_thumbnail = document.createElement("img");
    let blog_title = document.createElement("h5");

    blog_title.textContent = blogJSON.other[blog].title;
    blog_title.className = "card-title text-center";
    blog_thumbnail.className = "card-img-top p-2";
    blog_div.className = "card";
    blog_card.className = "card-body";
    blog_snip.className = "text-center card-text";
    blog_link.setAttribute("href", blogJSON.other[blog].link);
    blog_div.appendChild(blog_link);
    blog_thumbnail.setAttribute("src", "/static/images/articles/"+blogJSON.other[blog].thumbnail);
    blog_link.appendChild(blog_thumbnail);
    blog_link.appendChild(blog_title);
    blog_snip.innerHTML = blogJSON.other[blog].content.substring(0,150)+"...";
    blog_div.appendChild(blog_snip);
    blog_sidebar.appendChild(blog_div);
}
