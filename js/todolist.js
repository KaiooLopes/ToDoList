;(function (){
    'use strict';

    //armazenar o dom em variaveis
    const itemInput = document.getElementById('item-input');
    const todoAddForm = document.querySelector('#todo-add');
    const ul = document.getElementById('todo-list');
    const lis = ul.getElementsByTagName('li');
    
    let arrTasks = getSavedData();
    
/*     function addEventLi(li){
        li.addEventListener('click', function(){
            console.log(this);
        })
    } */

    function getSavedData(){
        let tasksData =  localStorage.getItem('tasks');
        tasksData = JSON.parse(tasksData);

        return tasksData && tasksData.length ? tasksData : [
            {
                name: 'Create Task',
                createAt: Date.now(),
                completed: false
            }
        ]
    }

    function setNewData(){
        localStorage.setItem('tasks', JSON.stringify(arrTasks));
    }
    setNewData();

    function generateLiTask(obj){
        const li = document.createElement('li');
        const p = document.createElement('p');
        const checkButton = document.createElement('button');
        const editButton = document.createElement('i');
        const deleteButton = document.createElement('i');

        li.className = 'todo-item';

        checkButton.className = 'button-check';
        checkButton.innerHTML = `
            <i class="fas fa-check ${obj.completed ? '' : 'displayNone'}" data-action="checkButton"></i>`;
        checkButton.setAttribute('data-action', 'checkButton')
        li.appendChild(checkButton);

        p.className = 'task-name';
        p.textContent = obj.name;
        li.appendChild(p);

        editButton.className = 'fas fa-edit';
        editButton.setAttribute('data-action', 'editButton')
        li.appendChild(editButton);

        const containerEdit = document.createElement('div');
        containerEdit.className = 'editContainer';

        const inputEdit = document.createElement('input');
        inputEdit.className = 'editInput';
        inputEdit.setAttribute('type','text');
        inputEdit.value = obj.name
        containerEdit.appendChild(inputEdit);

        const containerEditButton = document.createElement('button');
        containerEditButton.className = 'editButton';
        containerEditButton.textContent = 'Edit';
        containerEditButton.setAttribute('data-action', 'containerEditButton')
        containerEdit.appendChild(containerEditButton);

        const containerCancelButton = document.createElement('button'); 
        containerCancelButton.className = 'cancelButton';
        containerCancelButton.textContent = 'Cancel';
        containerCancelButton.setAttribute('data-action', 'containerCancelButton')
        containerEdit.appendChild(containerCancelButton);

        li.appendChild(containerEdit)

        deleteButton.classList.add('fas', 'fa-trash-alt');
        deleteButton.setAttribute('data-action', 'deleteButton')
        li.appendChild(deleteButton);
        //addEventLi(li);
        return li
    }

    function renderTasks(){
        ul.innerHTML = ''
        arrTasks.forEach(taskObj => {
            ul.appendChild(generateLiTask(taskObj))
        });
    }

    function addTask(task){
        arrTasks.push({
            name: task,
            createAt: Date.now(),
            completed: false
        });

        setNewData();
    }
    
    function clickedUl(e){
        const dataAction = e.target.getAttribute('data-action');
        if(!dataAction) return;
        
        let currentLi = e.target;
        while(currentLi.nodeName !== 'LI'){
            currentLi = currentLi.parentElement; 
        }

        const currentLiIndex = [...lis].indexOf(currentLi);
        
        const actions = {
            checkButton: function(){
                arrTasks[currentLiIndex].completed = !arrTasks[currentLiIndex].completed

                if(arrTasks[currentLiIndex].completed){
                    currentLi.querySelector('.fa-check').classList.remove('displayNone')
                } else{
                    currentLi.querySelector('.fa-check').classList.add('displayNone')
                }

                renderTasks();
                setNewData();
            },
            editButton: function(){
                [...ul.querySelectorAll('.editContainer')].forEach(container => {
                    container.removeAttribute('style')
                });

                const editContainer = currentLi.querySelector('.editContainer')
                editContainer.style.display = 'flex';

                currentLi.querySelector('.editInput').focus();
            },
            deleteButton: function(){
                console.log('clicou no delete');
                arrTasks.splice(currentLiIndex, 1);
                renderTasks();
                //currentLi.remove();
                //currentLi.parentElement.removeChild(currentLi)

                setNewData();
            },
            containerEditButton: function(){
                const val = currentLi.querySelector('.editInput').value;
                arrTasks[currentLiIndex].name = val;
                renderTasks();

                setNewData();
            },
            containerCancelButton: function(){
                const editContainer = currentLi.querySelector('.editContainer')
                editContainer.removeAttribute('style');
                
                currentLi.querySelector('.editInput').value = arrTasks[currentLiIndex].name
            }
        };

        if(actions[dataAction]){
            actions[dataAction]();
        }   
    }


    todoAddForm.addEventListener('submit', function(e){
        e.preventDefault();
        addTask(itemInput.value);
        renderTasks();
        itemInput.value = '';
        itemInput.focus();
    });

    ul.addEventListener('click', clickedUl);

    renderTasks();
})();