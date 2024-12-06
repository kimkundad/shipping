import { View, Text, StyleSheet } from 'react-native';

const PayStatus = ({ order }) => {
  const renderStatus = () => {
    switch (order?.status) {
      case 1:
        return (
            <Text style={styles.textStatus2}>ชำระเงินสำเร็จ</Text>
        );
      default:
        return (
            <Text style={styles.textStatus}>กำลังตรวจสอบ</Text>
        );
    }
  };

  return (
    <View>
      {renderStatus()}
    </View>
  );
};

export default PayStatus;

const styles = {
  textStatus: {
    color: '#f47524',
    fontSize: 16,
    fontFamily: 'Prompt_500Medium',
  },
  textStatus2: {
    color: '#28a745',
    fontSize: 16,
        fontFamily: 'Prompt_500Medium',
  },
  textStatus3: {
    backgroundColor: '#d9534f',
    width: 90,
    borderRadius: 99,
    padding: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
  textStatusDefault: {
    backgroundColor: '#666',
    width: 90,
    borderRadius: 99,
    padding: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
  },
};