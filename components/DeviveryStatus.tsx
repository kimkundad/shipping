import { View, Text, StyleSheet } from 'react-native';
import { useTranslation } from "react-i18next";



const DeviveryStatus = ({ order }) => {

  const { i18n, t } = useTranslation();

  const renderStatus = () => {
    switch (order?.order_status) {
      case 1:
        return (
          <View style={styles.textStatus}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{t("home.on_Delivery")}</Text>
          </View>
        );
      case 2:
        return (
          <View style={styles.textStatus2}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{t("home.success")}</Text>
          </View>
        );
      case 3:
        return (
          <View style={styles.textStatus3}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{t("home.accident")}</Text>
          </View>
        );
        case 4:
        return (
          <View style={styles.textStatus3}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{t("home.cancel")}</Text>
          </View>
        );
      default:
        return (
          <View style={styles.textStatusDefault}>
            <Text style={{ color: '#fff', fontSize: 12 }}>{t("home.onprocess")}</Text>
          </View>
        );
    }
  };

  return (
    <View>
      {renderStatus()}
    </View>
  );
};

export default DeviveryStatus;

const styles = {
  textStatus: {
    backgroundColor: '#f47524',
    width: 100,
    borderRadius: 99,
    padding: 5,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  textStatus2: {
    backgroundColor: '#28a745',
    width: 90,
    borderRadius: 99,
    padding: 6,
    paddingHorizontal: 8,
    alignItems: 'center',
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