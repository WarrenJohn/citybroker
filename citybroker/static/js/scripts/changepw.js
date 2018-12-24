const submit = document.getElementById("submit");
const new_pw = document.getElementById("newpassword");
const confirm_new_pw = document.getElementById("confirmpassword");
let errors = document.getElementById("error");

submit.addEventListener("click", () => {
    if (new_pw.value === confirm_new_pw.value){
        submit.type = "submit";
        submit.click();
        submit.disabled = true;
    }else{
        errors.textContent = "New passwords does not match";
    }
});
