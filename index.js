const endurl = "https://retoolapi.dev/x7AF2I/data"

document.addEventListener("DOMContentLoaded", () => {
    const createButton = document.querySelector("#create");
    const readButton = document.querySelector("#read");
    const userForm = document.querySelector("#userForm");
    const userFormSubmitButton = document.querySelector("#userFormSubmitButton");
    const userList = document.querySelector("#userList");
    const idInput = document.querySelector("#id");
    const usernameInput = document.querySelector("#username");
    const ageInput = document.querySelector("#age");
    const locationInput = document.querySelector("#location");
    const cardInput = document.querySelector("#card");

    createButton.addEventListener('click', () => {
        clearUserForm();
        displayCreateButton();
        displayUserForm();
    })

    readButton.addEventListener('click', () => {
        displayUserList();
    })

    function displayUserForm(){
        userList.classList.add("d-none"); // eltünteti a userlits et
        userForm.classList.remove("d-none");  // megjeleníti a userformot
    }

    function displayUserList(){
        readAllUsers();
        userForm.classList.add("d-none");
        userList.classList.remove("d-none");
    }

    userForm.addEventListener('submit', event => {
        event.preventDefault();
        const id = parseInt(idInput.value);
        const username = usernameInput.value;
        const age = parseInt(ageInput.value);
        const location = locationInput.value;
        const card = parseInt(cardInput.value);
        const user = {
            username: username,
            age: age,
            location: location,
            card: card
        };
        if(id == 0){
            createUser(user);
        }
        else{
            updateUser(id, user);
        }
    });

    async function updateUser(id, user){
        const response = await fetch(endurl + "/" + id, {
            method: "PATCH",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(!response.ok){
            alert("Hiba")
            return;
        }
        displayUserList();
    }

    async function createUser(user){
        const response = await fetch(endurl, {
            method: "POST",
            body: JSON.stringify(user),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if(response.ok){
            displayUserList();
        }
        else{
            alert("Hiba")
        }
    }
    
    function clearUserForm(){
        idInput.value = 0;
        usernameInput.value = "";
        ageInput.value = "";
        locationInput.value = "";
        cardInput.value = "";
    }

    async function deleteUser(id){
        const userconfirm = confirm(`Törli ${id} felhasználót?`)
        if(!userconfirm){
            return;
        }
        const response = await fetch(endurl + "/" + id, {
            method: "DELETE"
        });
        readAllUsers();
        if(!response.ok){
            alert("Sikertelen törlés");
        }
    }

    function readAllUsers(){
        fetch(endurl)
            .then((response) => response.json())
            .then((data) => adatokTablazatba(data))
    }

    function adatokTablazatba(data){
        let tablaHtml = `
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>id</th>
                    <th>username</th>
                    <th>age</th>
                    <th>location</th>
                    <th>card</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>`;

        for (let index = 0; index < data.length; index++) {
            const element = data[index];
            let tableRow = `<tr>
                <td>${element.id}</td>
                <td>${element.username}</td>
                <td>${element.age}</td>
                <td>${element.location}</td>
                <td>${element.card}</td>
                <td>
                    <button type="button" class="btn btn-outline-success" onclick="loadUserUpdateForm(${element.id})">Módosítás</button>
                    
                    <button type="button" class="btn btn-outline-danger" onclick="deleteUser(${element.id})">Törlés</button>
                </td>
            </tr>`;
            tablaHtml += tableRow;
        }
        tablaHtml += '</tbody></table>';
        userList.innerHTML = tablaHtml;
    }

    function displayCreateButton(){
        userFormSubmitButton.textContent = "Felvétel";
        userFormSubmitButton.classList.remove("btn-outline-success");
        userFormSubmitButton.classList.add("btn-outline-primary");
    }

    function displayUpdateButtom(){
        userFormSubmitButton.textContent = "Módosítás";
        userFormSubmitButton.classList.remove("btn-outline-primary");
        userFormSubmitButton.classList.add("btn-outline-success")
    }

    async function loadUserUpdateForm(id){
        const response = await fetch(endurl + "/" + id);
        if(!response.ok){
            readAllUsers();
            alert("Hiba történt");
            return;
        }
        const user = await response.json();
        console.log(user);
        idInput.value = user.id;
        usernameInput.value = user.username;
        ageInput.value = user.age;
        locationInput.value = user.location;
        cardInput.value = user.card;

        displayUpdateButtom();
        displayUserForm();
    }

    window.deleteUser = deleteUser;
    window.loadUserUpdateForm = loadUserUpdateForm;
    readAllUsers();
});