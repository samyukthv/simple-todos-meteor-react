import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { TasksCollection } from '/imports/db/TasksCollection';
import { ServiceConfiguration } from 'meteor/service-configuration';
import '../imports/api/TaskMethods';
import '/imports/api/tasksPublications';



const insertTask = (taskText, user) =>
  TasksCollection.insert({
    text: taskText,
    userId: user._id,
    createdAt: new Date(),
  });

const SEED_USERNAME = 'vinod';
const SEED_PASSWORD = 'hello';

Meteor.startup(() => {
  if (!Accounts.findUserByUsername(SEED_USERNAME)) {
    Accounts.createUser({
      username: SEED_USERNAME,
      password: SEED_PASSWORD,
    });
  }

  ServiceConfiguration.configurations.upsert(
    { service: 'github' },
    {
      $set: {
        loginStyle: 'popup',
        clientId: '7ff08d88c1eea89c2082', // insert your clientId here
        secret: '0323c82c9af1b29725981e218090622cee800670', // insert your secret here
      },
    }
  );

  const user = Accounts.findUserByUsername(SEED_USERNAME);

  if (TasksCollection.find().count() === 0) {
    [
      'First Task',
      'Second Task',
      'Third Task',
      'Fourth Task',
      'Fifth Task',
      'Sixth Task',
      'Seventh Task',
    ].forEach(taskText => insertTask(taskText, user));
  }
});