const form1=document.getElementById("formid");
async function handleonclick(event){
    event.preventDefault(); 
    try{
    const email = document.getElementsByName('email')[0].value;
     let res= await axios.post("http://localhost:3000/password/forgotpassword",{email})
     alert(res.data.message);
     window.location.href = "../html/login.html";

    }
    catch(err){
        console.log(err)
    }  
}