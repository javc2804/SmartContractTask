App = {
    contracts: {},
    init: async () => {
        console.log('Loaded'); 
        await App.loadEthereum();
        await App.loadAccount();
        await App.loadContracts();
        App.render()
        await App.renderTask()
    },
    loadEthereum: async () => {
        if (window.ethereum) {
            console.log('ethereum existe');
            App.web3Provider = window.ethereum
            await window.ethereum.request({method:'eth_requestAccounts'})
        } else if (window.web3) {
            web3 = new web3(window.web3.currentProvider)
        }
        else {
            console.log('No ethereum browser is installed. Try it installing metamask.');  
        }
    },

    loadContracts: async () => {
        const res = await fetch("TasksContract.json")
        const tasksContractJSON = await res.json(); 
        App.contracts.tasksContract = TruffleContract(tasksContractJSON)                
        App.contracts.tasksContract.setProvider(App.web3Provider)
        App.tasksContract = await App.contracts.tasksContract.deployed()
    },

    loadAccount: async () => {
       const accounts = await window.ethereum.request({method:'eth_requestAccounts'})
        App.account = accounts[0]
        console.log(App.account);        
    },

    render: () => {
        console.log(App.account);
        document.getElementById('account').innerHTML = App.account
    },

    renderTask: async () => {
        const taskCounter = await App.tasksContract.tasksCounter();
        const taskCounterNumber = taskCounter.toNumber()
        console.log(taskCounterNumber);   
        
        let html = ''

        for (let i = 1; i <= taskCounterNumber; i++) {
            const tasks = await App.tasksContract.tasks(i);
            const taskId = tasks[0] 
            const taskTitle = tasks[1] 
            const taskDescription = tasks[2] 
            const taskDone = tasks[3] 
            const taskCreated = tasks[4] 
            
            let taskElement = `
            <div class="card bg-dark roundend-0 md-2">
               <div class="card-header d-flex justify-content-between align center">
                    <span>${taskTitle}</span>
                    <div class="form-check form-switch">
                        <input class="form-check-input" data-id="${taskId}" type="checkbox" ${taskDone && "checked"} 
                        onchange="App.toggleDone(this)"/> 
                    </div>
               </div>
               <div class="card-body">
                    <span>${taskDescription}</span>
                    <p class="text-muted">
                        Task was created ${new Date(taskCreated * 1000).toLocaleString()}
                    </p>
               </div>
            </div>
            <br>
            `
            html += taskElement;
        }
        document.querySelector('#tasksList').innerHTML = html;
    },
    
    createTask: async ( title, description ) => {
        const result = await App.tasksContract.createTask(title, description,{
            from: App.account
        })
        console.log(App.account);
        console.log(result.logs[0])
        console.log(result)
    },

    toggleDone: async (element) => {
        const taskId = element.dataset.id
        await App.tasksContract.toggleDone(taskId,{
            from: App.account
        })  
        window.location.reload(); 
    }

}


