import { createTheme, Text } from '@mantine/core';

const AppTheme = createTheme({
  /** Your theme override here */
  cursorType: 'pointer',
  components: {
    Text: Text.extend({
      defaultProps: {
        inherit: true
      }
    })
  }
});

export default AppTheme;
