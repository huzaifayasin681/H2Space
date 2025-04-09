import { colors, typography, spacing, breakpoints, shadows, borderRadius, zIndex } from './tokens';

const theme = {
  colors,
  typography,
  spacing,
  breakpoints,
  shadows,
  borderRadius,
  zIndex,
  
  // Screen sizes for responsive design
  screens: {
    xs: `(min-width: ${breakpoints.xs})`,
    sm: `(min-width: ${breakpoints.sm})`,
    md: `(min-width: ${breakpoints.md})`,
    lg: `(min-width: ${breakpoints.lg})`,
    xl: `(min-width: ${breakpoints.xl})`,
  },
};

export default theme;