import React from 'react';
import axios from 'axios';
import CreateTodo from './create-todo';
import TodoList from './todo-list';
import { DEV_GATEWAY, PROD_GATEWAY } from '../secrets';

// load foundation
require('style!css!foundation-sites/dist/foundation.min.css');
$(document).foundation();

const devGateway = DEV_GATEWAY || 'not-defined:DEV_GATEWAY';
const prodGateway = PROD_GATEWAY || 'not-defined:PROD_GATEWAY';

// Local
// const BASE_URL = 'http://localhost:3000';
// dev gateway
const BASE_URL = devGateway;
// prod gateway
// const BASE_URL = prodGateway;

const todos = [];

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      todos,
    };
    this.init = this.init.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  init() {
    const self = this;
    axios.get(`${BASE_URL}/todos/getAll`).then((response) => {
      self.setState({ todos: response.data.result.Items });
    }).catch((error) => {
      self.setState({ todos: [{}, {}] });
      console.log(error);
    });
  }

  render() {
    return (
            <div>
                <div className="row large-6 large-offset-5 medium-6 medium-offset-5 small-6 small-offset-5 columns">
                    <h3>My Todo List</h3>
                </div>
                <CreateTodo createTask={this.createTask.bind(this)}/>
                <TodoList todos={this.state.todos} toggleTask={this.toggleTask.bind(this)} saveTask={this.saveTask.bind(this)} deleteTask={this.deleteTask.bind(this)}/>
            </div>
    );
  }

  createTask(task) {
    const self = this;
    self.state.todos.unshift(task);
    self.setState({ todos: self.state.todos });
    axios.post(`${BASE_URL}/todos`, task).then((response) => {})
        .catch((error) => {
          console.log(error);
        });
  }

  toggleTask(task) {
    const foundTodo = _.find(this.state.todos, todo => todo.id === task.id);
    foundTodo.isCompleted = !foundTodo.isCompleted;
    this.setState({ todos: this.state.todos });
    axios.put(`${BASE_URL}/todos/status`, {
      id: task.id,
      isCompleted: foundTodo.isCompleted,
    }).then((response) => {
    }).catch((error) => {
      console.log(error);
    });
  }

  saveTask(oldTask, newTask) {
    const self = this;
    const foundTodo = _.find(self.state.todos, todo => todo.id === oldTask.id);
    foundTodo.task = newTask;
    self.setState({ todos: self.state.todos });
    axios.put(`${BASE_URL}/todos/update`, {
      id: oldTask.id,
      task: newTask,
    }).then((response) => {
    }).catch((error) => {
      console.log(error);
    });
  }

  deleteTask(taskToDelete) {
    const self = this;
    _.remove(self.state.todos, todo => todo.id === taskToDelete.id);
    self.setState({ todos: self.state.todos });
    axios.delete(`${BASE_URL}/todos/delete/${taskToDelete.id}`).then((response) => {
    }).catch((error) => {
      console.log(error);
    });
  }
}
