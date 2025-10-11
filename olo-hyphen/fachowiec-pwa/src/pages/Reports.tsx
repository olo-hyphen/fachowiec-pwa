import React from 'react';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis } from 'recharts';

const chartConfig = {
  zlecenia: {
    label: 'Zlecenia',
    color: 'hsl(var(--primary))',
  },
  klienci: {
    label: 'Klienci',
    color: 'hsl(var(--secondary))',
  },
} satisfies ChartConfig;

const data = [
  { month: 'Sty', zlecenia: 40, klienci: 24 },
  { month: 'Lut', zlecenia: 30, klienci: 13 },
  { month: 'Mar', zlecenia: 20, klienci: 18 },
  { month: 'Kwi', zlecenia: 27, klienci: 9 },
  { month: 'Maj', zlecenia: 18, klienci: 12 },
  { month: 'Cze', zlecenia: 23, klienci: 7 },
];

export default function Reports() {
  return (
    <div className="min-h-screen mesh-bg pb-safe">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold bg-gradient-hero bg-clip-text text-transparent font-poppins mb-2">
          Raporty
        </h1>
        <p className="text-sm md:text-base text-muted-foreground font-inter mb-8">
          Podsumowanie aktywności aplikacji Fachowiec.
        </p>
        <ChartContainer config={chartConfig} className="glass-premium rounded-2xl p-6 shadow-medium">
          <BarChart accessibilityLayer data={data}>
            <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip content={<ChartTooltipContent />} />
            <Bar dataKey="zlecenia" fill="var(--color-zlecenia)" radius={[4, 4, 0, 0]} />
            <Bar dataKey="klienci" fill="var(--color-klienci)" radius={[4, 4, 0, 0]} />
            <ChartLegend content={<ChartLegendContent />} />
          </BarChart>
        </ChartContainer>
      </div>
    </div>
  );
}