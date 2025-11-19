import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type Props = {
    resumeInfo:ResumeInfo
}

export type ResumeInfo = {
  resumeUrl: string
}

export default function ViewResumeDialog({ resumeInfo }: Props) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className='bg-primary hover:border-primary border-[1.5px] hover:bg-white hover:text-primary'>View Resume</Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[90vh]">
        <DialogHeader>
          <DialogTitle>Resume Preview</DialogTitle>
        </DialogHeader>
        <div className="w-full h-full">
          <iframe
            src={resumeInfo.resumeUrl}
            className="w-full h-[70vh] rounded-lg border"
            title="Resume Preview"
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
