interface Result<T> {
  code: number,
  data: T,
  msg: string
}

interface Item {
  name: string;
  url: string
}

interface PokemonList {
  count: number;
  next: string | null;
  previous: string | null;
  results: Item[]
}

interface PokemonStats {
  base_stat: number;
  effort: number;
  stat: Item
}

interface PokemonSprites {
  back_default: string
}

interface PokemonDetail {
  id: number;
  name: string;
  image: string;
  stats: PokemonStats;
  sprites: PokemonSprites;
}
