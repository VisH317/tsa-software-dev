import { ButtonPropsColorOverrides } from '@mui/material/Button';
import {
  createTheme,
  PaletteColorOptions,
} from '@mui/material/styles';

// Allow the `white` & `teal`  property to be in a Palette
declare module '@mui/material/styles' {
  // Declaration Merging: https://www.typescriptlang.org/docs/handbook/declaration-merging.html
  interface CustomPalette {
    white: {
      primary: string;
      hover: string;
      text: string;
    };
    teal: {
      primary: string;
      hover: string;
      text: string;
    };
  }

  interface Palette extends CustomPalette {}

  interface PaletteOptions extends CustomPalette {};
}

// Allow `white` & `teal` to be used in the `color` prop of the MUI Button element
declare module '@mui/material/Button' {
  interface ButtonPropsColorOverrides {
    white: true;
    teal: true;
  }
}

const { palette } = createTheme();
const { augmentColor } = palette;
const createColor = (mainColor: string) => augmentColor({ color: { main: mainColor } });

export const theme = createTheme({
  components: {
    MuiButton: {
      styleOverrides: {
        root: ({ theme, ownerState }) => ({
          ...((ownerState.color === 'white' || ownerState.color === 'teal') && {
            '&': {
              backgroundColor: theme.palette[ownerState.color].primary,
              color: theme.palette[ownerState.color].text,
            },
            '&:hover': {
              backgroundColor: theme.palette[ownerState.color].hover,
            },
          }),
          '& .MuiTouchRipple-root': {
            opacity: 0.3,
          },
        }),
      },
    },
  },
  palette: {
    white: {
      primary: '#FFFFFF',
      hover: '#F3F3F3',
      text: '#000000',
    },
    teal: {
      primary: '#FFFFFF',
      hover: '#22c55e',
      text: '#000000',
    }
  },
});