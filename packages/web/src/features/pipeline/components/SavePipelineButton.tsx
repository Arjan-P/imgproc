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
import { ROUTES } from "@/app/router/router.js";
import { useNavigate } from "react-router-dom";

export function SavePipelineButton() {
  const navigate = useNavigate();
  const name = usePipelineStore((s) => s.name);
  const setName = usePipelineStore((s) => s.setName);
  const pipelineId = usePipelineStore((s) => s.id);
  const ops = usePipelineStore((s) => s.ops);

  const { save, saving } = useSavePipeline();

  const [open, setOpen] = useState(false);

  async function handleSave() {
    try {
      const saved = await save({
        id: pipelineId,
        name,
        ops,
      });

      setOpen(false);

      toast.success(`"${saved.name}" saved`);

      if (!pipelineId) {
        navigate(ROUTES.pipeline(saved.id), {
          replace: true,
        });
      }
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
