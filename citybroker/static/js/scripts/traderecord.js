function outside_referral(content){
    // This function adds all the existing referrals to the page on load
    let brokerage = document.createElement("p");
    let name = document.createElement("p");
    let addr = document.createElement("p");
    let phone = document.createElement("p");
    let email = document.createElement("p");
    let sub_heading = document.createElement("p");
    let sub_content = document.createElement("p");
    let hst_heading = document.createElement("p");
    let hst_content = document.createElement("p");
    let total_heading = document.createElement("p");
    let total_content = document.createElement("p");
    let individual_exp_div = document.createElement("div");
    let div_divider = document.createElement("div");
    let all_array = [brokerage, name, addr, phone, email, sub_heading, sub_content, hst_heading, hst_content, total_heading, total_content, div_divider];
    let heading_array = [brokerage, sub_heading, hst_heading, total_heading];
    div_divider.className = "dropdown-divider";
    sub_heading.textContent = "Sub-Total";
    hst_heading.textContent = "HST";
    total_heading.textContent = "Total";
    brokerage.textContent = "Ref: "

    for (let item in content){
        if (item.includes("outsiderefaddress")){
            addr.textContent += content[item];
            addr.id = item;
        }else if (item.includes("outsiderefbrokerage")){
            brokerage.textContent += content[item];
            brokerage.id = item;
        }else if (item.includes("outsiderefemail")){
            email.textContent += content[item];
            email.id = item;
        }else if (item.includes("outsiderefphone")){
            phone.textContent += content[item];
            phone.id = item;
        }else if (item.includes("subtotal")){
            sub_content.textContent += "$"+content[item];
            sub_content.id = item;
        }else if (item.includes("totalhst")){
            hst_content.textContent += "$"+content[item];
            hst_content.id = item;
        }else if (item.includes("total")){
            total_content.textContent += "$"+content[item];
            total_content.id = item;
        }else if (item.includes("outsiderefpctordol") || item.includes("outsiderefamount")){
            // pass
        }else{
            name.textContent += content[item];
            name.id = item;
        }
    }

    all_array.forEach(item => item.style = "margin:-1;padding:-1;");
    heading_array.forEach(item => item.style = "margin:-1;padding:-1;font-weight:400;text-decoration: underline");
    div_divider.style = "";
    all_array.forEach(element => individual_exp_div.appendChild(element));
    return individual_exp_div;
}

function inside_referral(content){
    let name = document.createElement("p");
    let sub_heading = document.createElement("p");
    let sub_content = document.createElement("p");
    let hst_heading = document.createElement("p");
    let hst_content = document.createElement("p");
    let total_heading = document.createElement("p");
    let total_content = document.createElement("p");
    let individual_exp_div = document.createElement("div");
    let div_divider = document.createElement("div");
    let data_array = Array();
    let all_array = [name, sub_heading, sub_content, hst_heading, hst_content, total_heading, total_content, div_divider];
    let heading_array = [name, sub_heading, hst_heading, total_heading];
    div_divider.className = "dropdown-divider";
    sub_heading.textContent = "Sub-Total";
    hst_heading.textContent = "HST";
    total_heading.textContent = "Total";
    all_array.forEach(item => item.style = "margin:-1;padding:-1;");
    heading_array.forEach(item => item.style = "margin:-1;padding:-1;font-weight:400; text-decoration: underline");
    name.textContent = "Ref: ";


    for (let item in content){
        if (item.includes("subtotal")){
            sub_content.textContent += "$"+content[item];
            sub_content.id = item;
        }else if (item.includes("totalhst")){
            hst_content.textContent += "$"+content[item];
            hst_content.id = item;
        }else if (item.includes("total")){
            total_content.textContent += "$"+content[item];
            total_content.id = item;
        }else if (item.includes("insiderefpctordol") || item.includes("insiderefamount")){
            // pass
        }else{
            name.textContent += content[item];
            name.id = item;
        }
    }
    div_divider.style = "";
    all_array.forEach(element => individual_exp_div.appendChild(element));
    return individual_exp_div;
}

function coop_agent(){
    // coop stands for 'Co-Operating'
    let col_title = document.createElement("p");
    let company = document.createElement("p");
    let name = document.createElement("p");
    let addr = document.createElement("p");
    let phone = document.createElement("p");
    let email = document.createElement("p");
    let sub_heading = document.createElement("p");
    let sub_content = document.createElement("p");
    let hst_heading = document.createElement("p");
    let hst_content = document.createElement("p");
    let total_heading = document.createElement("p");
    let total_content = document.createElement("p");
    let coop_div = document.createElement("div");
    let div_divider = document.createElement("div");
    let data_array = Array();
    let id_array = ["coopendtype", "coopagentbrokerage", "coopagentname", "coopagentaddress", "coopagentphone", "coopagentemail", "coopsubtotal", "cooptotal", "coophst"];
    let all_array = [col_title, company, name, addr, phone, email, sub_heading, sub_content, hst_heading, hst_content, total_heading, total_content, div_divider];
    let heading_array = [col_title, sub_heading, hst_heading, total_heading];
    let content_array = [col_title, company, name, addr, phone, email, sub_content, total_content, hst_content];
    div_divider.className = "dropdown-divider";
    sub_heading.textContent = "Sub-Total";
    hst_heading.textContent = "HST";
    total_heading.textContent = "Total";
    all_array.forEach(item => item.style = "margin:-1;padding:-1;");
    heading_array.forEach(item => item.style = "margin:-1;padding:-1;font-weight:400;text-decoration: underline");
    div_divider.style = "";
    content_array.forEach(item => item.id = id_array[content_array.indexOf(item)]);
    all_array.forEach(element => coop_div.appendChild(element));
    return coop_div;
}

function agent_base(subtotal){
    let dealfee;
    let agent_money = Array();
    let col_title = document.createElement("p");
    let name = document.createElement("p");
    let hstnum = document.createElement("p");
    let commplan = document.createElement("p");
    let reconum = document.createElement("p");
    let agent_calc = document.createElement("p");
    let agent_subtotal = document.createElement("p");
    let agent_hst = document.createElement("p");
    let agent_total = document.createElement("p");
    let agent_div = document.createElement("div");
    let div_divider = document.createElement("div");

    if (tradeJSON.user.commplan === "100%") {dealfee = 500;}
    name.textContent = tradeJSON.user.first + " " + tradeJSON.user.last;
    hstnum.textContent = "HST #: " + tradeJSON.user.hst;
    commplan.textContent = "Plan: " + tradeJSON.user.commplan;
    col_title.textContent = "AGENT #: " + tradeJSON.user.id;
    reconum.textContent = "RECO #: " + tradeJSON.user.reco;
    all_array = [col_title, name, hstnum, commplan, reconum, agent_calc, agent_subtotal, agent_hst, agent_total];
    all_array.forEach(item => item.style = "margin:-1;padding:-1;");
    col_title.style = "margin:-1;padding:-1;font-weight:400;text-decoration: underline";
    agent_calc.style = "margin:-1;padding:-1;text-decoration: underline";
    agent_calc.textContent = "$" + subtotal + " - " + "$" + dealfee;
    agent_subtotal.textContent = "Subtotal: $" + (subtotal - dealfee);
    agent_hst.textContent = "HST: $" + (Math.round(((subtotal - dealfee)*0.13)*100)/100);
    agent_total.textContent = "Total: $" + (Math.round(((subtotal - dealfee) * 1.13 )* 100)/100);
    all_array.forEach(element => agent_div.appendChild(element));
    return agent_div;
}

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

document.getElementById("subtotal").textContent = "$" + tradeJSON.subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
document.getElementById("hst").textContent = "$" + tradeJSON.total_hst.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
document.getElementById("total").textContent = "$" + tradeJSON.total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
document.getElementById("agentname").textContent += tradeJSON.user.first + " " + tradeJSON.user.last;

if (tradeJSON.trade.endtype === "buyer"){
    document.getElementById("expenses-div").appendChild(coop_agent());
    document.getElementById("agent-div").appendChild(agent_base(tradeJSON.buyer_subtotal));
    document.getElementById("coopendtype").textContent = "Listing:";
    document.getElementById("coopsubtotal").textContent = "$" + tradeJSON.listing_subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("cooptotal").textContent = "$" + tradeJSON.listingtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("coophst").textContent = "$" + tradeJSON.listinghst.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("endsubtotal").textContent = "$" + tradeJSON.buyer_subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("endhst").textContent = "$" + tradeJSON.buyerhst.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("endtotal").textContent = "$" + tradeJSON.buyertotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}else if (tradeJSON.trade.endtype === "seller") {
    document.getElementById("expenses-div").appendChild(coop_agent());
    document.getElementById("agent-div").appendChild(agent_base(tradeJSON.listing_subtotal));
    document.getElementById("coopendtype").textContent = "Selling:";
    document.getElementById("coopsubtotal").textContent = "$" + tradeJSON.buyer_subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("cooptotal").textContent = "$" + tradeJSON.buyertotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("coophst").textContent = "$" + tradeJSON.buyerhst.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("endsubtotal").textContent = "$" + tradeJSON.listing_subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("endhst").textContent = "$" + tradeJSON.listinghst.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("endtotal").textContent = "$" + tradeJSON.listingtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}else{
    document.getElementById("agent-div").appendChild(agent_base(tradeJSON.buyerseller_subtotal));
    document.getElementById("endsubtotal").textContent = "$" + tradeJSON.buyerseller_subtotal.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("endhst").textContent = "$" + tradeJSON.buyerseller_hst.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    document.getElementById("endtotal").textContent = "$" + tradeJSON.buyerseller_total.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
    document.getElementById("expenses-div").appendChild(outside_referral(tradeJSON.referralout[obj]));
}

for (let obj in tradeJSON.referralin){
    document.getElementById("internal-div").appendChild(inside_referral(tradeJSON.referralin[obj]));
}
