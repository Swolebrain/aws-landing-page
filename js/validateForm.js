document.getElementById("paypal-btn").addEventListener("click",validateForm);
document.getElementById("paypal-btn-installment").addEventListener("click",validateForm);

function validateForm(e){
  e.preventDefault();
  e.stopPropagation();
  console.log(this.id);
  var dataForm = $("#enrollment-form")[0];
  var df = dataForm;
  if (df.name.value.length < 3 ||
      df.name.value.indexOf(" ") == -1){
        return alertAndFail("Please input your full name")
  }
  if (df.address.value.length < 3 ||
      df.address.value.indexOf(" ") == -1){
        return alertAndFail("Please input your address")
  }
  if (df.city.value.length < 3 ){
        return alertAndFail("Please input your city")
  }
  if (df.state.value.length != 2){
        return alertAndFail("Please input your state")
  }
  if (df.zip.value.length != 5){
        return alertAndFail("Please input your 5-digit zip")
  }
  if(!isValidPhone(df.cell.value)){
    return alertAndFail("Please input a nine-digit phone number");
  }
  if (df.email.value.length < 3 ||
      df.email.value.indexOf("@") == -1){
        return alertAndFail("Please input a valid email")
  }
  if ($("#terms-checkbox:checked").length != 1){
    return alertAndFail("You must acknowledge your acceptance of our enrollment agreement by checking the box");
  }
  //here I need the form data serialized into a custom
  //form field in paypal form
  var selector = "paypal-btn-installment";
  var frmObj = "paypal-form-installment";
  if (this.id ==="paypal-btn"){
     selector = "paypal-btn";
     frmObj = "paypal-form"
  }
  document.getElementById(selector).removeEventListener("click",validateForm);
  document.querySelector("#" + selector + " h3").innerHTML = "Please Wait..."
  $.ajax({
    url: "http://fvi-grad.com:4004/enrollment",
    type: 'POST',
    data: $(dataForm).serializeArray().reduce(function(p,c){
      p[c.name]=c.value;
      return p;
    },{}),
    success: function(res){
      console.log("Response:");
      console.log(res);
      if (res.error){
        alert("Form sending failed, please refresh the page and try again.");
      }
      $("#"+frmObj).submit();

    }
  });
}

function alertAndFail(msg){
  alert(msg);
  return false;
}

function isValidPhone(ph){
  if (ph.match(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/) === null)
    return false;
  return true;
}
