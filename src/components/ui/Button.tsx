import { TouchableOpacity, Text, ActivityIndicator, View, TouchableOpacityProps } from 'react-native';
import { colors } from '../../theme/colors';

type Variant = 'primary' | 'secondary' | 'ghost';

interface ButtonProps extends TouchableOpacityProps{
    label : string ;
    variant? : Variant;
    loading?: boolean;
}

export function Button ({label,variant = 'primary',loading,style,disabled,...props} : ButtonProps){
    const bg = {
        primary : colors.purple,
        secondary : colors.surface2,
        ghost: 'transparent',
    }[variant];

    const textColor = {
        primary:   '#fff',
        secondary: colors.text2,
        ghost:     colors.purpleLight,
    }[variant];

    return (
    <TouchableOpacity
    activeOpacity={0.8}
    disabled={disabled || loading}
    style={[{
        backgroundColor: bg,
        borderRadius: 100,
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: variant === 'secondary' ? 1 : 0,
        borderColor: colors.surface3,
        opacity: disabled ? 0.5 : 1,
        shadowColor: variant === 'primary' ? colors.purple : 'transparent',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.35,
        shadowRadius: 20,
        elevation: variant === 'primary' ? 8 : 0,
    }, style]}
    {...props}
    >
    {loading
        ? <ActivityIndicator color={variant === 'primary' ? '#fff' : colors.purpleLight} />
        : <Text style={{ color: textColor, fontSize: 14, fontWeight: '600' }}>{label}</Text>
    }
    </TouchableOpacity>
);
}