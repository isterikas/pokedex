import { useState } from 'react';

import { DEFAULT_GAME_VERSION, resolveGameVersion } from '../../constants/gameVersions';
import { pokemonRepository } from '../../data/pokemonRepository';
import type { PokemonRepository } from '../../types/pokemon';

export function clampPokemonId(currentId: number, delta: number, maxId = 151): number {
  return Math.max(1, Math.min(maxId, currentId + delta));
}

export function usePokedex(repository: PokemonRepository = pokemonRepository) {
  const [currentId, setCurrentId] = useState(1);
  const [selectedVersion, setSelectedVersion] = useState(DEFAULT_GAME_VERSION);
  const [isVersionPickerOpen, setVersionPickerOpen] = useState(false);
  const records = repository.getAll();
  const pokemon = repository.getById(currentId) ?? records[0];

  if (!pokemon) {
    throw new Error('The local Pokédex is empty. Run npm run generate to restore its data.');
  }

  const entry = resolveGameVersion(pokemon.descriptions, selectedVersion);

  return {
    pokemon,
    currentId: pokemon.id,
    total: records.length,
    selectedVersion,
    displayedVersion: entry.version,
    isVersionPickerOpen,
    navigate: (delta: number) => setCurrentId((id) => clampPokemonId(id, delta, records.length)),
    reset: () => setCurrentId(1),
    openVersionPicker: () => setVersionPickerOpen(true),
    closeVersionPicker: () => setVersionPickerOpen(false),
    selectVersion: (version: string) => {
      if (pokemon.descriptions[version]?.trim()) {
        setSelectedVersion(version);
        setVersionPickerOpen(false);
      }
    },
  };
}
