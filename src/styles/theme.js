// Modern Dashboard Theme System
// Based on design reference: Snag_1234a713.png

export const themePresets = {
  // Default theme (matches reference image)
  modern: {
    name: 'Modern Purple',
    colors: {
      primary: '#8B5FE5',      // Purple accent from reference
      primaryHover: '#7C51D9',
      secondary: '#6366F1',     // Indigo
      accent: '#EC4899',        // Pink accent
      background: '#F8FAFC',    // Very light gray background
      cardBackground: '#FFFFFF',
      cardBorder: '#E2E8F0',
      text: {
        primary: '#1E293B',     // Dark slate
        secondary: '#64748B',   // Medium gray
        muted: '#94A3B8'        // Light gray
      },
      success: '#10B981',       // Green
      warning: '#F59E0B',       // Amber
      danger: '#EF4444',        // Red
      sidebar: '#FFFFFF',
      sidebarActive: '#F1F5F9',
      sidebarText: '#64748B',
      sidebarTextActive: '#1E293B'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #8B5FE5 0%, #6366F1 100%)',
      card: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      revenue: 'linear-gradient(135deg, #8B5FE5 0%, #EC4899 100%)'
    },
    shadows: {
      sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
      md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
      card: '0 4px 25px rgba(139, 95, 229, 0.08)'
    }
  },

  // Alternative themes for client customization
  ocean: {
    name: 'Ocean Blue',
    colors: {
      primary: '#0EA5E9',
      primaryHover: '#0284C7',
      secondary: '#3B82F6',
      accent: '#06B6D4',
      background: '#F0F9FF',
      cardBackground: '#FFFFFF',
      cardBorder: '#E0F2FE',
      text: {
        primary: '#0F172A',
        secondary: '#475569',
        muted: '#64748B'
      },
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      sidebar: '#FFFFFF',
      sidebarActive: '#F0F9FF',
      sidebarText: '#475569',
      sidebarTextActive: '#0F172A'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)',
      card: 'linear-gradient(135deg, #0ea5e9 0%, #06b6d4 100%)',
      revenue: 'linear-gradient(135deg, #0EA5E9 0%, #06B6D4 100%)'
    }
  },

  forest: {
    name: 'Forest Green',
    colors: {
      primary: '#059669',
      primaryHover: '#047857',
      secondary: '#10B981',
      accent: '#84CC16',
      background: '#F0FDF4',
      cardBackground: '#FFFFFF',
      cardBorder: '#DCFCE7',
      text: {
        primary: '#14532D',
        secondary: '#374151',
        muted: '#6B7280'
      },
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      sidebar: '#FFFFFF',
      sidebarActive: '#F0FDF4',
      sidebarText: '#374151',
      sidebarTextActive: '#14532D'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #059669 0%, #10B981 100%)',
      card: 'linear-gradient(135deg, #059669 0%, #84cc16 100%)',
      revenue: 'linear-gradient(135deg, #059669 0%, #10B981 100%)'
    }
  },

  sunset: {
    name: 'Sunset Orange',
    colors: {
      primary: '#EA580C',
      primaryHover: '#C2410C',
      secondary: '#F97316',
      accent: '#EAB308',
      background: '#FFFBEB',
      cardBackground: '#FFFFFF',
      cardBorder: '#FED7AA',
      text: {
        primary: '#9A3412',
        secondary: '#A16207',
        muted: '#92400E'
      },
      success: '#059669',
      warning: '#D97706',
      danger: '#DC2626',
      sidebar: '#FFFFFF',
      sidebarActive: '#FFFBEB',
      sidebarText: '#A16207',
      sidebarTextActive: '#9A3412'
    },
    gradients: {
      primary: 'linear-gradient(135deg, #EA580C 0%, #F97316 100%)',
      card: 'linear-gradient(135deg, #ea580c 0%, #eab308 100%)',
      revenue: 'linear-gradient(135deg, #EA580C 0%, #EAB308 100%)'
    }
  }
}

// Theme context for React components
export const createThemeCSS = (theme, customColors = {}, backgroundImage = null) => {
  const mergedTheme = {
    ...theme,
    colors: { ...theme.colors, ...customColors }
  }

  return {
    '--color-primary': mergedTheme.colors.primary,
    '--color-primary-hover': mergedTheme.colors.primaryHover,
    '--color-secondary': mergedTheme.colors.secondary,
    '--color-accent': mergedTheme.colors.accent,
    '--color-background': mergedTheme.colors.background,
    '--color-card-bg': mergedTheme.colors.cardBackground,
    '--color-card-border': mergedTheme.colors.cardBorder,
    '--color-text-primary': mergedTheme.colors.text.primary,
    '--color-text-secondary': mergedTheme.colors.text.secondary,
    '--color-text-muted': mergedTheme.colors.text.muted,
    '--color-success': mergedTheme.colors.success,
    '--color-warning': mergedTheme.colors.warning,
    '--color-danger': mergedTheme.colors.danger,
    '--color-sidebar': mergedTheme.colors.sidebar,
    '--color-sidebar-active': mergedTheme.colors.sidebarActive,
    '--color-sidebar-text': mergedTheme.colors.sidebarText,
    '--color-sidebar-text-active': mergedTheme.colors.sidebarTextActive,
    '--gradient-primary': mergedTheme.gradients.primary,
    '--gradient-card': mergedTheme.gradients.card,
    '--gradient-revenue': mergedTheme.gradients.revenue,
    '--shadow-card': theme.shadows?.card || '0 4px 25px rgba(139, 95, 229, 0.08)',
    '--background-image': backgroundImage ? `url(${backgroundImage})` : 'none'
  }
}

export const defaultTheme = themePresets.modern