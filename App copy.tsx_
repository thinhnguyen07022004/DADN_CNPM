import { useState } from 'react';
import { Keyboard, StyleSheet, TouchableWithoutFeedback, View } from 'react-native';
import InputTodo from './components/todo/input.todo';
import ListTodo from './components/todo/list.todo';
import FlexBox from './components/todo/flexbox';

export default function App() {

  const [todoList, setTodoList] = useState<ITodo[]>([])

  function randomInteger(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  const addTodo = (text: string) => {
    const todo = { id: randomInteger(1, 1000000), title: text };
    setTodoList([...todoList, todo]);
  }

  const deleteTodo = (id: number) => {
    const newTodo = todoList.filter(todo => todo.id != id);
    setTodoList(newTodo)
  }

  return (
    // <FlexBox />
    <TouchableWithoutFeedback
      onPress={() => Keyboard.dismiss}>
      <View style={styles.container}>
        <InputTodo
          addTodo={addTodo}
        />
        <ListTodo
          todoList={todoList}
          deleteTodo={deleteTodo} />
      </View>
    </TouchableWithoutFeedback>
  );
}

//css-in-jss styled component
const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    // alignItems: 'center',
    // justifyContent: 'center',
    paddingHorizontal: 20,
    fontSize: 60, color: "red",
    paddingTop: 20,
    marginTop: 50,
  },
});
