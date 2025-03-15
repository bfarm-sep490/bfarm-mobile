import React from 'react';

import { Redirect } from 'expo-router';

import { NotificationProvider } from '@/context/notifications';

const Index = () => {
  return <Redirect href='home' />;
};

export default Index;
