
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

export const AdDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) => {
  const handleSupportClick = () => {
    toast("Thank you for your support!", {
      description: "Your support helps us continue documenting Cuban music history."
    });
    onOpenChange(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg w-full">
        <DialogHeader>
          <DialogTitle className="text-cuba-red text-2xl">Support Ritmo Cubano</DialogTitle>
          <DialogDescription className="text-base">
            Your support helps us continue documenting the rich history of Cuban music.
          </DialogDescription>
        </DialogHeader>
        
        <div className="ad-container ad-large mx-auto my-6 p-6 min-h-[350px]">
          <div className="flex flex-col items-center justify-center h-full">
            <p className="font-medium text-gray-500 text-lg">Advertisement</p>
            <p className="text-sm text-gray-400">500x350</p>
            <p className="text-base mt-4 text-cuba-gold font-medium">Support our project by viewing our sponsors</p>
            <div className="mt-4 w-24 h-24 animate-pulse-subtle bg-cuba-gold/20 rounded-full flex items-center justify-center">
              <span className="text-cuba-gold">Ad</span>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button className="bg-cuba-gold hover:bg-cuba-gold/80 text-black font-medium" onClick={handleSupportClick}>
            Support Us
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
