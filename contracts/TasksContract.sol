// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract TasksContract {

    uint256 public tasksCounter = 0;

    constructor () {
        createTask("mi primer tarea de ejemplo.", "Tengo que hacer algo.");
    }

    event TaskCreated(
        uint id,
        string title,
        string description,
        bool done,
        uint256 createdAt
    );

    event TasksToggleDone(uint id, bool done);

    struct Task {
        uint256 id;
        string title;
        string description;
        bool done;
        uint256 createdAt;
    }

    mapping (uint256 => Task)  public tasks;
    function createTask( string memory _title, string memory _description ) public {
        tasksCounter++;
        tasks[tasksCounter] = Task( tasksCounter, _title, _description, false, block.timestamp  );
        emit TaskCreated(tasksCounter, _title, _description, false, block.timestamp);
    }

    function toggleDone( uint _id ) public {
        Task memory _task = tasks[_id];
        _task.done = !_task.done;
        tasks[_id] = _task;
        emit TasksToggleDone(_id, _task.done);
    }
}