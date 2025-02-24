/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useState } from "react";
import { Dialog } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { MaterialsGrid } from "@/components/MaterialsGrid";

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

export default function App() {
  const [apiKey, setApiKey] = useState<string>("");
  const [showDialog, setShowDialog] = useState(true);
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(false);

  // Função auxiliar para dividir array em chunks
  const chunkArray = (array: number[], size: number) => {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  };

  const fetchItemDetails = async (ids: number[]) => {
    try {
      const chunks = chunkArray(ids, 200);
      const allDetails = [];

      for (const chunk of chunks) {
        const response = await fetch(
          `https://api.guildwars2.com/v2/items?ids=${chunk.join(",")}`
        );
        const data = await response.json();
        allDetails.push(...data);
      }

      return allDetails;
    } catch (error) {
      console.error("Erro ao buscar detalhes dos itens:", error);
      return [];
    }
  };

  const fetchPrices = async (ids: number[]) => {
    try {
      const chunks = chunkArray(ids, 200);
      const allPrices = [];

      for (const chunk of chunks) {
        const response = await fetch(
          `https://api.guildwars2.com/v2/commerce/prices?ids=${chunk.join(",")}`
        );
        const data = await response.json();
        allPrices.push(...data);
      }

      return allPrices;
    } catch (error) {
      console.error("Erro ao buscar preços:", error);
      return [];
    }
  };

  const fetchMaterials = async () => {
    setLoading(true);
    try {
      // Busca materiais do banco
      const materialsResponse = await fetch(
        `https://api.guildwars2.com/v2/account/materials?access_token=${apiKey}`
      );
      const materialsData = await materialsResponse.json();

      // Filtra apenas itens com quantidade > 0
      const validMaterials = materialsData.filter(
        (item: any) => item.count > 0
      );
      const itemIds = validMaterials.map((item: any) => item.id);

      // Busca detalhes dos itens e preços em paralelo
      const [itemDetails, priceDetails] = await Promise.all([
        fetchItemDetails(itemIds),
        fetchPrices(itemIds),
      ]);

      // Cria um mapa de preços para fácil acesso
      const priceMap = priceDetails.reduce((acc: any, price: any) => {
        acc[price.id] = {
          buy: price.buys?.unit_price || 0,
          sell: price.sells?.unit_price || 0,
        };
        return acc;
      }, {});

      // Cria um mapa de detalhes dos itens
      const itemMap = itemDetails.reduce((acc: any, item: any) => {
        acc[item.id] = {
          name: item.name,
          rarity: item.rarity,
          category: item.type,
          icon: item.icon,
        };
        return acc;
      }, {});

      // Combina todos os dados
      const enrichedMaterials = validMaterials.map((material: any) => ({
        id: material.id,
        name: itemMap[material.id]?.name || "Item Desconhecido",
        category: itemMap[material.id]?.category || "Sem Categoria",
        rarity: itemMap[material.id]?.rarity || "Sem Raridade",
        count: material.count,
        price: priceMap[material.id] || { buy: 0, sell: 0 },
        icon: itemMap[material.id]?.icon,
      }));

      console.log(enrichedMaterials);

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
        <div className="py-6">
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
