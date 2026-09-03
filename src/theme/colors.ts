export const colors = {
  // Backgrounds
  bg:       '#04080F',
  surface1: '#0A1020',
  surface2: '#0F182B',
  surface3: '#1A2540',

  // Purple
  purple:      '#7C3AED',
  purpleDark:  '#4C1D95',
  purpleLight: '#A78BFA',
  purpleXl:    '#C4B5FD',

  // Text
  text1: '#FFFFFF',
  text2: '#7A8BA8',
  text3: '#2D3D58',

  // Semantic
  success: '#10B981',
  error:   '#F43F5E',
  warning: '#F59E0B',

  // Utility
  border:  'rgba(255,255,255,0.07)',
  overlay: 'rgba(0,0,0,0.6)',
} as const;

export const gradients = {
  purple:      [colors.purple, colors.purpleDark] as [string, string],
  purpleLight: [colors.purpleDark, colors.purple, colors.purpleLight] as [string, string, string],
  card:        ['#0A1535', '#0E1D42', '#1C307A'] as [string, string, string],
} as const;