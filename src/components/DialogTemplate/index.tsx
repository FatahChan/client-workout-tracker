import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";

function DialogTemplate({
  trigger,
  content,
  title,
  description,
  open,
  setOpen,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
  title?: string;
  description?: string;
  open?: boolean;
  setOpen?: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>
        {title && (
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
        )}
        {description && <DialogDescription>{description}</DialogDescription>}
        {content}
      </DialogContent>
    </Dialog>
  );
}

export default DialogTemplate;
