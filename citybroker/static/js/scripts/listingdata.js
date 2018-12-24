const address = document.getElementById("address");
const mls = document.getElementById("mls");
const price_beds_bath = document.getElementById("price-beds-bath");
const description = document.getElementById("description");
const main_pic = document.getElementById("main_pic");
const photos = document.getElementById("photos");
const status = document.getElementById("status");
const title = document.getElementById("title");
const pics_row = document.getElementById("listing_pics");

let pbb_string = "$" + listingJSON.data.Price;

if (listingJSON.data.Beds > 1){
    pbb_string += " - " + listingJSON.data.Beds + " Bedrooms";
} else{
    pbb_string += " - " + listingJSON.data.Beds + " Bedroom";
}
if (listingJSON.data.Baths > 1){
    pbb_string += " - " + listingJSON.data.Baths + " Bathrooms";
} else{
    pbb_string += " - " + listingJSON.data.Baths + " Bathroom";
}

if (listingJSON.status === "SOLD"){
    status.innerHTML = "<h3>SOLD</h3><br>Warren John<br>519.902.1386 <br>warren@citybroker.ca<br>";
}else{
    status.innerHTML ="Contact Warren to book your private showing today.<br>519.902.1386 <br>warren@citybroker.ca<br>";
}
address.textContent = listingJSON.address;
mls.textContent = "MLS#: " + listingJSON.data.MLS;
price_beds_bath.textContent = pbb_string;
description.textContent = listingJSON.data.Description;
main_pic.setAttribute("src", "/"+listingJSON.pics_folder+"/"+listingJSON.main_pic);
title.textContent = listingJSON.address;

for (let i = 0; i < listingJSON.pic_names.length; i++){
    if (listingJSON.pic_names[i] === listingJSON.main_pic){
        continue;
    }
    let pic_div = document.createElement("div");
    let img_ele = document.createElement("img");
    let img_path = "/"+listingJSON.pics_folder+"/"+listingJSON.pic_names;
    img_ele.className = "img-fluid";
    pic_div.className = "p-0 col-md-4 col-6";
    img_ele.setAttribute("src", "/"+listingJSON.pics_folder+"/"+listingJSON.pic_names[i]);
    pic_div.appendChild(img_ele);
    pics_row.appendChild(pic_div);
}
