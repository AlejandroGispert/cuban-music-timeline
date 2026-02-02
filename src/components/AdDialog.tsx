import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";
import AdSenseUnit from "@/components/AdSenseUnit";

export const AdDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  const supportSlot = (import.meta.env.VITE_ADSENSE_SUPPORT_SLOT || "8815092031").trim();

  const handleClose = () => {
    toast("Thank you for your support!", {
      description: "Your support helps us continue documenting Cuban music history.",
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

        <div className="ad-container ad-large mx-auto my-6 p-4 min-h-[250px]">
          <AdSenseUnit slot={supportSlot} />
        </div>

        <div className="flex justify-end mt-6">
          <Button onClick={handleClose}>Close</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
