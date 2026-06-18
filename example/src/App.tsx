import { View, StyleSheet } from 'react-native';
import { SilkTextView } from 'react-native-silk-text';

export default function App() {
  return (
    <View style={styles.container}>
      <SilkTextView color="#32a852" style={styles.box} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
});
