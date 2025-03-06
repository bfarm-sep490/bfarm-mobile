import React from 'react';

import { Button, ButtonText } from '@/components/ui/button';
import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  FormControlErrorIcon,
  FormControlLabel,
  FormControlLabelText,
  FormControlHelper,
  FormControlHelperText,
} from '@/components/ui/form-control';
import { AlertCircleIcon } from '@/components/ui/icon';
import { Input, InputField } from '@/components/ui/input';
import { VStack } from '@/components/ui/vstack';

type FormControlTextFieldProps = {
  control: any;
  placeholder: string;
  textHelper: string;
  textError: string;
};

export const FormControlTextField = () => {
  const [isInvalid, setIsInvalid] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('12345');

  return (
    <VStack>
      <FormControl
        isInvalid={isInvalid}
        size='md'
        isDisabled={false}
        isReadOnly={false}
        isRequired={false}
      >
        <FormControlLabel>
          <FormControlLabelText>Password</FormControlLabelText>
        </FormControlLabel>
        <Input className='my-1'>
          <InputField
            type='password'
            placeholder='password'
            value={inputValue}
            onChangeText={text => setInputValue(text)}
          />
        </Input>
        <FormControlHelper>
          <FormControlHelperText>
            Must be atleast 6 characters.
          </FormControlHelperText>
        </FormControlHelper>
        <FormControlError>
          <FormControlErrorIcon as={AlertCircleIcon} />
          <FormControlErrorText>
            Atleast 6 characters are required.
          </FormControlErrorText>
        </FormControlError>
      </FormControl>
    </VStack>
  );
};
