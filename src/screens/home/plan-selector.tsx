import React, { useEffect } from 'react';

import { Pressable } from 'react-native';

import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';
import {
  ChevronDown,
  AlertCircle,
  Calendar,
  Leaf,
  Clock,
  BarChart3,
  Shovel,
} from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
  ActionsheetItem,
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
  const { t } = useTranslation();
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

  const renderNoPlansUI = () => (
    <Box className='items-center p-6'>
      <Box className='mb-4 rounded-full bg-warning-100 p-4'>
        <Icon as={AlertCircle} size='xl' color='#f59e0b' />
      </Box>
      <Text className='mb-2 text-center text-lg font-semibold'>
        {t('home:planSelector:noPlans:title')}
      </Text>
      <Text className='mb-4 text-center text-typography-500'>
        {t('home:planSelector:noPlans:description')}
      </Text>
      <Button className='mt-4 w-full' variant='solid' onPress={handleClose}>
        <ButtonText>{t('home:planSelector:noPlans:contactAdmin')}</ButtonText>
      </Button>
    </Box>
  );

  const renderPlanItem = ({ item }: { item: Plan }) => {
    const startDate = dayjs(item.start_date);
    const endDate = dayjs(item.end_date);
    const today = dayjs();
    const daysRemaining = endDate.diff(today, 'day');

    return (
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
              <Text className='text-sm text-typography-500'>
                {startDate.format('DD/MM/YYYY')}
              </Text>
            </HStack>
          </HStack>

          <HStack space='md' className='flex-wrap'>
            <HStack space='xs' className='items-center'>
              <Icon as={Clock} size='sm' className='text-warning-600' />
              <Text className='text-sm text-typography-500'>
                {daysRemaining > 0
                  ? `Còn ${daysRemaining} ngày`
                  : daysRemaining === 0
                    ? 'Kết thúc hôm nay'
                    : 'Đã kết thúc'}
              </Text>
            </HStack>
            <HStack space='xs' className='items-center'>
              <Icon as={BarChart3} size='sm' className='text-indigo-600' />
              <Text className='text-sm text-typography-500'>
                {item.estimated_product} kg
              </Text>
            </HStack>
          </HStack>

          <HStack space='xs' className='items-center'>
            <Icon as={Shovel} size='sm' className='text-amber-600' />
            <Text className='text-sm text-typography-500'>
              Đất: {item.yield_name || 'N/A'}
            </Text>
          </HStack>

          <Box
            className={`mt-2 rounded-full px-2 py-1 ${
              item.status === 'Complete' ? 'bg-success-100' : 'bg-warning-100'
            }`}
          >
            <Text
              className={`text-xs ${
                item.status === 'Complete'
                  ? 'text-success-700'
                  : 'text-warning-700'
              }`}
            >
              {item.status}
            </Text>
          </Box>
        </VStack>
      </ActionsheetItem>
    );
  };

  return (
    <VStack space='sm'>
      {!error && !isNoPlansError && (
        <Pressable
          onPress={() => setShowActionsheet(true)}
          className='rounded-lg border border-primary-200 bg-white p-3'
        >
          <HStack className='w-full items-center justify-between'>
            <VStack space='xs' className='flex-1'>
              <Text className='text-sm text-typography-500'>
                {t('home:planSelector:currentPlan')}
              </Text>
              <HStack space='sm' className='items-center'>
                {isLoading ? (
                  <Spinner size='small' />
                ) : (
                  <>
                    <Text className='font-medium text-typography-900'>
                      {currentPlan
                        ? currentPlan.plan_name
                        : t('home:planSelector:selectPlan')}
                    </Text>
                    {currentPlan && (
                      <Box className='rounded-full bg-primary-100 px-2 py-0.5'>
                        <Text className='text-xs text-primary-700'>
                          {currentPlan.status}
                        </Text>
                      </Box>
                    )}
                  </>
                )}
              </HStack>
            </VStack>
            <Icon as={ChevronDown} size='sm' className='text-primary-600' />
          </HStack>
        </Pressable>
      )}

      {isNoPlansError && (
        <Box className='mt-1 rounded-lg bg-warning-100 p-3'>
          <HStack space='sm' className='items-center'>
            <Icon as={AlertCircle} size='sm' color='#f59e0b' />
            <Text className='text-warning-800'>
              {t('home:planSelector:error:noPlans')}
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
              <Text className='mt-4 text-lg'>
                {t('home:planSelector:loading')}
              </Text>
            </Box>
          ) : isNoPlansError ? (
            renderNoPlansUI()
          ) : error ? (
            <Box className='p-6'>
              <Text className='text-danger-600 text-center text-lg'>
                {t('home:planSelector:error:title')}
              </Text>
            </Box>
          ) : (
            <VStack className='mb-20 w-full flex-1'>
              <Text className='px-4 py-2 text-lg font-semibold'>
                {t('home:planSelector:availablePlans', {
                  count: plansResponse?.data?.length ?? 0,
                })}
              </Text>
              <FlashList
                data={plansResponse?.data ?? []}
                renderItem={renderPlanItem}
                estimatedItemSize={100}
                keyExtractor={item => item.id.toString()}
                className='flex-1'
                showsVerticalScrollIndicator={false}
              />
            </VStack>
          )}
        </ActionsheetContent>
      </Actionsheet>
    </VStack>
  );
};
