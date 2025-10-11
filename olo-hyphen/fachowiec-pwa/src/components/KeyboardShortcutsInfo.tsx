import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Keyboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export function KeyboardShortcutsInfo() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Skróty klawiszowe">
          <Keyboard className="h-5 w-5" />
        </Button>
      </TooltipTrigger>
      <TooltipContent side="bottom" className="w-64 p-4">
        <div className="space-y-2">
          <p className="font-semibold text-sm mb-3">Skróty klawiszowe</p>
          <div className="space-y-1.5 text-xs">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Dashboard</span>
              <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl/⌘ D</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Zlecenia</span>
              <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl/⌘ J</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Czas Pracy</span>
              <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">Ctrl/⌘ T</kbd>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Pomoc</span>
              <kbd className="px-2 py-0.5 bg-muted rounded text-[10px]">?</kbd>
            </div>
          </div>
        </div>
      </TooltipContent>
    </Tooltip>
  );
}
