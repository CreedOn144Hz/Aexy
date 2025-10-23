import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
  } from "@/components/ui/dialog";
  import { Button } from "@/components/ui/button";
  import { Zap, Star } from "lucide-react";
  
  interface UpgradeModalProps {
    isOpen: boolean;
    onOpenChange: (isOpen: boolean) => void;
  }
  
  export function UpgradeModal({ isOpen, onOpenChange }: UpgradeModalProps) {
    return (
      <Dialog open={isOpen} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <div className="flex justify-center items-center bg-primary/10 rounded-full h-12 w-12 mx-auto mb-4">
              <Zap className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center font-headline text-2xl">Upgrade to Premium</DialogTitle>
            <DialogDescription className="text-center pt-2">
              Unlock this scenario and get access to all premium features, including unlimited conversations and advanced topics.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
             <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground"><span className="font-semibold text-foreground">Unlimited</span> conversations daily.</p>
            </div>
            <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">Access to all <span className="font-semibold text-foreground">advanced scenarios</span>.</p>
            </div>
            <div className="flex items-start space-x-3">
                <Star className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <p className="text-muted-foreground">In-depth performance tracking.</p>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Maybe Later</Button>
            <Button type="submit" className="bg-accent hover:bg-accent/90 text-accent-foreground">Upgrade Now</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }
  