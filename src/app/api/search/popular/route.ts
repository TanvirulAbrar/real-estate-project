import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { ok, serverError } from "@/lib/response";

export async function GET(req: Request) {
  try {
    const popularCities = await prisma.property.groupBy({
      by: ["city"],
      where: { deleted_at: null },
      _count: { city: true },
      orderBy: { _count: { city: "desc" } },
      take: 10,
    });

    const popularTypes = await prisma.property.groupBy({
      by: ["property_type"],
      where: { deleted_at: null },
      _count: { property_type: true },
      orderBy: { _count: { property_type: "desc" } },
      take: 5,
    });

    const popularProperties = await prisma.property.findMany({
      where: { deleted_at: null, status: "active" },
      orderBy: {
        favorites: {
          _count: "desc",
        },
      },
      take: 5,
      select: {
        id: true,
        title: true,
        city: true,
        state: true,
        price: true,
        property_type: true,
        _count: {
          select: { favorites: true },
        },
      },
    });

    const priceStats = await prisma.property.aggregate({
      where: { deleted_at: null, status: "active" },
      _min: { price: true },
      _max: { price: true },
      _avg: { price: true },
    });

    const popular = {
      cities: popularCities.map((c) => ({
        city: c.city,
        count: c._count.city,
      })),
      property_types: popularTypes.map((t) => ({
        type: t.property_type,
        count: t._count.property_type,
      })),
      properties: popularProperties,
      price_range: {
        min: priceStats._min.price,
        max: priceStats._max.price,
        avg: priceStats._avg.price,
      },
    };

    return ok(popular);
  } catch (err) {
    console.error("[search/popular] GET", err);
    return serverError();
  }
}
