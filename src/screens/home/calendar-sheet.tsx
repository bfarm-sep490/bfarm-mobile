import React from 'react';

import { Calendar } from '@marceloterreiro/flash-calendar';
import { FlashList } from '@shopify/flash-list';
import dayjs from 'dayjs';

import {
  Actionsheet,
  ActionsheetBackdrop,
  ActionsheetContent,
  ActionsheetDragIndicator,
  ActionsheetDragIndicatorWrapper,
} from '@/components/ui/actionsheet';
import { Box } from '@/components/ui/box';
import { useSession } from '@/context/ctx';
import { useCaringTask } from '@/services/api/caring-tasks/useCaringTask';
import { useHarvestingTask } from '@/services/api/harvesting-tasks/useHarvestingTask';
import { usePackagingTask } from '@/services/api/packaging-tasks/usePackagingTask';

interface CalendarSheetProps {
  isOpen: boolean;
  onClose: () => void;
  selectedDate: dayjs.Dayjs;
  onSelectDate: (date: dayjs.Dayjs) => void;
}

export const CalendarSheet = ({
  isOpen,
  onClose,
  selectedDate,
  onSelectDate,
}: CalendarSheetProps) => {
  const { currentPlan, user } = useSession();
  const currentFarmerId = user?.id;
  const currentPlanId = currentPlan?.id;

  // Use API hooks
  const { useFetchByParamsQuery: useFetchCaringTasks } = useCaringTask();
  const { useFetchByParamsQuery: useFetchHarvestingTasks } =
    useHarvestingTask();
  const { useFetchByParamsQuery: useFetchPackagingTasks } = usePackagingTask();

  // Create params for API calls
  const caringParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: 100,
  };

  const harvestingParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: 100,
  };

  const packagingParams = {
    farmer_id: currentFarmerId,
    plan_id: currentPlanId,
    page_number: 1,
    page_size: 100,
  };

  // Fetch tasks using React Query
  const caringQuery = useFetchCaringTasks(caringParams, !!currentPlanId);
  const harvestingQuery = useFetchHarvestingTasks(
    harvestingParams,
    !!currentPlanId,
  );
  const packagingQuery = useFetchPackagingTasks(
    packagingParams,
    !!currentPlanId,
  );

  // Get all unique dates with tasks
  const getDatesWithTasks = () => {
    const dates = new Set<string>();

    // Add caring tasks dates
    if (caringQuery.data?.data) {
      caringQuery.data.data.forEach(task => {
        dates.add(dayjs(task.start_date).format('YYYY-MM-DD'));
      });
    }

    // Add harvesting tasks dates
    if (harvestingQuery.data?.data) {
      harvestingQuery.data.data.forEach(task => {
        dates.add(dayjs(task.start_date).format('YYYY-MM-DD'));
      });
    }

    // Add packaging tasks dates
    if (packagingQuery.data?.data) {
      packagingQuery.data.data.forEach(task => {
        dates.add(dayjs(task.start_date).format('YYYY-MM-DD'));
      });
    }

    return Array.from(dates).map(date => ({
      startId: date,
      endId: date,
    }));
  };

  const datesWithTasks = getDatesWithTasks();

  return (
    <Actionsheet isOpen={isOpen} onClose={onClose}>
      <ActionsheetBackdrop />
      <ActionsheetContent>
        <ActionsheetDragIndicatorWrapper>
          <ActionsheetDragIndicator />
        </ActionsheetDragIndicatorWrapper>
        <Box className='h-[400px] w-full'>
          <Calendar.List
            CalendarScrollComponent={FlashList}
            calendarInitialMonthId={selectedDate.format('YYYY-MM-DD')}
            calendarDayHeight={40}
            calendarRowVerticalSpacing={8}
            calendarRowHorizontalSpacing={8}
            calendarActiveDateRanges={datesWithTasks}
            onCalendarDayPress={dateId => {
              onSelectDate(dayjs(dateId));
              onClose();
            }}
            theme={{
              itemDay: {
                base: ({ isPressed }) => ({
                  container: {
                    backgroundColor: isPressed ? '#E5E7EB' : 'transparent',
                    borderTopRightRadius: 20,
                    borderBottomRightRadius: 20,
                    borderTopLeftRadius: 20,
                    borderBottomLeftRadius: 20,
                  },
                }),
                active: () => ({
                  container: {
                    backgroundColor: 'green',
                  },
                  content: {
                    color: '#FFFFFF',
                  },
                }),
                today: () => ({
                  container: {
                    borderWidth: 1,
                    borderColor: '#3B82F6',
                  },
                }),
              },
            }}
          />
        </Box>
      </ActionsheetContent>
    </Actionsheet>
  );
};
