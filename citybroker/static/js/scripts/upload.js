for (let key in tradeJSON.trade){
    for (let id of document.querySelectorAll('*[id]')){
        if (id.id === key){
            if (typeof tradeJSON.trade[key] === "string"){
                document.getElementById(id.id).textContent += tradeJSON.trade[key].toUpperCase();
                break;
            }
            else{
                if (id.id === "saleprice" || id.id === "depositamt"){
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
