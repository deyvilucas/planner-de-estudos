let tasks = []
let currentFilter = 'all'
const taskTitle = document.getElementById('task-title')
const taskCategory = document.getElementById('task-category')
const taskPriority = document.getElementById('task-priority')
const taskDate = document.getElementById('task-date')
const addButton = document.getElementById('add-btn')
const tasksList = document.getElementById('tasks-list')
const allButton = document.getElementById('all-btn')
const pendingButton = document.getElementById('pending-btn')
const completedButton = document.getElementById('completed-btn')
const pendingCount = document.getElementById('pending-count')
const completedCount = document.getElementById('completed-count')

function saveTasks() {
    localStorage.setItem(
        'tasks',
        JSON.stringify(tasks)
    )
}

function loadTasks() {
    const savedTask = localStorage.getItem('tasks')

    if(savedTask) {
        tasks = JSON.parse(savedTask)
    }


}

function renderTasks(tasksToRender) {
    tasksList.innerHTML = ''

    tasksToRender.forEach(function(task) {
        const listItem = document.createElement('li')

        listItem.id = task.title.toLowerCase()
        
        listItem.innerText = task.title +
        ' | Categoria: ' + task.category +
        ' | Prioridade: ' + task.priority +
        ' | Prazo: ' + task.date
 
        listItem.dataset.status = task.status
        if (task.status === 'completed') {
            listItem.classList.add('completed')
        }

        const completeButton = document.createElement('button')
        completeButton.innerText = 'Concluir'
        const removeButton = document.createElement('button')
        removeButton.innerText = 'Excluir'
        completeButton.classList.add('btn', 'btn-complete')
        removeButton.classList.add('btn', 'btn-remove')
        const buttonContainer = document.createElement('div')
        buttonContainer.classList.add('task-actions')
        buttonContainer.appendChild(completeButton)
        buttonContainer.appendChild(removeButton)

        completeButton.addEventListener('click', function() {
            if(task.status === 'pending') {
                task.status = 'completed'
            } else {
                task.status = 'pending'
            }

            saveTasks()
            refreshApp()

})

         removeButton.addEventListener('click', function() {
            const confirmeDelete = confirm("Deseja Remover essa tarefa?" + 
                '\n' + listItem.innerText)
            
            if(confirmeDelete) {
                tasks = tasks.filter(function(t){
                    return t !== task
                })

                saveTasks()
                refreshApp()
            }
        })

        tasksList.appendChild(listItem)
        listItem.appendChild(buttonContainer)

        
        

    })
}

function updateCounters() {
    const pendingTasks = tasks.filter(function(task){
        return task.status === 'pending'
    })

    pendingCount.innerText = 'Pendentes: ' + pendingTasks.length

    const completedTasks = tasks.filter(function(task) {
        return task.status === 'completed'
    })

    completedCount.innerText = 'Concluídas: ' + completedTasks.length
}

function refreshApp(){
    switch(currentFilter) {
        case 'all':
            renderTasks(tasks)
            break;
        case 'pending' :
            const pendingTasks = tasks.filter(function(task) {
                return task.status === 'pending'
            })
            renderTasks(pendingTasks)
            break;
        case 'completed':
            const completedTasks = tasks.filter(function(task) {
                return task.status === 'completed'
            })
            renderTasks(completedTasks)
            break
    }

    updateCounters()
}
loadTasks()
refreshApp()



addButton.addEventListener('click', function() {
    const title = taskTitle.value.trim()
    const existingTask = tasks.find(function(task) {
        return task.title.toLowerCase() === title.toLowerCase()
    })
    const category = taskCategory.value
    const priority = taskPriority.value
    const date = taskDate.value
    // console.log(title)
    // console.log(existingTask)
    // console.log(category)
    // console.log(priority)
    // console.log(date)
    if (!title) {
        alert('Título Inválido, insira outro')
        return
    }

    if (existingTask) {
        alert('Tarefa já adicionada, insira outra')
        return
    }

    if (!category) {
        alert('Escolha uma categoria!')
        return
    }

    if (!priority) {
        alert('Escolha a prioridade')
        return
    }

    if (!date) {
        alert('Escolha um prazo')
        return
    }

    // Usando Objetos como Lookup Table para traduzir values dos selects category e priority

    const categories = {
        programming: 'Programação',
        college: 'Faculdade',
        work: 'Trabalho',
        personal: 'Pessoal',
        health: 'Saúde',
        finances: 'Finanças'
    }

    const categoryText = categories[category]

    const priorities = {
        high: 'Alta',
        medium: 'Média',
        low: 'Baixa'
    }

    const priorityText = priorities[priority]

    const confirmation = confirm(
        'Deseja adicionar essa tarefa?' +
        '\n ' + title + ' | Categoria: ' + categoryText + ' | Prioridade: ' + priorityText + ' | Prazo: ' + date

    )

    if (confirmation) {
        
        tasks.push({
            title,
            category: categoryText,
            priority: priorityText,
            date,
            status: 'pending'

        })

        saveTasks()
        refreshApp()

        taskTitle.value = ''
        taskCategory.value = ''
        taskPriority.value = ''
        taskDate.value = ''


}
})


allButton.addEventListener('click', function() {
    currentFilter = 'all'
    refreshApp()
})

pendingButton.addEventListener('click', function() {
    currentFilter = 'pending'
    refreshApp()
})

completedButton.addEventListener('click', function() {
    currentFilter = 'completed'
    refreshApp()

})

