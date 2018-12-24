const trades_div = document.getElementById("trades");
const agent_id = document.getElementById("agent-id");
const agent_name = document.getElementById("agent-name");

agent_id.textContent = userJSON.user.id;
agent_name.textContent = "Welcome " + userJSON.user.first[0].toUpperCase() + userJSON.user.first.slice(1);
// Add an 'outstanding' section to each card - will say lawyer info missing, deposit info missing, docs missing, etc..

function trade_content(trade_array){
    let para_div = document.createElement("div");
    let trade_num = document.createElement("p");
    let mls_num = document.createElement("p");
    let address = document.createElement("p");
    let div_header = document.createElement("div");
    let content_array = [trade_num, mls_num, address, status];
    let trade_status = trade_array[3];
    let color;

    switch(trade_status){
        case "conditional":
            color = 'rgba(255, 159, 64, 0.2)';
            break;
        case "firm":
            color = 'rgba(54, 162, 235, 0.2)';
            break;
        case "unsuccessful":
            color = 'rgba(255, 99, 132, 0.2)';
            break;
        case "closed":
            color = 'rgba(75, 192, 192, 0.2)';
            break;
        default:
            color = 'rgba(125, 150, 255, 0.2)';
            break;

    }

    div_header.textContent = trade_array[3].toUpperCase();
    div_header.style.fontWeight = "bold";
    div_header.style.backgroundColor = color;

    trade_num.textContent = "Trade #: " + trade_array[2];
    mls_num.textContent = "MLS #: " + trade_array[1];
    address.textContent = "Address: " + trade_array[0].toUpperCase();
    para_div.appendChild(trade_num);
    para_div.appendChild(mls_num);
    para_div.appendChild(address);
    return [div_header, para_div];
}

function options_buttons(trade_array){
    let options_div = document.createElement("div");

    let modify = document.createElement("input");
    let trade_record = document.createElement("input");
    let upload = document.createElement("input");

    let modify_form = document.createElement("form");
    let trade_record_form = document.createElement("form");
    let upload_form = document.createElement("form");

    let modify_btn = document.createElement("input");
    let trade_record_btn = document.createElement("input");
    let upload_btn = document.createElement("input");

    let options_array = [trade_record, modify, upload];
    let btn_array = [trade_record_btn, modify_btn, upload_btn];
    let form_array = [trade_record_form, modify_form, upload_form];

    let options_names = ["trade_record", "modify_trade", "upload_documents"];
    let options_text = ["Trade Record", "Modify Trade", "Upload Documents"];

    options_div.className = "text-center";

    for (let i = 0; i < options_array.length; i++){
        options_array[i].setAttribute("type", "hidden");
        options_array[i].setAttribute("name", options_names[i]);
        options_array[i].setAttribute("value", trade_array[2]);
        options_array[i].className = "btn m-1";
        btn_array[i].setAttribute("type", "submit");
        btn_array[i].className = "btn border";
        btn_array[i].setAttribute("value", options_text[i]);
        btn_array[i].style.margin = "2px";
        form_array[i].setAttribute("method", "POST");
        form_array[i].style.display = "inline";
        form_array[i].appendChild(options_array[i]);
        form_array[i].appendChild(btn_array[i]);
        options_div.appendChild(form_array[i]);
    }

    return options_div;
}

function trade_card(trade_array){
    let div_col = document.createElement("div");
    let div_card = document.createElement("div");
    let div_body = document.createElement("div");
    let div_header = trade_content(trade_array)[0];
    let card_content = trade_content(trade_array)[1];

    div_header.className = "card-header";
    div_col.className = "col-md-6 py-3";
    div_card.className = "card";
    div_body.className = "card-body";

    div_body.appendChild(options_buttons(trade_array));
    div_body.appendChild(card_content);
    div_card.appendChild(div_body);
    div_card.appendChild(div_header);
    div_col.appendChild(div_card);
    return div_col;
}

for (let trade of userJSON.trades){
    trades_div.appendChild(trade_card(trade));
}
