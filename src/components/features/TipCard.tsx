import Card from "@/components/ui/Card";
import { typography } from "@/styles/styles";

export function TipCard() {
  const phraseStyle = typography.h5 + " font-bold uppercase leading-snug";
  return (
    <Card className="border-orange-500 bg-gradient-to-br from-orange-500 to-orange-600 text-white">
      <div className="flex items-center gap-3 text-sm font-semibold">
        Consejos clave: Prioriza la técnica sobre el peso
      </div>

      <div className="mt-3">
        <p className={phraseStyle}>
          Es mejor levantar menos peso con buena forma que mucho peso con mala
          postura.
        </p>
      </div>
    </Card>
  );
}
