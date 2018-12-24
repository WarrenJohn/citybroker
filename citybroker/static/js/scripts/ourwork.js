const main = document.getElementById("listings-div");
const old = document.getElementById("old");

for (let ele of listingsJSON){
    let div = document.createElement("div"); // <div class="p-0 col-md-4 col-6"></div>
    div.className = "p-0 col-md-4 col-6";
    div.innerHTML = '<div class="container"><a href="property/' +  ele[0] + ' "><img src="static/images/listings/' + ele[0] +"/" + ele[2] + '" class="img-fluid"> <div class="overlay"><div class="text">' + ele[1] + '</div></a></div></div>';
    main.insertBefore(div, old);
}
