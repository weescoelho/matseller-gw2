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
  count: number;
  price: {
    buy: number;
    sell: number;
  };
}

interface MaterialsGridProps {
  materials: Material[];
}

// Mapeamento de categorias
const CATEGORIES = {
  5: "Materiais de Crafting",
  6: "Consumíveis",
  29: "Troféus",
  30: "Ingredientes de Cozinha",
  37: "Materiais Ascendidos",
  38: "Materiais Refinados",
  46: "Materiais de Guild Hall",
  49: "Materiais de Festival",
  50: "Materiais de Mapa",
};

export function MaterialsGrid({ materials }: MaterialsGridProps) {
  const formatGold = (copper: number) => {
    if (!copper || isNaN(copper)) return "0g 0s 0c";

    const gold = Math.floor(copper / 10000);
    const silver = Math.floor((copper % 10000) / 100);
    const copperRemaining = copper % 100;

    return `${gold}g ${silver}s ${copperRemaining}c`;
  };

  const calculateTotalValue = (materials: Material[]) => {
    return materials.reduce((total, mat) => {
      const sellPrice = mat.price.sell || 0;
      return total + mat.count * sellPrice;
    }, 0);
  };

  // Agrupa materiais por categoria
  const materialsByCategory = materials.reduce((acc, material) => {
    const categoryName =
      CATEGORIES[material.category as keyof typeof CATEGORIES] ||
      `Categoria ${material.category}`;

    if (!acc[categoryName]) {
      acc[categoryName] = [];
    }

    if (material.count > 0) {
      // Mostra apenas itens com quantidade > 0
      acc[categoryName].push(material);
    }

    return acc;
  }, {} as Record<string, Material[]>);

  return (
    <div className="grid gap-4">
      {Object.entries(materialsByCategory).map(([category, items]) => (
        <Card key={category} className="p-4">
          <h3 className="text-lg font-bold mb-4">{category}</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Quantidade</TableHead>
                <TableHead>Preço de Venda</TableHead>
                <TableHead>Valor Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((material) => (
                <TableRow key={material.id}>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.count}</TableCell>
                  <TableCell>{formatGold(material.price.sell)}</TableCell>
                  <TableCell>
                    {formatGold(material.count * material.price.sell)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="mt-4 text-right">
            <p className="font-bold">
              Total da Categoria: {formatGold(calculateTotalValue(items))}
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
