import { CalendarIcon } from "@heroicons/react/24/outline"
import Card from "@/components/dashboard/Card";

type StatsProps = {
  semana: string;
  calorias: number;
  clases: number;
};

export const StatsCards: React.FC<StatsProps> = ({semana,calorias,clases}) => {
  return (
    <Card>
      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="border border-orange-500">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <div className="text-sm font-medium text-gray-600">Esta Semana</div>
            <CalendarIcon className="h-4 w-4 text-gray-500" />
          </div>
          <div>
            <div className="text-3xl font-bold">{semana}</div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-4/5 bg-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="border border-orange-500">
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-600">Calorías estimadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{calorias}</div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-3/5 bg-orange-500" />
            </div>
          </div>
        </Card>

        <Card className="border border-orange-500">
          <div className="pb-2">
            <div className="text-sm font-medium text-gray-600">Clases Reservadas</div>
          </div>
          <div>
            <div className="text-3xl font-bold">{clases}</div>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div className="h-full w-0 bg-orange-500" />
            </div>
          </div>
        </Card>
      </div>
    </Card>
  )
}
