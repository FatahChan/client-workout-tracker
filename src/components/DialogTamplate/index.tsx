import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";

function DialogTemplate({
  trigger,
  content,
}: {
  trigger: React.ReactNode;
  content: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger>{trigger}</DialogTrigger>
      <DialogContent>{content}</DialogContent>
    </Dialog>
  );
}

export default DialogTemplate;
