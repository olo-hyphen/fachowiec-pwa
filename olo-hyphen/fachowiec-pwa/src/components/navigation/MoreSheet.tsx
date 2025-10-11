import React from 'react';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { MoreHorizontal, Calendar, FileText, BarChart3, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Vibration } from '@/lib/vibration';

export function MoreSheet() {
  const handleToggle = (value: string) => {
    Vibration.medium();
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="flex flex-col items-center space-y-1 px-3 py-2.5 rounded-2xl min-w-[44px] min-h-[44px] text-muted-foreground hover:text-foreground hover:bg-primary/5 transition-all duration-300 active-press">
          <MoreHorizontal className="h-5 w-5" />
          <span className="text-[10px] font-medium">Więcej</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="bottom" className="glass-premium border-t border-primary/20 p-0">
        <Accordion type="single" collapsible className="w-full" onValueChange={handleToggle}>
          <AccordionItem value="planowanie">
            <AccordionTrigger className="glass-subtle hover:glass-premium px-4 py-3 border-b border-border/50">
              Planowanie
            </AccordionTrigger>
            <AccordionContent className="space-y-1 px-4 pb-4">
              <NavLink to="/calendar" className="block py-2 text-sm hover:text-foreground transition-colors">Kalendarz</NavLink>
              <NavLink to="/estimates" className="block py-2 text-sm hover:text-foreground transition-colors">Kosztorysy</NavLink>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="raporty">
            <AccordionTrigger className="glass-subtle hover:glass-premium px-4 py-3 border-b border-border/50">
              Raporty
            </AccordionTrigger>
            <AccordionContent className="space-y-1 px-4 pb-4">
              <NavLink to="/reports" className="block py-2 text-sm hover:text-foreground transition-colors">Raporty</NavLink>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="ustawienia">
            <AccordionTrigger className="glass-subtle hover:glass-premium px-4 py-3">
              Ustawienia
            </AccordionTrigger>
            <AccordionContent className="space-y-1 px-4 pb-4">
              <NavLink to="/settings" className="block py-2 text-sm hover:text-foreground transition-colors">Ustawienia</NavLink>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </SheetContent>
    </Sheet>
  );
}