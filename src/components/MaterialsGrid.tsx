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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";

interface Material {
  id: number;
  name: string;
  rarity: string;
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

  const calculateBuyTotalValue = (materials: Material[]) => {
    return materials.reduce((total, mat) => {
      const sellPrice = mat.price.buy || 0;
      return total + mat.count * sellPrice;
    }, 0);
  };

  const materialsByCategory = materials.reduce((acc, material) => {
    const category = `${material.rarity} ${material.category}`;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(material);
    return acc;
  }, {} as Record<string, Material[]>);

  Object.values(materialsByCategory).forEach((categoryMaterials) => {
    categoryMaterials.sort(
      (a, b) => b.price.sell * b.count - a.price.sell * a.count
    );
  });

  const totalValue = calculateTotalValue(materials);
  const totalBuyValue = calculateBuyTotalValue(materials);

  return (
    <div className="grid gap-4">
      <Card className="p-4 mt-4 bg-primary/10 flex items-center justify-between md:flex-row flex-col">
        <p className="text-sm md:text-lg font-bold ">
          Valor Total (Ordem de venda): {formatGold(totalValue)}
        </p>
        <p className="text-sm md:text-lg font-bold ">
          Valor Total (Ordem de compra): {formatGold(totalBuyValue)}
        </p>
      </Card>
      <Accordion type="single" collapsible className="w-full">
        {Object.entries(materialsByCategory).map(
          ([category, items]) =>
            items.length > 0 && (
              <Card key={category} className="p-4">
                <div className="flex items-center justify-between mb-4 md:flex-row flex-col">
                  <h3 className="text-lg font-bold">{category}</h3>
                  <div className="md:text-right">
                    <p className="text-blue-600">
                      Total (Ordem de venda):{" "}
                      {formatGold(calculateTotalValue(items))} (
                      {(
                        (calculateTotalValue(items) / totalValue) *
                        100
                      ).toFixed(1)}
                      %)
                    </p>
                    <p className="text-red-600">
                      Total (Ordem de compra):{" "}
                      {formatGold(calculateBuyTotalValue(items))} (
                      {(
                        (calculateBuyTotalValue(items) / totalValue) *
                        100
                      ).toFixed(1)}
                      %)
                    </p>
                  </div>
                </div>
                <AccordionItem value={category}>
                  <AccordionTrigger>Expandir</AccordionTrigger>
                  <AccordionContent>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Item</TableHead>
                          <TableHead className="max-w-2 md:max-w-none">
                            Nome
                          </TableHead>
                          <TableHead>Qtd.</TableHead>
                          <TableHead className="hidden md:block">
                            Preço de Venda
                          </TableHead>
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
                            <TableCell className="max-w-24 md:max-w-none">
                              {material.name}
                            </TableCell>
                            <TableCell>{material.count}</TableCell>
                            <TableCell className="hidden md:block">
                              {formatGold(material.price.sell)}
                            </TableCell>
                            <TableCell>
                              {formatGold(material.count * material.price.sell)}
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </AccordionContent>
                </AccordionItem>
              </Card>
            )
        )}
      </Accordion>
    </div>
  );
}
