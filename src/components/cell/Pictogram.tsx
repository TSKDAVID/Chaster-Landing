import type { ModuleId } from "@/config/modules";
import { CellMatrix } from "./CellMatrix";
import { PICTOGRAMS } from "./bitmaps";

/** The module icon: 7 x 7 cells, six in the surface colour and one in the module's signal colour. */
export function Pictogram({ id, cell = 5, className }: { id: ModuleId; cell?: number; className?: string }) {
  return <CellMatrix rows={PICTOGRAMS[id]} cell={cell} signal={id} className={className} />;
}
