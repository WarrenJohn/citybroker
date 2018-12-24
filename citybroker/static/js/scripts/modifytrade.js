const add_other_cond = document.getElementById("add-other-cond");
const add_cond_div = document.getElementById("otherconditions-div");
const add_inside_ref = document.getElementById("add-inside-ref");
const inside_ref_div = document.getElementById("insidereferral-div");
const add_outside_ref = document.getElementById("add-outside-ref");
const outside_ref_div = document.getElementById("outsidereferral-div");
let outside_ref_remove = Array();
let inside_ref_remove = Array();
let cond_other_remove = Array();
let outside_ref_arr = Array();
let inside_ref_arr = Array();
let other_cond_arr = Array();
let cond_counter = 0;
let inside_referral_counter = 0;
let outside_referral_counter = 0;
// If change status clicked && status === conditional require firm date (maybe, if its a mistake it could be annoying.)
// better to evaluate if the firm date is entered, then check if still marked conditional and click that button if needed
let button_div = content => {
    let div = document.createElement("div");
    div.setAttribute("class", "btn-group btn-group-toggle");
    div.setAttribute("data-toggle", "buttons");

    if (content.constructor === Array){
        content.forEach(item => div.appendChild(item));
    }else{
        div.appendChild(content);
    }
    return div;
};

let create_label = (class_ele, for_ele, id, content) => {
    let label = document.createElement("label");
    label.setAttribute("class", "class_ele");
    label.setAttribute("for", for_ele);
    label.setAttribute("id", id);
    label.appendChild(content);
    return label;
};

let create_radio = (name_ele, id_value) => {
    let input = document.createElement("input");
    input.setAttribute("class", "form-control");
    input.setAttribute("type", "radio");
    input.setAttribute("name", name_ele);
    input.setAttribute("id", id_value);
    input.setAttribute("value", id_value);
    input.required = true;
    return input;
};

function other_condition(){
    /* Allows user to add more conditions if they need
    Do..While used here to add THEN check conditional, if not then it can evaluate true
    then add an extra number that may already exist
    */
    do{
        cond_counter++;
    }while (other_cond_arr.indexOf("conditionsother"+cond_counter) > -1);

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
    /* Allows user to add more referrals if they need
    Do..While used here to add THEN check conditional, if not then it can evaluate true
    then add an extra number that may already exist
    */

    do{
        inside_referral_counter++;
    }while (inside_ref_arr.indexOf("referralin"+inside_referral_counter) > -1);

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
    /* Allows user to add more referrals if they need
    Do..While used here to add THEN check conditional, if not then it can evaluate true
    then add an extra number that may already exist
    */

    do{
        outside_referral_counter++;
    }while (outside_ref_arr.indexOf("referralout"+outside_referral_counter) > -1);

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

function outside_referral(content, button_id){
    // This function adds all the existing referrals to the page on load

    let remove_button = document.createElement("button");
    let brokerage = document.createElement("p");
    let name = document.createElement("p");
    let addr = document.createElement("p");
    let phone = document.createElement("p");
    let email = document.createElement("p");
    let pctordol_heading = document.createElement("p");
    let pctordol_content = document.createElement("p");
    let amt_heading = document.createElement("p");
    let amt_content = document.createElement("p");
    let one_ref_div = document.createElement("div");
    let div_divider = document.createElement("div");
    let all_array = [brokerage, name, addr, phone, email, pctordol_heading, pctordol_content, amt_heading, amt_content, div_divider];
    let heading_array = [brokerage, pctordol_heading, amt_heading];
    remove_button.id = button_id;
    remove_button.className = "btn btn-danger";
    remove_button.setAttribute("title", "Remove");
    remove_button.setAttribute("type", "button");
    div_divider.className = "dropdown-divider";
    pctordol_heading.textContent = "% / $";
    amt_heading.textContent = "Amount";

    for (let item in content){
        if (item.includes("outsiderefaddress")){
            addr.textContent += content[item];
            addr.id = item;
        }else if (item.includes("outsiderefamount")){
            amt_content.textContent += content[item];
            amt_content.id = item;
        }else if (item.includes("outsiderefbrokerage")){
            brokerage.textContent += content[item];
            brokerage.id = item;
        }else if (item.includes("outsiderefemail")){
            email.textContent += content[item];
            email.id = item;
        }else if (item.includes("outsiderefpctordol")){
            pctordol_content.textContent += content[item];
            pctordol_content.id = item;
        }else if (item.includes("outsiderefphone")){
            phone.textContent += content[item];
            phone.id = item;
        }else if (item.includes("subtotal") || item.includes("totalhst") || item.includes("total")){
            // pass
        }else{
            name.textContent += content[item];
            name.id = item;
        }
    }

    all_array.forEach(item => item.style = "margin:-1;padding:-1;");
    heading_array.forEach(item => item.style = "margin:-1;padding:-1;font-weight:400;text-decoration: underline");
    div_divider.style = "";
    all_array.unshift(remove_button);
    all_array.forEach(element => one_ref_div.appendChild(element));
    return one_ref_div;
}

function inside_referral(content, button_id){
    // This function adds all the existing referrals to the page on load

    let remove_button = document.createElement("button");
    let name = document.createElement("p");
    let amount = document.createElement("p");
    let amt_content = document.createElement("p");
    let pctdol_heading = document.createElement("p");
    let pctdol_content = document.createElement("p");
    let one_ref_div = document.createElement("div");
    let div_divider = document.createElement("div");
    let all_array = [name, amount, amt_content, pctdol_heading, pctdol_content, div_divider];
    let heading_array = [name, amount, pctdol_heading];
    remove_button.id = button_id;
    remove_button.className = "btn btn-danger";
    remove_button.setAttribute("title", "Remove");
    remove_button.setAttribute("type", "button");
    div_divider.className = "dropdown-divider";
    amount.textContent = "Amount";
    pctdol_heading.textContent = "% / $";
    all_array.forEach(item => item.style = "margin:-1;padding:-1;");
    heading_array.forEach(item => item.style = "margin:-1;padding:-1;font-weight:400; text-decoration: underline");


    for (let item in content){
        if (item.includes("insiderefamount")){
            amt_content.textContent += content[item];
            amt_content.id = item;
        }else if (item.includes("insiderefpctordol")){
            pctdol_content.textContent += content[item];
            pctdol_content.id = item;
        }else if (item.includes("subtotal") || item.includes("totalhst") || item.includes("total")){
            // pass
        }else{
            name.textContent += content[item];
            name.id = item;
        }
    }

    div_divider.style = "";
    all_array.unshift(remove_button);
    all_array.forEach(element => one_ref_div.appendChild(element));
    return one_ref_div;
}

function condition_other(content, button_id){
    // This function adds all the existing other conditions to the page on load

    let remove_button = document.createElement("button");
    let name = document.createElement("p");
    let date = document.createElement("p");
    let date_content = document.createElement("p");
    let time = document.createElement("p");
    let time_content = document.createElement("p");
    let one_cond_div = document.createElement("div");
    let div_divider = document.createElement("div");
    let data_array = Array();
    let all_array = [name, date, date_content, time, time_content, div_divider];
    let heading_array = [name, date, time];
    remove_button.id = button_id;
    remove_button.className = "btn btn-danger";
    remove_button.setAttribute("title", "Remove");
    remove_button.setAttribute("type", "button");
    div_divider.className = "dropdown-divider";
    date.textContent = "Date";
    time.textContent = "Time";
    all_array.forEach(item => item.style = "margin:-1;padding:-1;");
    heading_array.forEach(item => item.style = "margin:-1;padding:-1;font-weight:400; text-decoration: underline");


    for (let item in content){
        if (item.includes("otherconddatedue")){
            date_content.textContent += content[item];
            date_content.id = item;
        }else if (item.includes("othercondtimedue")){
            time_content.textContent += content[item];
            time_content.id = item;
        }else{
            name.textContent += content[item];
            name.id = item;
        }
    }

    div_divider.style = "";
    all_array.unshift(remove_button);
    all_array.forEach(element => one_cond_div.appendChild(element));
    return one_cond_div;
}

add_other_cond.addEventListener("click", () => add_cond_div.appendChild(other_condition()));
add_inside_ref.addEventListener("click", () => inside_ref_div.appendChild(inside_ref()));
add_outside_ref.addEventListener("click", () => outside_ref_div.appendChild(outside_ref()));

for (let key in tradeJSON.user){
    if (key === "email"){
        tradeJSON.user[key] = tradeJSON.user[key].toLowerCase();
    }
    else if (typeof tradeJSON.user[key] === "string"){
        tradeJSON.user[key] = tradeJSON.user[key].toUpperCase();
    }
}

for (let key in tradeJSON.referralout){
    for (let k2 in tradeJSON.referralout[key]){
        if (typeof tradeJSON.referralout[key][k2] === "string"){
            tradeJSON.referralout[key][k2] = tradeJSON.referralout[key][k2].toUpperCase();
        }
    }
}
for (let key in tradeJSON.referralin){
    for (let k2 in tradeJSON.referralin[key]){
        if (typeof tradeJSON.referralin[key][k2] === "string"){
            tradeJSON.referralin[key][k2] = tradeJSON.referralin[key][k2].toUpperCase();

        }
    }
}

for (let key in tradeJSON.trade){
    for (let id of document.querySelectorAll('*[id]')){
        if (id.id === key){
            if (typeof tradeJSON.trade[key] === "string"){
                document.getElementById(id.id).textContent += tradeJSON.trade[key].toUpperCase();
                break;
            }
            else{
                if (id.id === "buyercomm" || id.id === "listingcomm"){
                    let data;
                    switch (id.id){
                        case "listingcomm":
                            if (tradeJSON.trade.listingcommpctordol === "percent"){
                                data = tradeJSON.trade[key] + "%";
                            }
                            else{
                                data = "$" + tradeJSON.trade[key];
                            }
                            if (tradeJSON.trade.listingcommnetplushst == "plus"){
                                data = data + " + HST";
                            }
                            else{
                                data = data + " NET HST";
                            }
                            document.getElementById(id.id).textContent += data;
                            break;
                        case "buyercomm":
                            if (tradeJSON.trade.listingcommpctordol === "percent"){
                                data = tradeJSON.trade[key] + "%";
                            }
                            else{
                                data = "$" + tradeJSON.trade[key];
                            }
                            if (tradeJSON.trade.listingcommnetplushst == "plus"){
                                data = data + " + HST";
                            }
                            else{
                                data = data + " NET HST";
                            }
                            document.getElementById(id.id).textContent += data;
                            break;
                        }
                    }
                    else if (id.id === "saleprice" || id.id === "buyerrebate" || id.id === "sellerrebate" || id.id === "depositamt"){
                        document.getElementById(id.id).textContent += "$" + tradeJSON.trade[key].toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
                        break;
                    }
                    else{
                        document.getElementById(id.id).textContent += tradeJSON.trade[key];
                        break;
                    }

                }

            }
        }
    }


for (let obj in tradeJSON.referralout){
    document.getElementById("outside-div").appendChild(outside_referral(tradeJSON.referralout[obj], obj));
    outside_ref_arr.push(obj);
}

for (let obj in tradeJSON.referralin){
    document.getElementById("internal-div").appendChild(inside_referral(tradeJSON.referralin[obj], obj));
    inside_ref_arr.push(obj);
}

for (let obj in tradeJSON.conditionsother){
    document.getElementById("conditions-div").appendChild(condition_other(tradeJSON.conditionsother[obj], obj));
    other_cond_arr.push(obj);
}

document.getElementById("modify-form").addEventListener("click", e => {

    if (e.target.parentNode.parentNode.id ===  "internal-div" && e.target.nodeName == "BUTTON"){
        /* INSIDE AGENT REFERRAL heading
        Handles removal of the already EXISTING referrals,
        the ones that were pre-populated on page load.
        'internal-div' refers to the type of referral, not the page element
        */
        if (e.target.id.includes("referralin") && e.target.nodeName == "BUTTON"){
            inside_ref_remove.push(e.target.id);
            document.getElementById("inside-ref-remove").value = inside_ref_remove;
            let remove_ref = e.target.parentNode;

            while (remove_ref.firstChild) {
                remove_ref.removeChild(remove_ref.firstChild);
            }
            if(remove_ref) {
                remove_ref.parentNode.removeChild(remove_ref);
            }
        }
    }else if (e.target.parentNode.parentNode.id ===  "outside-div" && e.target.nodeName == "BUTTON"){
        /* OUTSIDE BROKERAGE REFERRAL heading
        Handles removal of the already EXISTING referrals,
        the ones that were pre-populated on page load.
        'outside-div' refers to the type of referral, not the page element
        */
        if (e.target.id.includes("referralout") && e.target.nodeName == "BUTTON"){
            outside_ref_remove.push(e.target.id);
            document.getElementById("outside-ref-remove").value = outside_ref_remove;
            let remove_ref = e.target.parentNode;

            while (remove_ref.firstChild) {
                remove_ref.removeChild(remove_ref.firstChild);
            }
            if(remove_ref) {
                remove_ref.parentNode.removeChild(remove_ref);
            }
        }
    }else if (e.target.parentNode.parentNode.id ===  "conditions-div" && e.target.nodeName == "BUTTON"){
        /* OTHER CONDITIONS heading
        Handles removal of the already EXISTING conditions,
        the ones that were pre-populated on page load.
        */
        if (e.target.id.includes("conditionsother") && e.target.nodeName == "BUTTON"){
            cond_other_remove.push(e.target.id);
            document.getElementById("cond-other-remove").value = cond_other_remove;
            let remove_cond = e.target.parentNode;
            remove_cond.removeChild(remove_cond.firstChild);

            while (remove_cond.firstChild) {
                remove_cond.removeChild(remove_cond.firstChild);
            }
            if(remove_cond) {
                remove_cond.parentNode.removeChild(remove_cond);
            }
        }
    }else if (e.target.parentNode.parentNode.parentNode.id ===  "insidereferral-div" && e.target.nodeName == "BUTTON"){
        /* INSIDE AGENT REFERRAL 'add' button
        Handles the removal of the individual added referrals (when the user clicks the 'add' button).
        There's a 'remove' button created with each dynamic element
        */
        if(e.target && e.target.nodeName == "BUTTON") {
                let remove_ref = e.target.parentNode.parentNode;
                while (remove_ref.firstChild) {
                    remove_ref.removeChild(remove_ref.firstChild);
                }
                if(remove_ref) {
                    remove_ref.parentNode.removeChild(remove_ref);
                }
        	}
    }else if (e.target.parentNode.parentNode.parentNode.id ===  "outsidereferral-div" && e.target.nodeName == "BUTTON"){
        /* OUTSIDE BROKERAGE REFERRAL 'add' button
        Handles the removal of the individual added referrals (when the user clicks the 'add' button).
        There's a 'remove' button created with each dynamic element
        */
        	if(e.target && e.target.nodeName == "BUTTON") {
                let remove_ref = e.target.parentNode.parentNode;

                while (remove_ref.firstChild) {
                    remove_ref.removeChild(remove_ref.firstChild);
                }
                if(remove_ref) {
                    remove_ref.parentNode.removeChild(remove_ref);
                }
        	}
    }else if (e.target.parentNode.parentNode.parentNode.id ===  "otherconditions-div" && e.target.nodeName == "BUTTON"){
        /* OTHER CONDITIONS 'add' button
        Handles the removal of the individual added referrals (when the user clicks the 'add' button).
        There's a 'remove' button created with each dynamic element
        */
        	if(e.target && e.target.nodeName == "BUTTON") {
                let remove_ref = e.target.parentNode.parentNode;
                while (remove_ref.firstChild) {
                    remove_ref.removeChild(remove_ref.firstChild);
                }
                if(remove_ref) {
                    remove_ref.parentNode.removeChild(remove_ref);
                }
        	}
    }
	else if(e.target && e.target.nodeName == "BUTTON") {
        let target_id;
        let this_target = e.target;
        let parent = e.target.parentNode;

        if (typeof e.target.nextSibling.id === "undefined"){
            /* The first nextSibling is picking up the space I left between
            the button and the <p> tag as the sibling, the second one will
            grab the actual next ele id
            */
            target_id = e.target.nextSibling.nextSibling.id;
        }else{
            target_id = e.target.nextSibling.id;
        }

        switch(target_id){
            case "status":
                parent.innerHTML += '<div class="btn-group btn-group-toggle" style="display:block" data-toggle="buttons"><label class="btn btn-light " for="conditional"><input autocomplete="off"  class="form-control"  type="radio" name="status" id="conditional" value="conditional" required="">Conditional</label><label class="btn btn-light" for="firm"><input autocomplete="off"  class="form-control"  type="radio" name="status" id="firm" value="firm" required="">Firm</label><label class="btn btn-light" for="unsuccessful"><input autocomplete="off"  class="form-control"  type="radio" name="status" id="unsuccessful" value="unsuccessful" required="">Unsuccessful</label></div>';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "saleprice":
                parent.innerHTML += '<input autocomplete="off" style="display:block" class="form-control" type="text" pattern="\\d*" name="saleprice" placeholder="Sale Price (numbers only)" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "firmdate":
                parent.innerHTML +='<input autocomplete="off" style="display:block" class="form-control" type="date" name="firmdate" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "closedate":
                parent.innerHTML +='<input autocomplete="off" style="display:block" class="form-control" type="date" name="closedate" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "depositaccount":
                parent.innerHTML +='<input autocomplete="off" style="display:block" class="form-control" type="text" name="depositaccount" placeholder="Deposit held by" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "depositreceiveddate":
                parent.innerHTML +='<input autocomplete="off" style="display:block" class="form-control" type="date" name="depositreceiveddate" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "depositreceived":
                parent.innerHTML += '<div class="btn-group btn-group-toggle" style="display:block" data-toggle="buttons"><label class="btn btn-light " for="yes" id="depositrcvdlabelyes"><input autocomplete="off"  class="form-control"  type="radio" name="depositreceived" id="yes" value="yes" required="">Yes</label><label class="btn btn-light" for="no" id="depositrcvdlabelno"><input autocomplete="off"  class="form-control"  type="radio" name="depositreceived" id="no" value="no" required="">No</label></div>';
                parent.removeChild(parent.firstChild.nextSibling);
                if (tradeJSON.trade.depositreceived === "no"){
                    // If the deposit has just been received, the following fields are also required for completeness of the trade record.
                    // Other deposit fields not included here were mandatory during the trade input.
                    document.getElementById("depositreceiveddate").parentNode.innerHTML +='<input autocomplete="off" style="display:block" class="form-control" type="date" name="depositreceiveddate" required="">';
                    document.getElementById("depositreceiveddate").parentNode.removeChild(document.getElementById("depositreceiveddate").parentNode.firstChild.nextSibling);
                    document.getElementById("depositreceivedfrom").parentNode.innerHTML += '<input autocomplete="off" style="display:block" class="form-control" type="text" name="depositreceivedfrom" placeholder="Deposit received from" required="">';
                    document.getElementById("depositreceivedfrom").parentNode.removeChild(document.getElementById("depositreceivedfrom").parentNode.firstChild.nextSibling);
                    document.getElementById("chequenum").parentNode.innerHTML += '<input autocomplete="off" style="display:block" class="form-control" pattern="\\d*" type="text" name="chequenum" placeholder="Deposit Cheque #" required="">';
                    document.getElementById("chequenum").parentNode.removeChild(document.getElementById("chequenum").parentNode.firstChild.nextSibling);
                }
                break;
            case "depositreceivedfrom":
                parent.innerHTML += '<input autocomplete="off" style="display:block" class="form-control" type="text" name="depositreceivedfrom" placeholder="Deposit received from" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "depositamt":
                parent.innerHTML += '<input autocomplete="off" style="display:block" class="form-control" pattern="\\d*" type="text" name="depositamt" placeholder="Deposit amount" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "chequenum":
                parent.innerHTML += '<input autocomplete="off" style="display:block" class="form-control" pattern="\\d*" type="text" name="chequenum" placeholder="Deposit Cheque #" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "depositinterest":
                parent.innerHTML += '<div style="display:block" class="btn-group btn-group-toggle" data-toggle="buttons"><label class="btn btn-light" for="interestyes"><input autocomplete="off"  class="form-control"  type="radio" name="depositinterest" id="interestyes" value="yes" required="">Yes</label><label class="btn btn-light" for="interestno"><input autocomplete="off"  class="form-control"  type="radio" name="depositinterest" id="interestno" value="no" required="">No</label></div>';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "listingcomm":
                parent.innerHTML += '<input autocomplete="off" style="display:block" class="form-control"  type="text" pattern="[0-9]+([\.][0-9]{0,2})?" name="listingcomm" placeholder="Amount" required=""> <div class="btn-group btn-group-toggle" style="display:block" data-toggle="buttons"><label class="btn btn-light" for="listingcommpercent"><input autocomplete="off"  class="form-control"  type="radio" name="listingcommpctordol" id="listingcommpercent" value="percent" required="">%</label><label class="btn btn-light" for="listingcommdollar"><input autocomplete="off"  class="form-control"  type="radio" name="listingcommpctordol" id="listingcommdollar" value="dollar" required="">$</label></div><div class="btn-group btn-group-toggle" style="display:block" data-toggle="buttons"><label class="btn btn-light" for="listingcommnetplushst"><input autocomplete="off"  class="form-control"  type="radio" name="listingcommnetplushst" id="listingcommnetplushst" value="plus" required="">+ HST</label><label class="btn btn-light" for="listingcommnetnethst"><input autocomplete="off"  class="form-control"  type="radio" name="listingcommnetplushst" id="listingcommnetnethst" value="net" required="">NET HST</label></div>';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellerrebate":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="sellerrebate" placeholder="Rebate($)" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyercomm":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block"  type="text" pattern="[0-9]+([\.][0-9]{0,2})?" name="buyercomm" placeholder="Amount" required=""><div class="btn-group btn-group-toggle" style="display:block"  data-toggle="buttons"><label class="btn btn-light" for="buyercommpercent"><input autocomplete="off"  class="form-control"  type="radio" name="buyercommpctordol" id="buyercommpercent" value="percent" required="">%</label><label class="btn btn-light" for="buyercommdollar"><input autocomplete="off"  class="form-control"  type="radio" name="buyercommpctordol" id="buyercommdollar" value="dollar" required="">$</label></div><div class="btn-group btn-group-toggle" style="display:block"  data-toggle="buttons"><label class="btn btn-light" for="buyercommnetplushst"><input autocomplete="off"  class="form-control"  type="radio" name="buyercommnetplushst" id="buyercommnetplushst" value="plus" required="">+ HST</label><label class="btn btn-light" for="buyercommnetnethst"><input autocomplete="off"  class="form-control"  type="radio" name="buyercommnetplushst" id="buyercommnetnethst" value="net" required="">NET HST</label></div>';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyerrebate":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="buyerrebate" placeholder="Rebate ($)" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyer":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="buyer" placeholder="Name(s)" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyerphone":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="tel" name="buyerphone" placeholder="Phone #" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyeremail":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="email" name="buyeremail" placeholder="Email" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyeraddress":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="buyeraddress" placeholder="Full Address" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyerlawyer":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="buyerlawyer" placeholder="Name" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyerlawyerphone":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="tel" name="buyerlawyerphone" placeholder="Phone #" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyerlawyeraddress":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="buyerlawyeraddress" placeholder="Full Address" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyerlawyeremail":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="email" name="buyerlawyeremail" placeholder="Email" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyermortgage":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="buyermortgage" placeholder="Name" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyermortgageaddress":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="buyermortgageaddress" placeholder="Full Address" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyermortgagephone":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="tel" name="buyermortgagephone" placeholder="Phone #" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "buyermortgageemail":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="email" name="buyermortgageemail" placeholder="Email" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "seller":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="seller" placeholder="Name(s)" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellerphone":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="tel" name="sellerphone" placeholder="Phone #" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "selleremail":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="email" name="selleremail" placeholder="Email" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "selleraddress":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="selleraddress" placeholder="Full Address" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellerlawyer":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="sellerlawyer" placeholder="Name" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellerlawyerphone":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="tel" name="sellerlawyerphone" placeholder="Phone #" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellerlawyeraddress":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="sellerlawyeraddress" placeholder="Full Address" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellerlawyeremail":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="sellerlawyeremail" placeholder="Email" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellermortgage":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="sellermortgage" placeholder="Name" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellermortgageaddress":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="sellermortgageaddress" placeholder="Full Address" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellermortgagephone":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="tel" name="sellermortgagephone" placeholder="Phone #" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sellermortgageemail":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="email" name="sellermortgageemail" placeholder="Email" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "coopagentbrokerage":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="coopagentbrokerage" placeholder="Brokerage" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "coopagentname":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="coopagentname" placeholder="Name(s)" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "coopagentphone":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="tel" name="coopagentphone" placeholder="Phone #" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "coopagentemail":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="email" name="coopagentemail" placeholder="Email" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "coopagentaddress":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="text" name="coopagentaddress" placeholder="Full Address" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "financingduedate":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="date" style="width: 225px" name="financingduedate" placeholder="Financing Condition Due Date" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "financingduetime":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="time" style="width: 225px" name="financingduetime" placeholder="Financing Condition Due Time" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "inspectionduedate":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="date" style="width: 225px" name="inspectionduedate" placeholder="Inspection Condition Due Date" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "inspectionduetime":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="time" style="width: 225px" name="inspectionduetime" placeholder="Inspection Condition Due Time" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "insuranceduedate":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="date" style="width: 225px" name="insuranceduedate" placeholder="Insurance Condition Due Date" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "insuranceduetime":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="time" style="width: 225px" name="insuranceduetime" placeholder="Insurance Condition Due Time" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sbpduedate":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="date" style="width: 225px" name="sbpduedate" placeholder="Sale of the Buyers Property Due Date" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "sbpduetime":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="time" style="width: 225px" name="sbpduetime" placeholder="Sale of the Buyers Property Due Time" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "statusduedate":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="date" style="width: 225px" name="statusduedate" placeholder="Status Certificate Due Date" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
            case "statusduetime":
                parent.innerHTML += '<input autocomplete="off" class="form-control" style="display:block" type="time" style="width: 225px" name="statusduetime" placeholder="Status Certificate Due Time" required="">';
                parent.removeChild(parent.firstChild.nextSibling);
                break;
        }
	}
});
