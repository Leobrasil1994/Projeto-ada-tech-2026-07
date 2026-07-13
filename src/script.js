// Busca tarefas do "banco de dados"
fetch('db.json')
    .then(response => response.json())
    .then(data => {
        document.getElementById('db-status').innerText = data.status;

        const list = document.getElementById('task-list');
        data.itens.forEach(item => {
            let li = document.createElement('li');
            li.innerText = item.task;
            list.appendChild(li);
        });
    })
    .catch(err => {  
        console.error(err);      
        document.getElementById('db-status').innerText =
            'Erro ao carregar tarefas';
    });

// Adiciona nova tarefa na tela
function addTask() {
    const input = document.getElementById('new-task');
    const output = document.getElementById('output');

    let li = document.createElement('li');
    li.textContent = input.value;
    output.appendChild(li);

    console.log("Tarefa adicionada: ' + input.value + '");

    input.value = '';
}
