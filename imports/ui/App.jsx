
import { Meteor } from 'meteor/meteor';
import React,{useState,Fragment} from 'react';
import { useTracker } from 'meteor/react-meteor-data';
import { Task } from './Task';
import { TasksCollection } from '/imports/db/TasksCollection';
import { TaskForm } from './TaskForm';
import { LoginForm } from './LoginForm';



  // complete the task
  const toggleChecked = ({ _id, isChecked }) =>   Meteor.call('tasks.setIsChecked', _id, !isChecked);


  // Delete tasks 
  const deleteTask = ({ _id }) => Meteor.call('tasks.remove', _id);

export const App = () => {



  const user = useTracker(() => Meteor.user());


  // state to handle the filter 
  const [hideCompleted, setHideCompleted] = useState(false);

  // fetch the tasks from the server
  const hideCompletedFilter = { isChecked: { $ne: true } };

    const userFilter = user ? { userId: user._id } : {};

    const pendingOnlyFilter = { ...hideCompletedFilter, ...userFilter };

  
    const { tasks, pendingTasksCount, isLoading } = useTracker(() => {
      const noDataAvailable = { tasks: [], pendingTasksCount: 0 };
      if (!Meteor.user()) {
        return noDataAvailable;
      }
      const handler = Meteor.subscribe('tasks');
  
      if (!handler.ready()) {
        return { ...noDataAvailable, isLoading: true };
      }
  
      const tasks = TasksCollection.find(
        hideCompleted ? pendingOnlyFilter : userFilter,
        {
          sort: { createdAt: -1 },
        }
      ).fetch();
      const pendingTasksCount = TasksCollection.find(pendingOnlyFilter).count();
  
      return { tasks, pendingTasksCount };
    });



  const logout = () => Meteor.logout();


  
  return (
    <div className="app">
    <header>
      <div className="app-bar">
        <div className="app-header">
        <h1>📝️ To Do List</h1>
{`(${pendingTasksCount})`}
        </div>
      </div>
    </header>

    <div className="main">
        {user ? (
          <Fragment>
              <div className="user" onClick={logout}>
              {user.username || user.profile.name} 🚪     </div>
            <TaskForm  />

            <div className="filter">
              <button onClick={() => setHideCompleted(!hideCompleted)}>
                {hideCompleted ? 'Show All' : 'Hide Completed'}
              </button>
            </div>
           
            {isLoading && <div className="loading">loading...</div>}


            <ul className="tasks">
              {tasks.map(task => (
                <Task
                  key={task._id}
                  task={task}
                  onCheckboxClick={toggleChecked}
                  onDeleteClick={deleteTask}
                />
              ))}
            </ul>
          </Fragment>
        ) : (
          <LoginForm />
        )}
      </div>
  </div>
  );
};