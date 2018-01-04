function loadApi(){
    $.ajax({
        url: 'https://blockchain.info/pl/ticker'
    })
        .done((response)=>{
            if(response.PLN.buy >= 0) {
                $('.btnValue').text(response.PLN.buy);
                fillTable(response.PLN.buy);
                calculateAllMoney(response.PLN.buy)
            }
        })
        .fail((error)=>{
            console.log(error);
        });
}
loadApi();

// Initialize Firebase

let config = {
    apiKey: "AIzaSyBMeE9L3GMAW0BOiDcB0w0J-NW99rl8dIM",
    authDomain: "kmk-zadanie.firebaseapp.com",
    databaseURL: "https://kmk-zadanie.firebaseio.com",
    projectId: "kmk-zadanie",
    storageBucket: "",
    messagingSenderId: "850398923448"
};

firebase.initializeApp(config);

firebase.auth().onAuthStateChanged((user)=> {
    if (user) {
        userInfo();
        if(user.uid === "IjfRrblGsZhxzrsM11Lr1TzQ5l73"){
            document.getElementById('admin_div').style.display = "flex";
            document.getElementById('login_div').style.display = "none";
            document.getElementById('user_div').style.display = "none";
        }else{
            document.getElementById('user_div').style.display = "block";
            document.getElementById('login_div').style.display = "none";
            document.getElementById('admin_div').style.display = "none";
        }
    }else{
    document.getElementById('login_div').style.display = "flex";
    document.getElementById('admin_div').style.display = "none";
    document.getElementById('user_div').style.display = "none";
    }
});

let login =()=> {
    let userEmail = document.getElementById('user_email').value;
    let userPassword = document.getElementById('user_password').value;
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch((error) => {
        let errorMessage = error.message;
        window.alert("error :" + errorMessage);
    });
};

let loginFromAdmin = (userEmail, userPassword )=> {
    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword);
};

let logout = ()=>{
    firebase.auth().signOut();
};

const numberOfUsers = document.getElementById('numberOfUsers');
const query = firebase.database().ref("Users").orderByKey();

let fillTable = (valueBtn)=> {
    let string = "button";
    let i = 1;
    query.once("value")
    .then((snapshot) =>{
        snapshot.forEach((childSnapshot) =>{
            let idButton = string+i;
            let usersList = document.getElementById('users_list');
            let childData = childSnapshot.val();
            let tr = document.createElement('tr');
            let btcValue = (childData.money/valueBtn).toFixed(8);
            numberOfUsers.innerText++;
            tr.insertAdjacentHTML('beforeend', ('<td>' + `${childData.name}` + '</td>'));
            tr.insertAdjacentHTML('beforeend', ('<td>' + `${childData.surname}` + '</td>'));
            tr.insertAdjacentHTML('beforeend', ('<td>' + `${childData.email}` + '</td>'));
            tr.insertAdjacentHTML('beforeend', ('<td>' + `${childData.money}` + '</td>'));
            if(childData.money === 0){
                tr.insertAdjacentHTML('beforeend', ('<td>' + 0 + '</td>'))   ;
            }else{
                tr.insertAdjacentHTML('beforeend', ('<td>' + `${btcValue}` + '</td>'));
            }

            if(childData.email != "admin@gmail.com"){
                tr.insertAdjacentHTML('beforeend', ('<button class="loginFromAdmin" id='+`${idButton}`+">"+"zaloguj"+'</button>'));
                i++
            }else{
                tr.insertAdjacentHTML('beforeend', ('Loged'));
            }

            usersList.appendChild(tr);
        });
    });
};

let addListener = ()=> {
    let number = 1;
    query.once("value")
        .then((snapshot) =>{
            snapshot.forEach((childSnapshot) =>{
                let childData = childSnapshot.val();
                if(childData.email != "admin@gmail.com") {
                    let button = 'button' + number;
                    let indicationButton = document.getElementById(`${button}`);
                    let childData = childSnapshot.val();
                    indicationButton.addEventListener('click', () => {
                        loginFromAdmin(childData.email, childData.password);
                    });
                    number++
                }
            });
        });
};

let register = () => {
    let userEmail = document.getElementById('user_email_reg').value;
    let userPassword = document.getElementById('user_password_reg').value;
    let userName = document.getElementById('user_name_reg').value;
    let userSurname = document.getElementById('user_surname_reg').value;
    let userID = userEmail.replace("@", "").replace(".", "");

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword);
    function writeUserData(userID, name, surname, userEmail) {
        firebase.database().ref('Users/' + userID).set({
            name: name,
            surname: surname,
            money: 0,
            email: userEmail,
            password: userPassword,
        })
    }
    writeUserData(userID, userName, userSurname, userEmail, userPassword);
};

let refresh = () =>{
    location.reload();
};

let addUserMoney = (character)=>{
    let value = document.getElementById('value').value;
    let email = document.getElementById('userMail').value;
    let userID = email.replace("@", "").replace(".", "");
    query.once("value")
        .then((snapshot) =>{
            let find = false;
            snapshot.forEach((childSnapshot) =>{
                let childData = childSnapshot.val();
                if(childData.email === email){
                    let firebaseRef = firebase.database().ref().child("Users");
                        if(character === "+") {
                            let newValue = Number(value) + Number(childData.money);
                            firebaseRef.child(userID).child("money").set(newValue);
                        }else{
                            let newValue = Number(childData.money) - Number(value);
                            firebaseRef.child(userID).child("money").set(newValue);
                        }
                    find = true;
                }
            });
            if(find === false){
                alert("Nie znaleziono takiego użytkowanika")
            }else{
                location.reload();
            }
        });
};

let calculateAllMoney = (btnValue) =>{
    let allMoney = document.getElementById('allMoney');
    let allBtc = document.getElementById('allBtc');
    let sumOfMoneyZl = 0;
    query.once("value")
        .then((snapshot) =>{
            snapshot.forEach((childSnapshot) =>{
                let childData = childSnapshot.val();
                sumOfMoneyZl += Number(childData.money);
            });
            let bitcoinSum = sumOfMoneyZl / btnValue;
            allMoney.innerText = sumOfMoneyZl;
            allBtc.innerText = (bitcoinSum).toFixed(8);
        });
};

let DelConfirm = () =>{
    let conf = confirm("Czy jesteś pewien, że chcesz usunąć te konto? ");
    if(conf == true){
        deleteUser()
    }
};

//Delete user function
let deleteUser = ()=>{
    let user = firebase.auth().currentUser;
    let email = user.email;
    let userID = email.replace("@", "").replace(".", "");
    query.once("value")
        .then((snapshot) => {
            snapshot.forEach((childSnapshot) => {
                let childData = childSnapshot.val();
                if (childData.email === email) {
                    let firebaseRef = firebase.database().ref().child("Users");
                    let userRef = firebaseRef.child(userID);
                    userRef.remove();

                }
            });
        });
    user.delete()
};

let userInfo = () =>{
    let user = firebase.auth().currentUser;
    let email = user.email;
    let userID = email.replace("@", "").replace(".", "");
    let money = document.getElementsByClassName('user_money');
    let moneyBtc = document.getElementsByClassName('user_btc');
    let btcVal = document.getElementsByClassName('btnValue');
    let firebaseRef = firebase.database().ref().child("Users").child(userID).child('money');
    firebaseRef.on('value', function (data) {
        for(let i=0; i<money.length; i++){
            money[i].innerText = data.val();
            moneyBtc[i].innerText = (data.val()/btcVal[0].innerText).toFixed(8);
        }
    });
    let nameRef = firebase.database().ref().child("Users").child(userID).child('name');
    nameRef.on('value', function (data) {
        let userName = document.getElementById('name');
        userName.innerText = data.val();
    });
    let surnameRef = firebase.database().ref().child("Users").child(userID).child('surname');
    surnameRef.on('value', function (data) {
        let userSurname = document.getElementById('surname');
        userSurname.innerText = data.val();
    });
};

addListener();

