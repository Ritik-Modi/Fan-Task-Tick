import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogOverlay,
  DialogClose
} from "@/components/ui/dialog";

interface LoginProps {
    btnName?: string;
}

function Template({btnName}: LoginProps) {
  return (
    <Dialog >
      <DialogTrigger className="" >{ btnName }</DialogTrigger>
       <DialogOverlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40" />
      <DialogContent className="bg-darkgray text-white font-bold h-[500px]">
        <DialogHeader className="text-white">
          <DialogTitle>
            {/* if btnName is Login the show the text Log in to your Account  */}
          </DialogTitle>
        </DialogHeader>
        <DialogClose>Close</DialogClose>
      </DialogContent>
    </Dialog>
  );
}

export default Template;
