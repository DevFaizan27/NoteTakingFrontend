import React from 'react'
import { useParams } from 'react-router-dom'
import AllTasks from '../components/Tasks/TasksByStausTabs';

const Tasks = () => {

    const { boardId } = useParams();

    return (
        <div>
            <AllTasks boardId={boardId} />
        </div>
    )
}

export default Tasks