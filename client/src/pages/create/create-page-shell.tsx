import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface CreatePageShellProps {
  title: string;
  description: string;
  backTo: string;
  children: React.ReactNode;
}

export function CreatePageShell({ title, description, backTo, children }: CreatePageShellProps) {
  const navigate = useNavigate();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-start gap-4">
        <Button variant="outline" size="icon" onClick={() => navigate(backTo)}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-semibold text-foreground">{title}</h2>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
      </div>
      {children}
    </div>
  );
}
