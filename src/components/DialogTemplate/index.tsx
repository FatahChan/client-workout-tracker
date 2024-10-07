import { ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

function DialogTemplate({
  open,
  setOpen,
  trigger,
  title,
  description,
  content,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  trigger: ReactNode;
  title: string;
  description: string;
  content: ReactNode;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription className="sr-only">
            {description}
          </DialogDescription>
        </DialogHeader>
        {content}
      </DialogContent>
    </Dialog>
  );
}

export default DialogTemplate;
