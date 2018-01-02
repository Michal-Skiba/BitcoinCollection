firebase.auth().onAuthStateChanged((user)=> {
    if (user) {
        console.log(user.uid);
        if(user.uid === "IjfRrblGsZhxzrsM11Lr1TzQ5l73")
        {
            console.log("admin");
            document.getElementById('admin_div').style.display = "block";
            document.getElementById('login_div').style.display = "none";
            document.getElementById('user_div').style.display = "none";
        }else{
            document.getElementById('user_div').style.display = "block";
            document.getElementById('login_div').style.display = "none";
            document.getElementById('admin_div').style.display = "none";
        }
    } else {
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

let logout = ()=>{
    firebase.auth().signOut();
};