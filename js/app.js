function loadApi(){
    $.ajax({
        url: 'https://blockchain.info/pl/ticker'
    })
        .done((response)=>{
            if(response.PLN.buy >= 0) {
                $('.btnValue').text(response.PLN.buy);
                fillTable(response.PLN.buy);
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
        if(user.uid === "IjfRrblGsZhxzrsM11Lr1TzQ5l73"){
            document.getElementById('admin_div').style.display = "block";
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

let firebaseRef = firebase.database().ref();

let login =()=> {
    let userEmail = document.getElementById('user_email').value;
    let userPassword = document.getElementById('user_password').value;

    firebase.auth().signInWithEmailAndPassword(userEmail, userPassword).catch((error) => {
        let errorMessage = error.message;
        window.alert("error :" + errorMessage);
    });

};

let logout = ()=>{
    firebase.auth().signOut();
};


let numberOfUsers = document.getElementById('numberOfUsers');

let query = firebase.database().ref("Users").orderByKey();
fillTable = (valueBtn)=> {
    query.once("value")
    .then((snapshot) =>{
        snapshot.forEach((childSnapshot) =>{
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
            usersList.appendChild(tr);
        });
    });
};


let register = () => {
    let userEmail = document.getElementById('user_email_reg').value;
    let userPassword = document.getElementById('user_password_reg').value;
    let userName = document.getElementById('user_name_reg').value;
    let userSurname = document.getElementById('user_surname_reg').value;
    let userID = userEmail.replace("@", "").replace(".", "");
    console.log(userID);

    firebase.auth().createUserWithEmailAndPassword(userEmail, userPassword).catch(function(error) {
        console.log("error")
    });
    function writeUserData(userID, name, surname, userEmail) {
        firebase.database().ref('Users/' + userID).set({
            name: name,
            surname: surname,
            money: 0,
            email: userEmail
        })
    }
    writeUserData(userID, userName, userSurname, userEmail);
    location.reload();
};

/*

});


fillTable = (valueBtn)=> {
    numOfUsersRef.on('value', (data) => {
        let usersList = document.getElementById('users_list');
        let NumberOfUsers = data.val();
        for (let i = 1; i <= NumberOfUsers; i++) {
            let usersRef = firebase.database().ref().child('Users');
            let userNumber = usersRef.child(`${i}`);
            let userEmail = userNumber.child('email');
            let userMoney = userNumber.child('money');
            let userName = userNumber.child('name');
            let userSurname = userNumber.child('surname');
            let tr = document.createElement('tr');
            userName.on('value', (data) => {
                let value = (data.val());
                tr.insertAdjacentHTML('beforeend', ('<td>' + `${value}` + '</td>'))
            });
            userSurname.on('value', (data) => {
                let value = (data.val());
                tr.insertAdjacentHTML('beforeend', ('<td>' + `${value}` + '</td>'))
            });
            userEmail.on('value', (data) => {
                let value = (data.val());
                tr.insertAdjacentHTML('beforeend', ('<td>' + `${value}` + '</td>'));
            });
            userMoney.on('value', (data) => {
                let value = (data.val());
                let btnExchange = value/valueBtn;
                tr.insertAdjacentHTML('beforeend', ('<td>' + `${value}` + '</td>'));
                tr.insertAdjacentHTML('beforeend', ('<td>' + `${btnExchange}` + '</td>'))
            });
            usersList.appendChild(tr);
        }
    });
};
*/