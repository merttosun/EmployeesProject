import {Request} from "./request";
import {UI} from "./ui";

//Elementleri Seçme

const form = document.getElementById("employee-form");
const nameInput = document.getElementById("name");
const departmentInput = document.getElementById("department");
const salaryInput = document.getElementById("salary");
const employeesList = document.getElementById("employees");
const updateEmployeeButton = document.getElementById("update");

const ui = new UI();
const request = new Request("http://localhost:3000/employees");


let updateState = null;


eventListeners();

function eventListeners(){
    document.addEventListener("DOMContentLoaded",getAllEmployess);
    form.addEventListener("submit",addEmployee);
    employeesList.addEventListener("click",UpdateOrDelete);
    updateEmployeeButton.addEventListener("click",updateEmployee);
}
function getAllEmployess(){
    request.get()
    .then(employees => {
        ui.addAllEmployeesToUI(employees);
    })
    .catch(err => console.log(err));
}
function addEmployee(e){
    const employeeName = nameInput.value.trim();
    const employeeDepartment = departmentInput.value.trim();
    const employeeSalary = salaryInput.value.trim();

    if(employeeDepartment === ""|| employeeName === "" || employeeSalary ===""){
        alert("Lütfen Tüm Alanları Doldurun");
    }
    else {
        request.post({name:employeeName,department:employeeDepartment,salary:Number(employeeSalary)})
        .then(employee => {
            ui.addAllEmployeeToUI(employee);
        })
        .catch(err => console.log(err));
    }


    ui.clearInputs();
    e.preventDefault();
}
function UpdateOrDelete(e){
    if(e.target.id === "delete-employee") {
        //Silme İşlemi
        deleteEmployee(e.target);
        
    }else if (e.target.id === "update-employee"){
        //Güncelleme
        updateEmployeeController(e.target.parentElement.parentElement);//tr yi göndermiş oluyoruz
    }

}

function deleteEmployee(targetEmployee){
    const id = targetEmployee.parentElement.previousElementSibling.previousElementSibling.textContent;

    request.delete(id)
    .then(message => {
        ui.deleteEmployeeFromUI(targetEmployee.parentElement.parentElement);//tr yi göndermiş oluyoruz


    }).catch(err=>console.log(err));
}


function updateEmployeeController(targetEmployee) {
    ui.toggleUpdateButton(targetEmployee);

    if(updateState === null){

        updateState = {
            updateId : targetEmployee.children[3].textContent, // id yi tutuyo
            updateParent : targetEmployee
        }

    }else {
        updateState = null;
    }
}

function updateEmployee(){

    if(updateState){ // nullsa calısmıcak değilse calıscak
        //Güncelleme
        const data = {name:nameInput.value.trim(),department:departmentInput.value.trim(),salary:Number(salaryInput.value.trim())}

        request.put(updateState.updateId,data)
        .then(updatedEmployee => { 
            ui.updateEmployeeOnUI(updatedEmployee,updateState.updateParent);

        }).catch(err => console.log(err));

    }

}

// request.get()
// .then(employees => console.log(employees))
// .catch(err => console.log(err));

// request.post({name:"Serhat Say", department:"Pazarlama", salary:3000})
// .then(employee => console.log(employee))
// .catch(err => console.log(err));

// request.put(1,{name:"Serhat Say", department:"Pazarlama", salary:3000})
// .then(employee => console.log(employee))
// .catch(err => console.log(err));

// request.delete(4)
// .then(message => console.log(message))
// .catch(err => console.log(err));


