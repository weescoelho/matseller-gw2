import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Material {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

interface MaterialsGridProps {
  materials: Material[];
}

export function MaterialsGrid({ materials }: MaterialsGridProps) {
  const categories = [...new Set(materials.map((m) => m.category))];

  const formatGold = (copper: number) => {
    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;

    return `${gold}g ${silver}s ${copperRemaining}c`;
  };

  const calculateTotalValue = (materials: Material[]) => {
    return materials.reduce(
      (total, mat) => total + mat.quantity * mat.price,
      0
    );
  };

  return (
    <div className="grid gap-4">
      {categories.map((category) => (
        <Card key={category} className="p-4">
          <h3 className="text-lg font-bold mb-4">{category}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço Unitário</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {materials
                .filter((m) => m.category === category)
                .map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.name}</TableCell>
                    <TableCell>{material.quantity}</TableCell>
                    <TableCell>{formatGold(material.price)}</TableCell>
                    <TableCell>
                      {formatGold(material.quantity * material.price)}
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <p className="font-bold">
              Total da Categoria:{" "}
              {formatGold(
                calculateTotalValue(
                  materials.filter((m) => m.category === category)
                )
              )}
            </p>
          </div>
        </Card>
      ))}

      <Card className="p-4 mt-4">
        <p className="text-xl font-bold text-right">
          Valor Total: {formatGold(calculateTotalValue(materials))}
        </p>
      </Card>
    </div>
  );
}
