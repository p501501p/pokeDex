"use client";
import { useEffect, useMemo, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip as MuiChip,
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
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';

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

// Color scheme (60 / 30 / 10 rule)
const COLOR_PRIMARY = "#f4cf53"; // 60%
const COLOR_SECONDARY = "#8edbfa"; // 30%
const COLOR_ACCENT = "#4d4a49"; // 10%

export default function Home() {
  const [searchTerm, setSearchTerm] = useState("");
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

  const filteredList = useMemo(() => {
    if (!searchTerm) return pokemonList;
    return pokemonList.filter((p) => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [pokemonList, searchTerm]);

  return (
    <Box sx={{ minHeight: "100vh", background: `linear-gradient(135deg, rgba(244,207,83,0.10) 0%, rgba(142,219,250,0.06) 100%)`, py: { xs: 4, md: 6 } }}>
      <Container maxWidth="xl">
        <Paper elevation={2} sx={{ borderRadius: 4, p: { xs: 3, md: 5 }, mb: 4, background: `linear-gradient(180deg, rgba(142,219,250,0.18), rgba(244,207,83,0.06))`, backdropFilter: "blur(12px)" }}>
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
              <Box sx={{ mt: 2, maxWidth: 520 }}>
                <Box component="label" sx={{ display: 'flex', alignItems: 'center', gap: 1.25, bgcolor: '#fff', px: 2, py: 0.5, borderRadius: 2 }}>
                  <SearchIcon color="action" />
                  <input
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="ค้นหาโปเกม่อน (เช่น pikachu)"
                    style={{ border: 'none', outline: 'none', background: 'transparent', flex: 1, fontSize: 14 }}
                  />
                </Box>
              </Box>
            </Box>
            <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 1.5 }}>
              <Button component="a" href="/about" variant="outlined" sx={{ borderRadius: 999, borderColor: COLOR_ACCENT, color: COLOR_ACCENT }}>
                About this project
              </Button>
              <MuiChip label={`${totalLoaded}/${TOTAL_POKEMON} ตัว`} sx={{ fontWeight: 800, px: 1.25, py: 0.5, bgcolor: COLOR_ACCENT, color: '#fff' }} />
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
              {filteredList.map((pokemon) => {
                const pokemonId = pokemon.url.split("/")[6];
                return (
                  <Grid size={{ xs: 12, sm: 6, md: 4, lg: 3 }} key={pokemon.name}>
                    <Card sx={{ borderRadius: 6, height: "100%", overflow: "hidden", transition: "transform 0.18s ease, box-shadow 0.18s ease", boxShadow: 1, background: '#fff', borderTop: `4px solid ${COLOR_SECONDARY}`, "&:hover": { transform: "translateY(-6px)", boxShadow: 8 } }}>
                      <CardActionArea component="a" href={`/Pokemon/${pokemon.name}`} sx={{ height: "100%" }}>
                        <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", py: 3 }}>
                          <Avatar
                            alt={pokemon.name}
                            src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`}
                            sx={{ width: 92, height: 92, mb: 2, bgcolor: 'transparent' }}
                          />
                          <Typography variant="h6" sx={{ textTransform: "capitalize", fontWeight: 800, letterSpacing: 0.3 }}>
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
