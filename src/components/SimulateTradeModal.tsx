"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function SimulateTradeModal() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Simulate Trade</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Simulate Trade</DialogTitle>
          <DialogDescription>
            Enter the details of the trade you would like to simulate.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="stock" className="text-right">
              Stock
            </Label>
            <Input id="stock" value="AAPL" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="quantity" className="text-right">
              Quantity
            </Label>
            <Input id="quantity" value="10" className="col-span-3" />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Simulate</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
