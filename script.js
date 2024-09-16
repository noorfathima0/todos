document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('add-task-btn');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterOptions = document.getElementById('filter-tasks');
    const taskCounter = document.getElementById('task-counter');
    const clearTasksBtn = document.getElementById('clear-tasks-btn');

    // Load tasks from local storage
    loadTasksFromLocalStorage();

    // Add task function
    function addTask() {
        const taskText = todoInput.value.trim();
        if (taskText === '') {
            alert('Please enter a task.');
            return;
        }

        const priority = document.querySelector('input[name="priority"]:checked').value;

        const taskObj = {
            text: taskText,
            completed: false,
            priority: priority,
        };

        createTaskElement(taskObj);
        saveTaskToLocalStorage(taskObj);

        // Clear input field
        todoInput.value = '';
        updateTaskCount();
    }

    // Create task element
    function createTaskElement(task) {
        const li = document.createElement('li');
        li.classList.add('task-item', task.priority);

        if (task.completed) {
            li.classList.add('completed');
        }

        li.textContent = task.text;

        // Complete button
        const completeBtn = document.createElement('button');
        completeBtn.textContent = 'Complete';
        completeBtn.classList.add('complete-btn');
        completeBtn.addEventListener('click', () => {
            li.classList.toggle('completed');
            task.completed = !task.completed;
            updateTaskInLocalStorage(task);
            updateTaskCount();
        });

        // Edit button
        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.classList.add('edit-btn');
        editBtn.addEventListener('click', () => editTask(li, task));

        // Delete button
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.classList.add('delete-btn');
        deleteBtn.addEventListener('click', () => {
            todoList.removeChild(li);
            deleteTaskFromLocalStorage(task);
            updateTaskCount();
        });

        li.appendChild(completeBtn);
        li.appendChild(editBtn);
        li.appendChild(deleteBtn);
        todoList.appendChild(li);
    }

    // Edit task function
    function editTask(taskElement, taskObj) {
        const newTaskText = prompt('Edit your task:', taskObj.text);
        if (newTaskText) {
            taskObj.text = newTaskText;
            taskElement.childNodes[0].textContent = newTaskText;
            updateTaskInLocalStorage(taskObj);
        }
    }

    // Save task to local storage
    function saveTaskToLocalStorage(task) {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Load tasks from local storage
    function loadTasksFromLocalStorage() {
        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks.forEach(task => createTaskElement(task));
        updateTaskCount();
    }

    // Update task in local storage
    function updateTaskInLocalStorage(updatedTask) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.map(task => task.text === updatedTask.text ? updatedTask : task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Delete task from local storage
    function deleteTaskFromLocalStorage(taskToDelete) {
        let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        tasks = tasks.filter(task => task.text !== taskToDelete.text);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Clear all tasks
    clearTasksBtn.addEventListener('click', () => {
        todoList.innerHTML = '';
        localStorage.removeItem('tasks');
        updateTaskCount();
    });

    // Filter tasks
    filterOptions.addEventListener('change', (e) => {
        const filterValue = e.target.value;
        const tasks = document.querySelectorAll('.task-item');
        tasks.forEach(task => {
            switch (filterValue) {
                case 'all':
                    task.style.display = 'flex';
                    break;
                case 'completed':
                    task.classList.contains('completed') ? task.style.display = 'flex' : task.style.display = 'none';
                    break;
                case 'pending':
                    !task.classList.contains('completed') ? task.style.display = 'flex' : task.style.display = 'none';
                    break;
                case 'high-priority':
                    task.classList.contains('high') ? task.style.display = 'flex' : task.style.display = 'none';
                    break;
                case 'low-priority':
                    task.classList.contains('low') ? task.style.display = 'flex' : task.style.display = 'none';
                    break;
            }
        });
    });

    // Update task count
    function updateTaskCount() {
        const totalTasks = document.querySelectorAll('.task-item').length;
        const completedTasks = document.querySelectorAll('.task-item.completed').length;
        taskCounter.textContent = `Total: ${totalTasks}, Completed: ${completedTasks}`;
    }

    // Event listener for adding a task
    addTaskBtn.addEventListener('click', addTask);

    // Allow pressing Enter key to add a task
    todoInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});
