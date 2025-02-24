"use client";
import { useState, useEffect } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MaterialsGrid } from "@/components/MaterialsGrid";

interface Material {
  id: number;
  name: string;
  category: string;
  quantity: number;
  price: number;
}

export default function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [showDialog, setShowDialog] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      // Buscar materiais do banco
      const response = await fetch(
        `https://api.guildwars2.com/v2/account/materials`,
        {
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );

      const data = await response.json();

      // Mapear e enriquecer dados com preços
      const enrichedMaterials = await Promise.all(
        data.map(async (material: any) => {
          const itemDetails = await fetch(
            `https://api.guildwars2.com/v2/items/${material.id}`
          );
          const priceDetails = await fetch(
            `https://api.guildwars2.com/v2/commerce/prices/${material.id}`
          );

          const item = await itemDetails.json();
          const price = await priceDetails.json();

          return {
            id: material.id,
            name: item.name,
            category: item.type,
            quantity: material.count,
            price: price.sells.unit_price,
          };
        })
      );

      setMaterials(enrichedMaterials);
    } catch (error) {
      console.error("Erro ao buscar materiais:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApiKeySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowDialog(false);
    fetchMaterials();
  };

  return (
    <div className="container mx-auto p-4">
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <div className="p-6">
          <h2 className="text-lg font-bold mb-4">
            Digite sua API Key do Guild Wars 2
          </h2>
          <form onSubmit={handleApiKeySubmit}>
            <Input
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              placeholder="Cole sua API Key aqui"
              className="mb-4"
            />
            <Button type="submit">Confirmar</Button>
          </form>
        </div>
      </Dialog>

      {loading ? (
        <div>Carregando materiais...</div>
      ) : (
        <MaterialsGrid materials={materials} />
      )}
    </div>
  );
}
