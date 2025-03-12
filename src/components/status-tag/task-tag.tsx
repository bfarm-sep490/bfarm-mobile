import { Text } from 'react-native';

export const StatusTask = ({ status }: { status: string }) => {
  const statusConfig: Record<
    string,
    { label: string; colors: [string, string] }
  > = {
    Ongoing: { label: 'Đang tiến hành', colors: ['#3B82F6', '#DBEAFE'] },
    Cancelled: { label: 'Đã hủy', colors: ['#EF4444', '#FECACA'] },
    Incompleted: { label: 'Chưa hoàn thành', colors: ['#F59E0B', '#FDE68A'] },
    Completed: { label: 'Đã hoàn thành', colors: ['#10B981', '#6EE7B7'] },
    Pending: { label: 'Đang chờ', colors: ['#8B5CF6', '#EDE9FE'] },
    Draft: { label: 'Bản nháp', colors: ['#6B7280', '#D1D5DB'] },
  };

  const { label, colors } = statusConfig[status] || {
    label: 'Không xác định',
    colors: ['#6B7280', '#D1D5DB'],
  };
  return (
    <Text
      style={{
        borderRadius: 6,
        borderWidth: 1,
        borderColor: colors[0],
        backgroundColor: colors[1],
        paddingVertical: 2,
        paddingHorizontal: 6,
        color: colors[0],
        fontSize: 11,
        minWidth: 80,
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >
      {label}
    </Text>
  );
};
