import React, { useEffect } from 'react';

import { ChevronDown, AlertCircle, Calendar, Leaf } from 'lucide-react-native';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
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
      title: 'Kế hoạch hiện có',
      data: plansResponse?.data ?? [],
    },
  ];

  const renderNoPlansUI = () => (
    <Box className='items-center p-6'>
      <Box className='mb-4 rounded-full bg-warning-100 p-4'>
        <Icon as={AlertCircle} size='xl' color='#f59e0b' />
      </Box>
      <Text className='mb-2 text-center text-lg font-semibold'>
        Chưa có kế hoạch
      </Text>
      <Text className='mb-4 text-center text-typography-500'>
        Bạn chưa được gán kế hoạch nào. Vui lòng liên hệ với quản trị viên để
        bắt đầu.
      </Text>
      <Button
        className='mt-4 w-full'
        variant='solid'
        onPress={() => {
          handleClose();
        }}
      >
        <ButtonText>Liên hệ quản trị viên</ButtonText>
      </Button>
    </Box>
  );

  const renderPlanItem = (item: Plan) => (
    <ActionsheetItem
      key={item.id}
      onPress={() => handleSelectPlan(item)}
      className={`${currentPlan?.id === item.id ? 'bg-primary-50' : ''}`}
    >
      <VStack space='sm' className='w-full'>
        <HStack className='items-center justify-between'>
          <Text className='font-semibold'>{item.plan_name}</Text>
          {currentPlan?.id === item.id && (
            <Box className='h-2 w-2 rounded-full bg-primary-600' />
          )}
        </HStack>
        <HStack space='md' className='flex-wrap'>
          <HStack space='xs' className='items-center'>
            <Icon as={Leaf} size='sm' className='text-success-600' />
            <Text className='text-sm text-typography-500'>
              {item.plant_name}
            </Text>
          </HStack>
          <HStack space='xs' className='items-center'>
            <Icon as={Calendar} size='sm' className='text-primary-600' />
            <Text className='text-sm text-typography-500'>{item.status}</Text>
          </HStack>
        </HStack>
      </VStack>
    </ActionsheetItem>
  );

  return (
    <VStack space='sm'>
      {!error && !isNoPlansError && (
        <Button
          variant='outline'
          onPress={() => setShowActionsheet(true)}
          className='border-primary-200 bg-white'
        >
          <HStack className='w-full items-center justify-between'>
            <ButtonText className='font-medium'>
              {isLoading
                ? 'Đang tải kế hoạch...'
                : isNoPlansError
                  ? 'Chưa có kế hoạch'
                  : currentPlan
                    ? currentPlan.plan_name
                    : 'Chọn kế hoạch'}
            </ButtonText>
            {isLoading ? (
              <Spinner size='small' />
            ) : (
              <Icon as={ChevronDown} size='sm' className='text-primary-600' />
            )}
          </HStack>
        </Button>
      )}

      {isNoPlansError && (
        <Box className='mt-1 rounded-lg bg-warning-100 p-3'>
          <HStack space='sm' className='items-center'>
            <Icon as={AlertCircle} size='sm' color='#f59e0b' />
            <Text className='text-warning-800'>
              Bạn chưa được gán kế hoạch nào.
            </Text>
          </HStack>
        </Box>
      )}

      <Actionsheet
        isOpen={showActionsheet}
        onClose={handleClose}
        snapPoints={[60]}
      >
        <ActionsheetBackdrop />
        <ActionsheetContent>
          <ActionsheetDragIndicatorWrapper>
            <ActionsheetDragIndicator />
          </ActionsheetDragIndicatorWrapper>

          {isLoading ? (
            <Box className='items-center p-6'>
              <Spinner size='large' />
              <Text className='mt-4 text-lg'>Đang tải kế hoạch...</Text>
            </Box>
          ) : isNoPlansError ? (
            renderNoPlansUI()
          ) : error ? (
            <Box className='p-6'>
              <Text className='text-danger-600 text-center text-lg'>
                Không thể tải kế hoạch
              </Text>
            </Box>
          ) : (
            <ActionsheetSectionList
              sections={sections}
              keyExtractor={item => (item as Plan).id.toString()}
              renderItem={({ item }: { item: any }) => renderPlanItem(item)}
              renderSectionHeader={({ section }: { section: any }) => (
                <ActionsheetSectionHeaderText className='text-lg font-semibold'>
                  {section.title} ({section.data.length})
                </ActionsheetSectionHeaderText>
              )}
              className='px-4'
            />
          )}
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
};
