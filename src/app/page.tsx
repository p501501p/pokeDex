"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Container,
  Grid,
  Paper,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonPageResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: PokemonListItem[];
}

const PAGE_SIZE = 60;
const TOTAL_POKEMON = 1351;

export default function Home() {
  const [pokemonList, setPokemonList] = useState<PokemonListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextUrl, setNextUrl] = useState<string | null>("https://pokeapi.co/api/v2/pokemon?limit=60");

  useEffect(() => {
    const fetchPage = async () => {
      if (!nextUrl) {
        return;
      }

      try {
        const response = await fetch(nextUrl);
        if (!response.ok) {
          throw new Error(`Failed to fetch Pokémon data: ${response.status}`);
        }

        const data: PokemonPageResponse = await response.json();
        setPokemonList((prev) => [...prev, ...data.results]);
        setNextUrl(data.next);
      } catch (error) {
        console.error("Error fetching Pokemon data:", error);
      } finally {
        setLoading(false);
        setLoadingMore(false);
      }
    };

    if (loading) {
      fetchPage();
    }
  }, [loading, nextUrl]);

  const loadMore = async () => {
    if (!nextUrl || loadingMore) {
      return;
    }

    setLoadingMore(true);
    const response = await fetch(nextUrl);
    if (!response.ok) {
      setLoadingMore(false);
      return;
    }

    const data: PokemonPageResponse = await response.json();
    setPokemonList((prev) => [...prev, ...data.results]);
    setNextUrl(data.next);
    setLoadingMore(false);
  };

  const totalLoaded = useMemo(() => pokemonList.length, [pokemonList]);

  return (
    <Box sx={{ minHeight: "100vh", background: "linear-gradient(135deg, #fef2f2 0%, #eff6ff 100%)", py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Paper elevation={0} sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, mb: 4, background: "rgba(255,255,255,0.8)", backdropFilter: "blur(16px)" }}>
          <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, justifyContent: "space-between", gap: 2, alignItems: { xs: "flex-start", md: "center" } }}>
            <Box>
              <Typography variant="overline" sx={{ color: "#ef4444", fontWeight: 700, letterSpacing: 2 }}>
                Pokédex Explorer
              </Typography>
              <Typography variant="h3" sx={{ fontWeight: 800, mb: 1 }}>
                ค้นพบ Pokémon มากกว่า 1351 ตัว
              </Typography>
              <Typography variant="body1" color="text.secondary">
                เลือกโปเกม่อนที่คุณชื่นชอบและดูรายละเอียดแบบครบถ้วนได้ทันที
              </Typography>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
              <Button component="a" href="/about" variant="outlined" sx={{ borderRadius: 999 }}>
                About this project
              </Button>
              <Chip label={`${totalLoaded}/${TOTAL_POKEMON} ตัว`} color="primary" sx={{ fontWeight: 700, px: 1 }} />
            </Box>
          </Box>
        </Paper>

        {loading ? (
          <Grid container spacing={2.5}>
            {Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={index}>
                <Card sx={{ borderRadius: 4, height: "100%" }}>
                  <CardContent>
                    <Skeleton variant="circular" width={72} height={72} sx={{ mb: 2 }} />
                    <Skeleton variant="text" width="60%" height={32} />
                    <Skeleton variant="text" width="40%" height={24} />
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <>
            <Grid container spacing={2.5}>
              {pokemonList.map((pokemon) => {
                const pokemonId = pokemon.url.split("/")[6];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pokemon.name}>
                    <Card sx={{ borderRadius: 4, height: "100%", transition: "transform 0.2s ease, box-shadow 0.2s ease", "&:hover": { transform: "translateY(-4px)", boxShadow: 6 } }}>
                      <CardActionArea component="a" href={`/Pokemon/${pokemon.name}`} sx={{ height: "100%" }}>
                        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", py: 3 }}>
                          <Avatar
                            alt={pokemon.name}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                            sx={{ width: 84, height: 84, mb: 2, bgcolor: "#f1f5f9" }}
                          />
                          <Typography variant="h6" sx={{ textTransform: "capitalize", fontWeight: 700 }}>
                            {pokemon.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            #{pokemonId.padStart(3, "0")}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Grid>
                );
              })}
            </Grid>

            {nextUrl && (
              <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                <Button variant="contained" onClick={loadMore} disabled={loadingMore} sx={{ borderRadius: 999, px: 4 }}>
                  {loadingMore ? "กำลังโหลด..." : "โหลดเพิ่มเติม"}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
}
