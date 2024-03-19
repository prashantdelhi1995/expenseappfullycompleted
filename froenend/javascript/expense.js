
let token=localStorage.getItem("token")
const form1 = document.getElementById("form");
const tBody = document.getElementById("tbody");
const pageDropValue = document.getElementById("pageDropValue");




function handleLogout(event){
  
  
  localStorage.removeItem("token");
  window.location.href="../html/login.html"

}



form1.addEventListener("submit", function (e) {
    e.preventDefault();
    let amount = e.target.amountinput.value;
    let description = e.target.descriptioninput.value;
    let categories = e.target.categories.value;


    let obj = {
        "Amount": amount,
        "Description": description,
        "categories": categories,
        "date": new Date().toString().slice(4, 15),

    };
    console.log(obj)

    axios.post("http://localhost:3000/add-expense", obj, { headers:{'Authorization':token}})
    .then(res => {
      
        // Clear form fields after successful submission
        e.target.amountinput.value = '';
        e.target.descriptioninput.value = '';
        e.target.categories.value = '';
        // Reload expense list after adding new expense
        loadExpenseList(window.page);
    })
    .catch(error => {
        console.error('Error submitting form:', error);
    });
});

var page = 1;

//Function to load and display the expense list
function loadExpenseList(page) {
  console.log("???????????????>>>>>>>>>>", token);

  axios.get(`http://localhost:3000/get-expense/?page=${page}&limit=${localStorage.getItem("limit")}`, { headers: { 'Authorization': token } })
      .then(res => {
          const { data, totalCount, totalPages } = res.data;
          console.log(res.data);
          tBody.innerHTML = '';

          data.forEach((element) => {
              console.log("***********", element);
              const deleteb = document.createElement("button");
              deleteb.setAttribute("class", "btn btn-danger btn-sm");
              deleteb.setAttribute("type", "button");
              deleteb.appendChild(document.createTextNode("Delete"));
              const tableRow = document.createElement("tr");
              tableRow.setAttribute("id", element.id);
              const date = document.createElement("td");
              date.appendChild(document.createTextNode(element.date));
              console.log(">>>>>>>>>>>>>>", element.id);
              const Amount = document.createElement("td");
              Amount.appendChild(document.createTextNode(element.Amount));
              console.log(element.Amount);
              const kuchBhi = document.createElement("td");
              kuchBhi.appendChild(deleteb);

              const cdescreption = document.createElement("td");
              cdescreption.appendChild(document.createTextNode(element.Description));

              const ccategory = document.createElement("td");
              ccategory.appendChild(document.createTextNode(element.categories));

              tableRow.appendChild(date);
              tableRow.appendChild(Amount);
              tableRow.appendChild(cdescreption);
              tableRow.appendChild(ccategory);
              tableRow.appendChild(kuchBhi);

              tBody.prepend(tableRow);
          });

          const pagination = document.getElementById('pagination');
          pagination.innerHTML = '';
          for (let i = 1; i <= totalPages; i++) {
              const li = document.createElement('li');
              li.classList.add('page-item');
              if (i === page) li.classList.add('active');
              const button = document.createElement('button');
              button.classList.add('btn', 'btn-link', 'page-link');
              button.textContent = i;
              button.addEventListener('click', () => loadExpenseList(i));
              li.appendChild(button);
              pagination.appendChild(li);
          }
      })
      .catch(error => {
          console.error('Error fetching expenses:', error);
      });
}

  
  

  // Initial fetch for page 1 and limit 10
  loadExpenseList(1);
      




       

/*pagination features which is not working now                       */
// const previousButton = document.getElementById('previous');
// const nextButton = document.getElementById('next');

// previousButton.addEventListener('click', function () {
//     const currentPage = parseInt(page);
//     console.log("current page=",currentPage)
//     if (currentPage > 1) {
//         loadExpenseList(currentPage - 1);
//     }
//     else{
//       loadExpenseList(currentPage);
//     }
// });

// nextButton.addEventListener('click', function () {
//     const currentPage = parseInt(page);
    
//     loadExpenseList(page+ 1);
    
// });

// Load initial expense list







tBody.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("btn-danger")) {
    tbody.removeChild(e.target.parentElement.parentElement);

    axios
      .delete(
        `http://localhost:3000/delete-expense/${e.target.parentElement.parentElement.id}`,{ headers:{'Authorization':token}}
      )
      .then((res) => {})
      .catch((err) => {
        console.log(err);
      });
  }
});






//leaderboard code

async function handleLeadorboard(event){
  const res=await axios.get("http://localhost:3000/leaderboardrd")
  const ul=document.getElementById("leaderboard");
  ul.innerHTML="";
  console.log(res.data)
  res.data.forEach((expenseDetails)=>{
    const name=  expenseDetails.name;
  const totalExpense= expenseDetails.totalspend
  const li=document.createElement("li");
  li.innerHTML=` ${name} ${totalExpense}`
  li.style.listStyle = "none"; 
 
  ul.appendChild(li)

  })
 
  
}



// payment gateway related code

async function handleOnClick(event){
    console.log("click")
    //const token = localStorage.getItem("token");
  const res = await axios.get(
    "http://localhost:3000/purchase/premiumMembership",
    { headers: { Authorization: token } }
  );
  console.log(res);
  var options = {
    key: res.data.key_id,
    order_id: res.data.order.id, // For one time payment
    // This handler function will handle the success payment
    handler: async function (response) {
      const res = await axios.post(
        "http://localhost:3000/purchase/updateTransactionStatus",
        {
          order_id: options.order_id,
          payment_id: response.razorpay_payment_id,
        },
        { headers: { Authorization: token } }
      );

      console.log(res);
      alert(
        `Welcome to our Premium Membership,
         You have now access to Premium exclusive
          Reports and LeaderBoard`
      );
     
      localStorage.setItem("token", res.data.token);
      premiumUser()
      location.reload();
},
  };
  const rzp1 = new Razorpay(options);
  rzp1.open();
  event.preventDefault();


}











/*token extracted function                        */
function premiumUser(){
  function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
  
    return JSON.parse(jsonPayload);
  }
 
  
/* Added some primimum features                               */

   const isPremiumUser=parseJwt(token).isPremiumUser
   if (isPremiumUser){
    const buyPremium=document.getElementById("buyPremium");
    buyPremium.style.visibility = "hidden";
    document.getElementById("message").innerHTML="You are a premium user"
  }
   else{
    const leaderboard=document.getElementById("leadorboardDetails");
    leaderboard.style.visibility="hidden";
   }


}

/*added DOM content loaded                          */

window.addEventListener("DOMContentLoaded",()=>{
  if(!token){
    window.Location.href="../html/login.html"
  }
    premiumUser()
    loadExpenseList(page);
})

/*added Download functionality                      */

async function download(){
  try{
      const response= await axios.get('http://localhost:3000/user/download', { headers: {"Authorization" : token} })
  
      if(response.status === 201){
          //the bcakend is essentially sending a download link
          //  which if we open in browser, the file would download
          var a = document.createElement("a");
          a.href = response.data.url;
          a.download = 'myexpense.csv';
          a.click();
      } else {
          throw new Error(response.data.message)
      }

  }
  catch(err) {
    console.log(err)
  };
}
/*added drop down list                     */

pageDropValue.addEventListener("change", (e) => {
  e.preventDefault();
   limit = parseInt(pageDropValue.value);
  localStorage.setItem("limit", parseInt(pageDropValue.value));
  window.location.reload();
});












  


