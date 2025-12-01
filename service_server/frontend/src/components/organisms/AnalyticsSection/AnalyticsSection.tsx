import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Card, Text } from '../../atoms';
import { theme } from '../../../styles/theme';

export interface StatData {
  label: string;
  value: string;
}

export interface AnalyticsSectionProps {
  title: string;
  subtitle: string;
  stats: StatData[];
  style?: ViewStyle;
}

interface StatItemProps {
  label: string;
  value: string;
}

const StatItem: React.FC<StatItemProps> = ({ label, value }) => (
  <View style={styles.statItem}>
    <Text style={styles.statValue}>
      {value}
    </Text>
    <Text style={styles.statLabel}>
      {label}
    </Text>
  </View>
);

export const AnalyticsSection: React.FC<AnalyticsSectionProps> = ({
  title,
  subtitle,
  stats,
  style,
}) => {
  return (
    <Card variant="secondary" padding="lg" style={[styles.analyticsCard, style]}>
      <View style={styles.cardHeader}>
        <Text style={styles.cardTitle}>
          {title}
        </Text>
        <Text style={styles.cardSubtitle}>
          {subtitle}
        </Text>
      </View>

      <View style={styles.statsContainer}>
        {stats.map((stat, index) => (
          <StatItem 
            key={index}
            label={stat.label} 
            value={stat.value} 
          />
        ))}
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  analyticsCard: {
    height: 197, // 피그마 정확한 높이
  },
  
  cardHeader: {
    alignItems: 'center',
    marginBottom: theme.spacing.base,
  },
  
  cardTitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.bold, // 700
    fontSize: 23.625, // 피그마 정확한 값
    lineHeight: 28,
    textAlign: 'center',
    color: theme.colors.white,
  },
  
  cardSubtitle: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.medium, // 500
    fontSize: theme.typography.fontSize.md, // 14px
    lineHeight: 16,
    textAlign: 'center',
    color: theme.colors.white80,
    marginTop: theme.spacing.sm,
  },
  
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingTop: 21, // 피그마 정확한 값
    borderTopWidth: 1,
    borderTopColor: theme.colors.white20,
    gap: theme.spacing.sm,
  },
  
  statItem: {
    alignItems: 'center',
    width: 72.33, // 피그마 정확한 값
  },
  
  statValue: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.bold, // 700
    fontSize: theme.typography.fontSize.lg, // 18px
    lineHeight: 21,
    textAlign: 'center',
    color: theme.colors.white,
    marginBottom: 4,
  },
  
  statLabel: {
    fontFamily: theme.typography.fontFamily,
    fontWeight: theme.typography.fontWeight.regular, // 400
    fontSize: theme.typography.fontSize.xs, // 11px
    lineHeight: 13,
    textAlign: 'center',
    color: theme.colors.white,
    opacity: 0.8,
  },
});
