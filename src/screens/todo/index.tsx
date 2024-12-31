import React, { useState } from 'react';

import { FormControl } from 'components/ui/form-control';
import { AddIcon } from 'components/ui/icon';
import { Input, InputField, InputIcon } from 'components/ui/input';
import { Pressable } from 'components/ui/pressable';
import { VStack } from 'components/ui/vstack';
import { nanoid } from 'nanoid/non-secure';

import { defaultTodos } from '@/src/constants/todo';

import TodoContainer, { Todo } from './todo-container';

const TodoScreen = () => {
  const [item, setItem] = useState('');
  const [todos, setTodos] = useState<Todo[]>(defaultTodos);

  const addTodo = (task: string) => {
    const lastTodo = todos[todos?.length - 1];
    if (lastTodo?.task !== '' && task !== '') {
      setTodos([
        ...todos,
        {
          id: nanoid(),
          task,
          completed: false,
        },
      ]);
      setItem('');
    }
  };

  const toggleTodo = (id: string) => {
    const updatedTodos = todos?.map(todo => {
      if (todo.id === id) {
        todo.completed = !todo.completed;
      }
      return todo;
    });
    setTodos(updatedTodos);
  };

  const deleteTodo = (id: string) => {
    const updatedTodos = todos.filter(todo => todo.id !== id);
    setTodos(updatedTodos);
  };

  return (
    <VStack className='flex-1 bg-secondary-100 md:items-center md:justify-center md:bg-secondary-0'>
      <VStack className='rounded-md bg-secondary-100 md:h-[500px] md:w-[700px]'>
        <FormControl className='my-4'>
          <Input variant='underlined' size='sm' className='mx-6 my-2'>
            <InputField
              placeholder='What is your next task?'
              value={item}
              onChangeText={value => setItem(value)}
              onSubmitEditing={() => addTodo(item)}
            />
            <Pressable onPress={() => addTodo(item)}>
              <InputIcon as={AddIcon} className='h-3 w-3 cursor-pointer' />
            </Pressable>
          </Input>
        </FormControl>
        {todos?.map((todo: Todo, index: number) => (
          <TodoContainer
            key={index}
            todo={todo}
            toggleTodo={toggleTodo}
            deleteTodo={deleteTodo}
          />
        ))}
      </VStack>
    </VStack>
  );
};

export default TodoScreen;
