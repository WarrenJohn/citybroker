const trade_num = document.getElementById("trade-num");
const entrydate = document.getElementById("entry-date");
const add_other_cond = document.getElementById("add-other-cond");
const add_cond_div = document.getElementById("otherconditions-div");
const add_inside_ref = document.getElementById("add-inside-ref");
const inside_ref_div = document.getElementById("insidereferral-div");
const add_outside_ref = document.getElementById("add-outside-ref");
const outside_ref_div = document.getElementById("outsidereferral-div");

const validate_fields = document.getElementsByTagName("input");
let validate_field_array = [];

for (let field_name of validate_fields){
    validate_field_array.push(field_name.name);
}

let cond_counter = 0;
let inside_referral_counter = 0;
let outside_referral_counter = 0;
trade_num.textContent += " " + userJSON.info[0];
entrydate.textContent += " " + userJSON.info[1];


// EXPANDABLES / EXTENDABLES
function other_condition(){
    cond_counter++;
    let input_attrs = [["type","text"], ["name","othercond" + cond_counter], ["placeholder","Condition"], ["class", "form-control"]];
    let date_attrs = [
        ["type", "date"], ["name", "otherconddatedue" + cond_counter], ["placeholder", "Condition Due Date"],
        ["class", "form-control"]];
    let time_attrs = [
        ["type", "time"], ["name", "othercondtimedue" + cond_counter], ["placeholder", "Condition Due Time"],
        ["class", "form-control"]];
    let input = document.createElement("input");
    let date_input = document.createElement("input");
    let time_input = document.createElement("input");
    let para_time = document.createElement("p");
    let div_divider = document.createElement("div");
    let main_div = document.createElement("div");
    let remove = document.createElement("button");
    let remove_div = document.createElement("div");

    remove.setAttribute("type", "button");
    remove.setAttribute("title", "Remove Condition");
    remove.className = "btn btn-danger";
    remove_div.className = "text-right";
    remove_div.appendChild(remove);

    div_divider.className = "dropdown-divider";
    para_time.setAttribute("style", "margin-bottom:-1px");
    para_time.textContent = "Due Date & Time";
    input_attrs.forEach(attr => input.setAttribute(attr[0], attr[1]));
    date_attrs.forEach(attr => date_input.setAttribute(attr[0], attr[1]));
    time_attrs.forEach(attr => time_input.setAttribute(attr[0], attr[1]));
    [remove_div, input, para_time, date_input, time_input, div_divider].forEach(each => main_div.appendChild(each));
    return main_div;
}

function inside_ref(){
    inside_referral_counter++;
    let name_attrs = [
        ["class", "form-control"], ["type", "text"], ["name", "insideref" + inside_referral_counter],
        ["placeholder", "Agent Name"]];
    let amount_attrs = [
        ["class", "form-control"], ["type", "text"], ["name", "insiderefamount" + inside_referral_counter], ["pattern" ,"\\d*"],
        ["placeholder", "Amount"]];
    let div_attrs = [["class","btn-group btn-group-toggle"], ["data-toggle","buttons"]];
    let pct_lbl_attrs = [["class","btn btn-light"], ["for", "insiderefpercent" + inside_referral_counter]];
    let pct_radio_attrs = [
        ["autocomplete", "off"], ["class", "form-control"],  ["type", "radio"],
        ["name", "insiderefpctordol" + inside_referral_counter], ["id", "insiderefpercent" + inside_referral_counter], ["value", "percent"]];
    let dol_lbl_attrs = [["class","btn btn-light"], ["for","insiderefdollar" + inside_referral_counter]];
    let dol_radio_attrs = [
        ["autocomplete", "off"], ["class", "form-control"], ["type", "radio"],
        ["name", "insiderefpctordol" + inside_referral_counter], ["id", "insiderefdollar" + inside_referral_counter], ["value", "dollar"]];
    let div_divider = document.createElement("div");
    // let para = document.createElement("p");
    let main_div = document.createElement("div");
    let remove = document.createElement("button");
    let remove_div = document.createElement("div");
    let name = document.createElement("input");
    let amount = document.createElement("input");
    let div = document.createElement("div");
    let pct_lbl = document.createElement("label");
    let pct_radio = document.createElement("input");
    let dol_lbl = document.createElement("label");
    let dol_radio = document.createElement("input");

    remove.setAttribute("type", "button");
    remove.setAttribute("title", "Remove Referral");
    remove.className = "btn btn-danger";
    remove_div.className = "text-right";
    remove_div.appendChild(remove);

    name_attrs.forEach(attr => name.setAttribute(attr[0], attr[1]));
    amount_attrs.forEach(attr => amount.setAttribute(attr[0], attr[1]));
    div_attrs.forEach(attr => div.setAttribute(attr[0], attr[1]));
    pct_lbl_attrs.forEach(attr => pct_lbl.setAttribute(attr[0], attr[1]));
    pct_radio_attrs.forEach(attr => pct_radio.setAttribute(attr[0], attr[1]));
    dol_lbl_attrs.forEach(attr => dol_lbl.setAttribute(attr[0], attr[1]));
    dol_radio_attrs.forEach(attr => dol_radio.setAttribute(attr[0], attr[1]));

    div_divider.className = "dropdown-divider";
    pct_lbl.appendChild(pct_radio);
    dol_lbl.appendChild(dol_radio);
    pct_lbl.innerHTML += "%";
    dol_lbl.innerHTML += "$";

    [pct_lbl, dol_lbl].forEach(each => div.appendChild(each));
    [remove_div, name, amount, div, div_divider].forEach(each => main_div.appendChild(each));
    return main_div;
}

function outside_ref(){
    outside_referral_counter++;
    let name_attrs = [
        ["class", "form-control"], ["type", "text"], ["name", "outsideref" + outside_referral_counter],
        ["placeholder", "Agent Name"]];
    let amount_attrs = [
        ["class", "form-control"], ["type", "text"], ["name", "outsiderefamount" + outside_referral_counter], ["pattern" ,"\\d*"],
        ["placeholder", "Amount"]];
    let brokerage_attrs = [
        ["class", "form-control"], ["type", "text"], ["name", "outsiderefbrokerage" + outside_referral_counter],
        ["placeholder", "Referral Agent Brokerage"]];
    let address_attrs = [
        ["class", "form-control"], ["type", "text"], ["name", "outsiderefaddress" + outside_referral_counter],
        ["placeholder", "Referral Agent Full Address"]];
    let phone_attrs = [
        ["class", "form-control"], ["type", "tel"], ["name", "outsiderefphone" + outside_referral_counter], ["placeholder", "Referral Agent Phone #"]];
    let email_attrs = [
        ["class", "form-control"], ["type", "email"], ["name", "outsiderefemail" + outside_referral_counter],
        ["placeholder", "Referral Agent Email"]];
    let div_attrs = [["class","btn-group btn-group-toggle"], ["data-toggle","buttons"]];
    let pct_lbl_attrs = [["class","btn btn-light"], ["for", "outsiderefpercent" + outside_referral_counter]];
    let pct_radio_attrs = [
        ["autocomplete", "off"], ["class", "form-control"],  ["type", "radio"],
        ["name", "outsiderefpctordol" + outside_referral_counter], ["id", "outsiderefpercent" + outside_referral_counter],
        ["value", "percent"]];
    let dol_lbl_attrs = [["class","btn btn-light"], ["for","outsiderefdollar" + outside_referral_counter]];
    let dol_radio_attrs = [
        ["autocomplete", "off"], ["class", "form-control"], ["type", "radio"],
        ["name", "outsiderefpctordol" + outside_referral_counter], ["id", "outsiderefdollar" + outside_referral_counter],
        ["value", "dollar"]];

    let name = document.createElement("input");
    let brokerage = document.createElement("input");
    let address = document.createElement("input");
    let phone = document.createElement("input");
    let email = document.createElement("input");
    let amount = document.createElement("input");
    let div = document.createElement("div");
    let div_divider = document.createElement("div");
    let pct_lbl = document.createElement("label");
    let pct_radio = document.createElement("input");
    let dol_lbl = document.createElement("label");
    let dol_radio = document.createElement("input");
    let main_div = document.createElement("div");
    let remove = document.createElement("button");
    let remove_div = document.createElement("div");

    remove.setAttribute("type", "button");
    remove.setAttribute("title", "Remove Referral");
    remove.className = "btn btn-danger";
    remove_div.className = "text-right";
    remove_div.appendChild(remove);

    name_attrs.forEach(attr => name.setAttribute(attr[0], attr[1]));
    brokerage_attrs.forEach(attr => brokerage.setAttribute(attr[0], attr[1]));
    address_attrs.forEach(attr => address.setAttribute(attr[0], attr[1]));
    phone_attrs.forEach(attr => phone.setAttribute(attr[0], attr[1]));
    email_attrs.forEach(attr => email.setAttribute(attr[0], attr[1]));
    amount_attrs.forEach(attr => amount.setAttribute(attr[0], attr[1]));
    div_attrs.forEach(attr => div.setAttribute(attr[0], attr[1]));
    pct_lbl_attrs.forEach(attr => pct_lbl.setAttribute(attr[0], attr[1]));
    pct_radio_attrs.forEach(attr => pct_radio.setAttribute(attr[0], attr[1]));
    dol_lbl_attrs.forEach(attr => dol_lbl.setAttribute(attr[0], attr[1]));
    dol_radio_attrs.forEach(attr => dol_radio.setAttribute(attr[0], attr[1]));

    div_divider.className = "dropdown-divider";
    pct_lbl.appendChild(pct_radio);
    dol_lbl.appendChild(dol_radio);
    pct_lbl.innerHTML += "%";
    dol_lbl.innerHTML += "$";

    [pct_lbl, dol_lbl].forEach(each => div.appendChild(each));
    [remove_div, name, brokerage, address, phone, email, amount, div, div_divider].forEach(each => main_div.appendChild(each));
    return main_div;
}

add_other_cond.addEventListener("click", () => add_cond_div.appendChild(other_condition()));
add_inside_ref.addEventListener("click", () => inside_ref_div.appendChild(inside_ref()));
add_outside_ref.addEventListener("click", () => outside_ref_div.appendChild(outside_ref()));


inside_ref_div.addEventListener("click", e => {
	if(e.target && e.target.nodeName == "BUTTON") {
        let remove_ref = e.target.parentNode.parentNode;

        while (remove_ref.firstChild) {
            remove_ref.removeChild(remove_ref.firstChild);
        }
        if(remove_ref) {
            remove_ref.parentNode.removeChild(remove_ref);
        }
	}
});

outside_ref_div.addEventListener("click", e => {
	if(e.target && e.target.nodeName == "BUTTON") {
        let remove_ref = e.target.parentNode.parentNode;

        while (remove_ref.firstChild) {
            remove_ref.removeChild(remove_ref.firstChild);
        }
        if(remove_ref) {
            remove_ref.parentNode.removeChild(remove_ref);
        }
	}
});

add_cond_div.addEventListener("click", e => {
	if(e.target && e.target.nodeName == "BUTTON") {
        let remove_ref = e.target.parentNode.parentNode;

        while (remove_ref.firstChild) {
            remove_ref.removeChild(remove_ref.firstChild);
        }
        if(remove_ref) {
            remove_ref.parentNode.removeChild(remove_ref);
        }
	}
});

document.getElementById("citybrokeraccountlabel").addEventListener("click", () => {
    document.getElementById("depositaccountother").style.display = "none";
    document.getElementById("depositaccountother").required = false;
});

document.getElementById("depositaccountotherlabel").addEventListener("click", () => {
    document.getElementById("depositaccountother").style.display = "block";
    document.getElementById("depositaccountother").required = true;
});

document.getElementById("depositrcvdlabelyes").addEventListener("click", () => {
    document.getElementById("depositreceiveddate").required = true;
    document.getElementById("depositreceivedfrom").required = true;
    document.getElementById("chequenum").required = true;
    document.getElementById("interestyes").required = true;
    document.getElementById("interestno").required = true;
});
document.getElementById("depositrcvdlabelno").addEventListener("click", () => {
    document.getElementById("depositreceiveddate").required = false;
    document.getElementById("depositreceivedfrom").required = false;
    document.getElementById("chequenum").required = false;
    document.getElementById("interestyes").required = false;
    document.getElementById("interestno").required = false;
});

document.getElementById("lfirm").addEventListener("click", () => {
    document.getElementById("conditions-div").style.display = "none";
});

document.getElementById("lconditional").addEventListener("click", () => {
    document.getElementById("conditions-div").style.display = "block";
});
