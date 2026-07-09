"use client";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { use, useEffect, useMemo, useState } from "react";

interface PokemonDetail {
  id: number;
  name: string;
  height: number;
  weight: number;
  sprites: {
    front_default: string | null;
    other: {
      "official-artwork": {
        front_default: string | null;
      };
    };
  };
  types: { type: { name: string } }[];
  abilities: { ability: { name: string } }[];
  stats: { base_stat: number; stat: { name: string } }[];
  cries: { latest: string | null };
}

interface PokemonSpecies {
  evolution_chain: { url: string };
  flavor_text_entries: { flavor_text: string; language: { name: string } }[];
}

interface EvolutionChainResponse {
  chain: {
    species: { name: string };
    evolves_to: EvolutionChainResponse["chain"][];
  };
}

function buildEvolutionNames(chain: EvolutionChainResponse["chain"] | null): string[] {
  if (!chain) {
    return [];
  }

  const names = [chain.species.name];
  for (const next of chain.evolves_to) {
    names.push(...buildEvolutionNames(next));
  }

  return names;
}

export default function PokemonDetailPage({
  params,
}: {
  params: Promise<{ pokemonname: string }>;
}) {
  const { pokemonname } = use(params);
  const [pokemon, setPokemon] = useState<PokemonDetail | null>(null);
  const [evolutionNames, setEvolutionNames] = useState<string[]>([]);
  const [description, setDescription] = useState("Loading description...");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPokemonData = async () => {
      try {
        const pokemonResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonname}`);
        if (!pokemonResponse.ok) {
          throw new Error("ไม่พบข้อมูล Pokémon นี้");
        }

        const pokemonData = (await pokemonResponse.json()) as PokemonDetail;
        setPokemon(pokemonData);

        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonData.id}`);
        if (!speciesResponse.ok) {
          throw new Error("ไม่สามารถโหลดข้อมูลสายพันธุ์ได้");
        }

        const speciesData = (await speciesResponse.json()) as PokemonSpecies;
        const englishEntry = speciesData.flavor_text_entries.find((entry) => entry.language.name === "en");
        setDescription(englishEntry?.flavor_text.replace(/\n|\f/g, " ") ?? "No description available.");

        const evolutionResponse = await fetch(speciesData.evolution_chain.url);
        if (evolutionResponse.ok) {
          const evolutionData = (await evolutionResponse.json()) as EvolutionChainResponse;
          setEvolutionNames(buildEvolutionNames(evolutionData.chain));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      } finally {
        setLoading(false);
      }
    };

    fetchPokemonData();
  }, [pokemonname]);

  const imageUrl = useMemo(
    () => pokemon?.sprites.other["official-artwork"].front_default || pokemon?.sprites.front_default || "",
    [pokemon],
  );

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #f8fafc 0%, #eff6ff 100%)", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Button component="a" href="/" variant="outlined" sx={{ borderRadius: 999, mb: 3 }}>
          ← กลับหน้าแรก
        </Button>

        {loading && (
          <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 3, md: 4 } }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, alignItems: "center" }}>
              <Box sx={{ width: { xs: "100%", md: "33%" } }}>
                <Skeleton variant="rectangular" width="100%" height={280} sx={{ borderRadius: 4 }} />
              </Box>
              <Box sx={{ width: { xs: "100%", md: "67%" } }}>
                <Skeleton variant="text" width="30%" height={28} />
                <Skeleton variant="text" width="60%" height={48} />
                <Skeleton variant="text" width="80%" height={28} />
                <Skeleton variant="text" width="100%" height={24} />
              </Box>
            </Box>
          </Paper>
        )}

        {error && !loading && (
          <Paper elevation={0} sx={{ borderRadius: 4, p: 4, textAlign: "center" }}>
            <Typography variant="h5" color="error">
              {error}
            </Typography>
          </Paper>
        )}

        {pokemon && !loading && (
          <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 3, md: 4 }, background: "rgba(255,255,255,0.9)" }}>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 4, alignItems: "center" }}>
              <Box sx={{ width: { xs: "100%", md: "33%" }, display: "flex", justifyContent: "center" }}>
                <Image
                  src={imageUrl || "/pokemon-placeholder.png"}
                  alt={pokemon.name}
                  width={260}
                  height={260}
                  style={{ width: 260, height: 260, objectFit: "contain", borderRadius: 24, background: "#f8fafc", padding: 16 }}
                />
              </Box>

              <Box sx={{ width: { xs: "100%", md: "67%" } }}>
                <Typography variant="overline" sx={{ color: "#2563eb", fontWeight: 700, letterSpacing: 2 }}>
                  #{pokemon.id.toString().padStart(3, "0")}
                </Typography>
                <Typography variant="h3" sx={{ textTransform: "capitalize", fontWeight: 800, mb: 1 }}>
                  {pokemon.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  {description}
                </Typography>

                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2 }}>
                  {pokemon.types.map((item) => (
                    <Chip key={item.type.name} label={item.type.name} color="primary" variant="outlined" sx={{ textTransform: "capitalize" }} />
                  ))}
                </Box>

                <Typography variant="body1" sx={{ mb: 2 }}>
                  ความสูง: {(pokemon.height / 10).toFixed(1)} m • น้ำหนัก: {(pokemon.weight / 10).toFixed(1)} kg
                </Typography>

                <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5, mb: 3 }}>
                  <Card sx={{ flex: 1, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Abilities
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {pokemon.abilities.map((item) => (
                          <Chip key={item.ability.name} label={item.ability.name} sx={{ textTransform: "capitalize" }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                  <Card sx={{ flex: 1, borderRadius: 3 }}>
                    <CardContent>
                      <Typography variant="subtitle2" color="text.secondary">
                        Evolution
                      </Typography>
                      <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mt: 1 }}>
                        {evolutionNames.map((item) => (
                          <Chip key={item} label={item} sx={{ textTransform: "capitalize" }} />
                        ))}
                      </Box>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Box sx={{ display: "flex", flexDirection: { xs: "column", lg: "row" }, gap: 3 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  สถิติพื้นฐาน
                </Typography>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {pokemon.stats.map((stat) => (
                    <Box key={stat.stat.name}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography sx={{ textTransform: "capitalize" }}>{stat.stat.name}</Typography>
                        <Typography sx={{ fontWeight: 700 }}>{stat.base_stat}</Typography>
                      </Box>
                      <LinearProgress variant="determinate" value={Math.min((stat.base_stat / 255) * 100, 100)} sx={{ height: 10, borderRadius: 999 }} />
                    </Box>
                  ))}
                </Box>
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                  เสียงของ Pokémon
                </Typography>
                <Card sx={{ borderRadius: 3 }}>
                  <CardContent>
                    {pokemon.cries.latest ? (
                      <Box component="audio" controls src={pokemon.cries.latest} sx={{ width: "100%" }} />
                    ) : (
                      <Typography color="text.secondary">ไม่มีไฟล์เสียงให้เล่นในขณะนี้</Typography>
                    )}
                  </CardContent>
                </Card>
              </Box>
            </Box>
          </Paper>
        )}
      </Container>
    </Box>
  );
  // Teast
}
