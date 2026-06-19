import { ReactScan } from 'react-scan/native';
import { AppTabs } from '../components/AppTabs';

export default function RootLayout() {
  if (__DEV__) {
    return (
      <ReactScan
        options={{
          enabled: true,
          log: false, // Change to true to print render times to your terminal console
        }}
      >
        <AppTabs />
      </ReactScan>
    );
  }

  return <AppTabs />;
}
