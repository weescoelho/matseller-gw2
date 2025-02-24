import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Image from "next/image";

interface Material {
  id: number;
  name: string;
  category: string;
  count: number;
  price: {
    buy: number;
    sell: number;
  };
  icon?: string;
}

interface MaterialsGridProps {
  materials: Material[];
}

// Categorias baseadas no repositório original
const MATERIAL_CATEGORIES = {
  "Basic Materials": [2, 3, 4, 5, 6], // Tier 1-6 Basic Materials
  "Fine Materials": [24, 25, 26, 27, 28, 29], // Tier 1-6 Fine Materials
  "Rare Materials": [30, 31, 32, 33, 34, 35], // Tier 1-6 Rare Materials
  "Cooking Materials": [
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23, // Cooking Materials
  ],
  "Ascended Materials": [37, 38, 39, 40], // Ascended Materials
  "Refined Materials": [
    42,
    43,
    44,
    45,
    46,
    47,
    48,
    49,
    50,
    51, // Refined Materials
  ],
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

  // Função para categorizar materiais baseado no ID da categoria
  const categorizeMaterial = (material: Material) => {
    for (const [category, ids] of Object.entries(MATERIAL_CATEGORIES)) {
      if (ids.includes(material.id)) {
        return category;
      }
    }
    return "Outros Materiais";
  };

  // Agrupa materiais nas categorias definidas
  const materialsByCategory = materials.reduce((acc, material) => {
    const category = categorizeMaterial(material);
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  // Ordena materiais por valor dentro de cada categoria
  Object.values(materialsByCategory).forEach((categoryMaterials) => {
    categoryMaterials.sort(
      (a, b) => b.price.sell * b.count - a.price.sell * a.count
    );
  });

  const totalValue = calculateTotalValue(materials);

  return (
    <div className="grid gap-4">
      {Object.entries(materialsByCategory).map(
        ([category, items]) =>
          items.length > 0 && (
            <Card key={category} className="p-4">
              <h3 className="text-lg font-bold mb-4">{category}</h3>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead>Quantidade</TableHead>
                    <TableHead>Preço de Venda</TableHead>
                    <TableHead>Valor Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {items.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell>
                        {material.icon && (
                          <div className="w-8 h-8 relative">
                            <Image
                              src={material.icon}
                              alt={material.name}
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </TableCell>
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
                  Total da Categoria: {formatGold(calculateTotalValue(items))} (
                  {((calculateTotalValue(items) / totalValue) * 100).toFixed(1)}
                  %)
                </p>
              </div>
            </Card>
          )
      )}

      <Card className="p-4 mt-4 bg-primary/10">
        <p className="text-xl font-bold text-right">
          Valor Total de Todos os Materiais: {formatGold(totalValue)}
        </p>
      </Card>
    </div>
  );
}
