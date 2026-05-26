import { useState } from "react";
import { useSavePipeline } from "../hooks/useSavePipeline.js";
import { usePipelineStore } from "../store/pipeline.store.js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { SaveIcon, Loader2Icon } from "lucide-react";
import { toast } from "sonner";

export function SavePipelineButton() {
  const ops = usePipelineStore((s) => s.ops);

  const { save, saving } = useSavePipeline();

  const [open, setOpen] = useState(false);
  const [name, setName] = useState("Untitled pipeline");

  async function handleSave() {
    try {
      await save({
        name,
        ops,
      });

      setOpen(false);

      toast.success(`"${name}" saved`);
    } catch {
      toast.error("Failed to save pipeline");
    }
  }

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        disabled={ops.length === 0}
        onClick={() => setOpen(true)}
      >
        <SaveIcon className="w-3.5 h-3.5 mr-1.5" />
        Save
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Save pipeline</DialogTitle>
          </DialogHeader>

          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Pipeline name"
            onKeyDown={(e) => e.key === "Enter" && handleSave()}
            autoFocus
          />

          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>

            <Button onClick={handleSave} disabled={saving || !name.trim()}>
              {saving && (
                <Loader2Icon className="w-3.5 h-3.5 mr-1.5 animate-spin" />
              )}
              Save
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
