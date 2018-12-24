const button_one = document.getElementById("button-one");
const button_two = document.getElementById("button-two");
const button_back = document.getElementById("button-back");
let one = document.getElementById("one");
let two = document.getElementById("two");

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

function validate_field(field, valid){
    if (field.tagName === "OPTION"){}
    else if (field.type === "select-one"){}
    else if (field.value === ""){
        field.style = "outline: 1px solid red";
        valid.push(false);
    }
    else{
        field.style = "";
        valid.push(true);
    }
}

function validate(valid){
    for (let i = 0; i < valid.length; i++){
        if (valid[i] === false){
            return false;
        }
    }
    return true;
}

function form_valid(form){
    let fields = form.getElementsByClassName("form-control");
    let inputs = form.getElementsByTagName("INPUT");
    let selectors = form.getElementsByTagName("SELECT");
    let node_array = Array();
    let is_valid = Array();
    let last = "";

    for (let i of selectors){
        validate_selector(i, is_valid);
    }
    for (let i of fields){
        validate_field(i, is_valid);
    }
    return validate(is_valid);
}

two.style.display = "none";

button_one.addEventListener("click", () => {
                    if (form_valid(one)){
                        one.style.display = "none"; two.style.display = "block";
                    }
                                            });

button_back.addEventListener("click", () => {one.style.display = "block"; two.style.display = "none";});

button_two.addEventListener("click", () => {
    button_two.type = "submit";
    button_two.click();
    button_two.disabled = true;
    // button_two uses .click() to allow the html5 form validation, .submit() will bypass this.
});
