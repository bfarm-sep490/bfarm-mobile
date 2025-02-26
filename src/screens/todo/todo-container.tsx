import React from 'react';

import {
  Checkbox,
  CheckboxIcon,
  CheckboxIndicator,
  CheckboxLabel,
} from '@/components/ui/checkbox';
import { HStack } from '@/components/ui/hstack';
import { CheckIcon, CloseIcon, Icon } from '@/components/ui/icon';
import { Pressable } from '@/components/ui/pressable';

export interface Todo {
  id: string;
  task: string;
  completed: boolean;
}

const TodoContainer = ({
  todo,
  toggleTodo,
  deleteTodo,
  ...props
}: {
  todo: Todo;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
}) => {
  return (
    <HStack
      {...props}
      className='items-center justify-between rounded-md hover:bg-secondary-200'
    >
      <Checkbox
        onChange={_isChecked => toggleTodo(todo.id)}
        size='sm'
        aria-label={todo.task}
        value={todo.task}
        isChecked={todo.completed}
        className='flex-1 py-2 pl-6'
      >
        <CheckboxIndicator>
          <CheckboxIcon as={CheckIcon} />
        </CheckboxIndicator>
        <CheckboxLabel className='text-sm data-[checked=true]:line-through'>
          {todo.task}
        </CheckboxLabel>
      </Checkbox>
      <Pressable className='py-2 pr-6' onPress={() => deleteTodo(todo.id)}>
        {state => {
          return (
            <Icon
              as={CloseIcon}
              size='xs'
              className={state ? 'stroke-red-400' : 'stroke-primary-50'}
            />
          );
        }}
      </Pressable>
    </HStack>
  );
};

export default TodoContainer;
