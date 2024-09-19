import React from "react";
import { Card, CardContent } from "../ui/card";
import { cn } from "@/lib/utils";

function CardTile({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Card className={cn("flex-grow min-w-36 aspect-square", className)}>
      <CardContent className="p-4 pt-4 flex flex-col gap-2 justify-center items-center h-full">
        {children}
      </CardContent>
    </Card>
  );
}

export default CardTile;
