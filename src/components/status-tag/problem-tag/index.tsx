import { Text } from 'react-native';

export const StatusProblem = ({ status }: { status: string }) => {
  const getValueStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'Chờ xử lý';
      case 'Resolved':
        return 'Đã xử lý';
      default:
        return 'Unknown';
    }
  };

  const getColorStatus = (status: string) => {
    switch (status) {
      case 'Pending':
        return ['#F59E0B', '#FDE68A'];
      case 'Resolved':
        return ['#10B981', '#6EE7B7'];
      default:
        return ['#000000', '#FFFFFF'];
    }
  };
  return (
    <Text
      style={{
        borderRadius: 6,
        borderWidth: 1,
        borderColor: getColorStatus(status)?.[0] || 'transparent',
        backgroundColor: getColorStatus(status)?.[1] || 'transparent',
        paddingBottom: 1,
        paddingTop: 1,
        paddingLeft: 4,
        paddingRight: 4,
        color: getColorStatus(status)?.[0] || 'black',
        fontSize: 11,
        minWidth: 60,
        textAlign: 'center',
        fontWeight: 'bold',
      }}
    >
      {getValueStatus(status)}
    </Text>
  );
};
