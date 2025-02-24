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

// Mapeamento de categorias específicas do GW2
const MATERIAL_CATEGORIES = {
  "Basic Crafting Materials": [
    "Wood",
    "Ore",
    "Cloth",
    "Leather",
    "Metal",
    "Basic",
    "Common",
    "Fine",
    "Coarse",
  ],
  "Intermediate Crafting Materials": [
    "Refined",
    "Component",
    "Inscription",
    "Insignia",
  ],
  "Advanced Crafting Materials": ["Rare", "Exotic", "Elite", "Superior"],
  "Ascended Materials": ["Ascended", "Bloodstone", "Dragonite", "Empyreal"],
  "Gemstones and Jewels": ["Gem", "Jewel", "Crystal"],
  "Cooking Materials": ["Cooking", "Ingredient", "Seasoning", "Food"],
  "Scribing Materials": ["Scribing", "Decoration", "Resonating"],
  "Festive Materials": ["Festival", "Holiday", "Wintersday", "Halloween"],
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

  // Função para categorizar materiais
  const categorizeMaterial = (material: Material) => {
    const materialName = material.name.toLowerCase();

    for (const [category, keywords] of Object.entries(MATERIAL_CATEGORIES)) {
      if (
        keywords.some(
          (keyword) =>
            materialName.includes(keyword.toLowerCase()) ||
            material.category.toLowerCase().includes(keyword.toLowerCase())
        )
      ) {
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
