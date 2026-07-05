export default function PokemonDetailPage({
  params,
}: {
  params: { pokemonname: string };
}) {
  const { pokemonname } = params;
  return (
    <div>
      <h1>Pokemon Detail Page</h1>
      <p>This is the detail page for Pokemon: {pokemonname}</p>
    </div>
  );
}
