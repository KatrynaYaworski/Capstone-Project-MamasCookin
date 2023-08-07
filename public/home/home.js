//button to trigger modal pop up
const logInUserButton = document.querySelector('#log-in-modal');

//modal
const modal = document.getElementById("myModal");

//log in modal data - inputs, error message and close button
const emailInput = document.querySelector("#email-input");
const passwordInput = document.querySelector("#Password-input");
const errorMessage = document.querySelector('#error-message')
const closeBtn = document.getElementsByClassName("close")[0];

//Data to grab and change on log in / log out
const navContainerRight = document.querySelector(".nav-container-right");
const plansNav = document.getElementById("plans");
const welcomeText = document.querySelector("#welcome-text");


const logUserIn = () => {
    let body = {};
    const inputContainer = document.querySelector("#input-form");
    const allInputs = inputContainer.querySelectorAll('input');
     allInputs.forEach((element) => {
       body[element.name] = element.value;
     })
    axios.post("/login", body)
    .then(getAuthenticatedUser)
    .catch(() => {
      const inputForm = document.getElementById("input-form");
      errorMessage.textContent = "Invalid Credentials"
      errorMessage.style.color = "red"
      inputForm.appendChild(errorMessage);
      
    })
  }
  emailInput.onchange = function () {
      errorMessage.textContent =''
  }
  passwordInput.onchange = function () {
      errorMessage.textContent =''
  }

  const logOut = () => {
    axios.delete("/login")
    .then(()=>{  
        plansNav.textContent = "My Meals";
        modal.style.display = 'none';
        navContainerRight.removeChild(navContainerRight.children[1]);
        navContainerRight.removeChild(navContainerRight.children[0]);
    })
    .catch((e) => console.log(`Error with logging out`, e));
   
  }

  //use this ajax request when we want to make changes on the html pages that change when a user is logged in.
  const getAuthenticatedUser = () => {
    axios.get("/users") //COMMENT ME OUT TO MOCK SCENARIOS BELOW
    // new Promise(resolve => resolve({ data: {firstName: "Katryna "}})) //UNCOMMENT TO MOCK HAVING USER
    // new Promise((resolve, reject) => reject("No user found")) //UNCOMMENT TO MOCK NO USER
    .then((res)=>{
      //create log out button and welcome text
      const logOutBtn = document.createElement("button");
      logOutBtn.setAttribute("id", 'log-out');
      logOutBtn.className = "nav-buttons";
      logOutBtn.textContent = "Log Out";
      navContainerRight.appendChild(logOutBtn);
    
        plansNav.textContent = "My Plan";
        modal.style.display = 'none';

        logOutBtn.addEventListener("click", () => logOut());

        const welcomeText = document.createElement('span');
        welcomeText.className ="nav-buttons"
        welcomeText.id = "welcome-text";
        welcomeText.style.color = "black";
        welcomeText.textContent = `Welcome ${res.data.firstName}`;
        navContainerRight.appendChild(welcomeText);
      })
      .catch((e) => {
        console.log(e)
      const openLogInModalBtn = document.createElement("button");
      openLogInModalBtn.setAttribute("id", 'log-in');
      openLogInModalBtn.className = "nav-buttons";
      openLogInModalBtn.textContent = "Log In";
      navContainerRight.appendChild(openLogInModalBtn);
      
      openLogInModalBtn.onclick = function() {
      modal.style.display = "block";
      emailInput.value = '';
      passwordInput.value ='';
      errorMessage.textContent ='';
      }

      })
    }
    
logInUserButton.addEventListener("click", () => logUserIn());

// document.getElementById("log-in").onclick = function() {
//   modal.style.display = "block";
// }

closeBtn.onclick = function() {
  modal.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
  }
}

getAuthenticatedUser()