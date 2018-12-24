function validate_selector(selector, valid){
    if (selector.value === "-1"){
        selector.style = "outline: 1px solid red";
        valid.push(false);
    }
    else {
        selector.style = "";
        valid.push(true);
    }
}

document.getElementById("submit").addEventListener("click", () => {
    if (document.getElementById("beds").value === "-1"){
        document.getElementById("beds").style = "outline: 1px solid red";
    }else if(document.getElementById("baths").value === "-1"){
        document.getElementById("baths").style = "outline: 1px solid red";
    }else{
        document.getElementById("submit").type = "submit";
        document.getElementById("submit").click();
        document.getElementById("submit").disabled = true;
    }
});
