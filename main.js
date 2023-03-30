const form = document.querySelector('#input-form');
const task = document.querySelector('#input-box');
const list = document.querySelector('#tasks');
console.log(window.localStorage.length);
let len = window.localStorage.length;
var ver = false;
if(len != 0 && ver == false){
    let j = 0;
    for(let i=0;i<len;i++){
        j=i;
        let flag = true;
        do{
            flag = true;
            if(window.localStorage.getItem((j).toString()) != null){
                let val = window.localStorage.getItem(j.toString());
                create_Task(val, i.toString());
                window.localStorage.removeItem(j.toString());
                window.localStorage.setItem(i.toString(), val);
                j++;
                flag = false;
            }
            else{
                j++;
            }
        }
        while(flag)
        
    }
    ver = true;
}

window.addEventListener('load', () =>{
    

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const taskvalue = task.value;
        task.value = "";
        let str = window.localStorage.length.toString();
        console.log(":- " + window.localStorage.length.toString())
        create_Task(taskvalue, str);
        window.localStorage.setItem(str, taskvalue);
    });

});


function create_Task(taskvalue, id){
    
    console.log("task created as");
    console.log(id);
    const div1 = document.createElement("div");
        div1.classList.add("task");


        const div2 = document.createElement("div");
        div2.classList.add("content");

        const box = document.createElement("input");
        box.type = "text";
        box.setAttribute("readonly", "readonly");
        box.value = taskvalue;
        box.classList.add("text");
        div2.appendChild(box);

        div1.appendChild(div2);

        const div3 = document.createElement("div");
        div3.classList.add("actions");

        const edit = document.createElement("button");
        edit.classList.add("edit");
        edit.innerText = "Edit";
        div3.appendChild(edit);

        const del = document.createElement("button");
        del.innerText = "Delete";
        del.classList.add("delete");

        div3.appendChild(del);

        div1.appendChild(div3);

        list.appendChild(div1);
        


        edit.addEventListener('click',() => {
            if(edit.innerText.toLowerCase() == "edit"){
                box.removeAttribute("readonly");
                box.focus();
                edit.innerText = "Save";
            }
            else{
                box.setAttribute("readonly", "readonly");
                edit.innerText = "Edit";
                window.localStorage.setItem(id, box.value)
            }
        });
        
        del.addEventListener('click', () => {
            list.removeChild(div1);
            window.localStorage.removeItem(id);
            console.log("removed item is at id :- " + id)
        });
}