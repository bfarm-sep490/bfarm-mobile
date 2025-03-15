import React, { useEffect } from 'react';

import { ChevronDown, AlertCircle } from 'lucide-react-native';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
  ActionsheetItemText,
  ActionsheetSectionHeaderText,
  ActionsheetSectionList,
} from '@/components/ui';
import { Box } from '@/components/ui/box';
import { Button, ButtonText } from '@/components/ui/button';
import { HStack } from '@/components/ui/hstack';
import { Icon } from '@/components/ui/icon';
import { Spinner } from '@/components/ui/spinner';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { useSession } from '@/context/ctx';
import { Plan } from '@/services/api/plans/planSchema';
import { usePlan } from '@/services/api/plans/usePlan';

type PlanSelectorProps = {
  farmerId: number;
};

export const PlanSelector: React.FC<PlanSelectorProps> = ({ farmerId }) => {
  const { currentPlan, setCurrentPlan } = useSession();
  const [showActionsheet, setShowActionsheet] = React.useState(false);

  const { useFetchByFarmerQuery } = usePlan();
  const {
    data: plansResponse,
    isLoading,
    error,
    isError,
  } = useFetchByFarmerQuery(farmerId);

  const isNoPlansError =
    (isError && (error as any)?.response?.status === 404) ||
    (error as any)?.message?.includes('Not found any plans');

  useEffect(() => {
    if (plansResponse?.data && plansResponse.data.length > 0 && !currentPlan) {
      setCurrentPlan(plansResponse.data[0]);
    }

    if (isNoPlansError && currentPlan) {
      setCurrentPlan(null);
    }
  }, [plansResponse, currentPlan, isNoPlansError, setCurrentPlan]);

  const handleClose = () => setShowActionsheet(false);

  const handleSelectPlan = (plan: Plan) => {
    setCurrentPlan(plan);
    handleClose();
  };

  const sections = [
    {
      title: 'Available Plans',
      data: plansResponse?.data ?? [],
    },
  ];

  const renderNoPlansUI = () => (
    <Box className='items-center p-4'>
      <Icon as={AlertCircle} size='xl' color='#f59e0b' />
      <Text className='mt-2 text-center'>
        You don't have any assigned plans yet.
      </Text>
      <Button
        className='mt-4'
        onPress={() => {
          handleClose();
          // Navigate to a page where the farmer can request a plan or see pending plans
          // router.push('/plans/request');
        }}
      >
        <ButtonText>Contact Admin</ButtonText>
      </Button>
    </Box>
  );

  return (
    <VStack space='sm'>
      {!error && !isNoPlansError && (
        <Button variant='outline' onPress={() => setShowActionsheet(true)}>
          <HStack className='w-full items-center justify-between'>
            <ButtonText>
              {isLoading
                ? 'Loading plans...'
                : isNoPlansError
                  ? 'No plans assigned'
                  : currentPlan
                    ? currentPlan.plan_name
                    : 'Select Plan'}
            </ButtonText>
            {isLoading ? (
              <Spinner size='small' />
            ) : (
              <Icon as={ChevronDown} size='sm' />
            )}
          </HStack>
        </Button>
      )}

      {isNoPlansError && (
        <Box className='mt-1 rounded-md bg-warning-100 p-2'>
          <HStack space='sm' className='items-center'>
            <Icon as={AlertCircle} size='sm' color='#f59e0b' />
            <Text className='text-warning-800'>
              No plans have been assigned to you yet.
            </Text>
          </HStack>
        </Box>
      )}

      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[50]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          {isLoading ? (
            <Box className='items-center p-4'>
              <Spinner />
              <Text className='mt-2'>Loading plans...</Text>
            </Box>
          ) : isNoPlansError ? (
            renderNoPlansUI()
          ) : error ? (
            <Box className='p-4'>
              <Text className='text-danger-600'>Failed to load plans</Text>
            </Box>
          ) : (
            <ActionsheetSectionList
              sections={sections}
              keyExtractor={item => (item as Plan).id.toString()}
              renderItem={({ item }: { item: any }) => (
                <ActionsheetItem onPress={() => handleSelectPlan(item)}>
                  <HStack className='w-full items-center justify-between'>
                    <VStack>
                      <ActionsheetItemText>
                        {item.plan_name}
                      </ActionsheetItemText>
                      <Text className='text-xs text-typography-500'>
                        {item.plant_name} • {item.status}
                      </Text>
                    </VStack>
                    {currentPlan?.id === item.id && (
                      <Box className='h-3 w-3 rounded-full bg-primary-600' />
                    )}
                  </HStack>
                </ActionsheetItem>
              )}
              renderSectionHeader={({ section }: { section: any }) => (
                <ActionsheetSectionHeaderText>
                  {section.title} ({section.data.length})
                </ActionsheetSectionHeaderText>
              )}
            />
          )}
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
};
