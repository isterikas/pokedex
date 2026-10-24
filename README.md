# Pokédex of Anomalies

A compact, offline-first Pokédex for the original 151 Pokémon, built with React Native, Expo, and strict TypeScript. A red device casing, centered sprites, green LCD readout, and tactile controls bring the classic Pokédex into a responsive interface.

| Wide layout                                                                 | Phone layout                                                                      |
| --------------------------------------------------------------------------- | --------------------------------------------------------------------------------- |
| ![Pokédex in a wide browser viewport](docs/screenshots/pokedex-desktop.jpg) | ![Pokédex in a phone-sized browser viewport](docs/screenshots/pokedex-mobile.jpg) |

The screenshots show the web build; they are not captures from native Android or iOS devices. Generated screenshots contain Pokémon imagery and are kept local alongside the other excluded game assets. Capture and include them in a public portfolio only when permitted for your intended use.

## Features

- All 151 standard-form Generation I Pokémon, ordered by National Pokédex number.
- Local sprites, species, metric and imperial measurements, types, and regular/hidden abilities.
- Game-specific English descriptions with FireRed as the validated default.
- A selector showing only games with an entry for the current Pokémon. Missing selections explicitly identify the actual fallback game.
- Direction pad navigation: left/right move one Pokémon; up/down move ten. Movement stops at #0001 and #0151.
- Red X returns to Bulbasaur; green check opens the game selector.
- Safe-area support, accessible control labels, scalable text, and scrollable descriptions.

## Stack

Expo SDK 58, React Native, React, and TypeScript; `StyleSheet` for UI; `expo-image` for bundled sprites; React state for navigation; Jest and React Native Testing Library for tests; ESLint and Prettier for code quality. Space Mono provides the retro readout typography and is bundled locally.

## Run locally

Use Node.js 24 and npm. The first preparation requires internet access and access to the upstream data and sprite sources.

```sh
npm ci
npm run generate
npm run validate
npm start
```

Then use Expo's terminal shortcuts, or launch a particular target:

```sh
npm run ios
npm run android
npm run web
```

The iOS simulator requires macOS and Xcode. The Android emulator requires an Android SDK/emulator installation. A compatible Expo Go installation can also open the development project.

**Generate before the first bundle or type check.** The generated dataset, sprites, and raw cache are deliberately excluded from public Git history. A source checkout does not contain the third-party game text or images. After generation, the native app reads local data and assets from its bundle and makes no application data requests during normal use. Expo Go and development builds can still require a development server; use a standalone installed native build to verify first-launch offline behavior. The web export is a static site and does not install a service worker for offline page reloads.

## Data and sprite generation

The build-time generator fetches IDs 1–151 from [PokéAPI's Pokémon and species endpoints](https://pokeapi.co/docs/v2), plus English ability display names. [PokémonDB's Pokédex](https://pokemondb.net/pokedex) is the information reference, and [PokémonDB's sprite catalogue](https://pokemondb.net/sprites) supplies normal, front-facing sprites.

The generator:

1. Checks that API records describe the requested IDs and default forms.
2. Uses official English name/species/ability metadata, preserving names such as Nidoran♀, Nidoran♂, Farfetch’d, and Mr. Mime.
3. Collects available English flavor text by its actual game-version identifier and normalizes whitespace without rewriting wording.
4. Validates all 151 Brilliant Diamond/Shining Pearl sprite URLs, including exceptional sprite slugs. If that set is incomplete, validates all 151 Diamond/Pearl sprites and uses the complete fallback set consistently. It fails if neither set is complete.
5. Validates PNG signatures, chunk checksums, dimensions, and compressed image data, and records source URLs and SHA-256 checksums.
6. Produces the ordered JSON dataset and a TypeScript manifest with static `require()` calls so Metro can bundle every image.

Requests use at most six workers, bounded retries, and timeouts. Responses are cached in `.cache/pokemon-data/`; repeated generation reuses this cache. HTTP 404/410 sprite results are also cached. To recheck upstream sources explicitly:

```sh
npm run generate -- --refresh
npm run validate
```

Generated outputs:

| Path                                                   | Purpose                                                                |
| ------------------------------------------------------ | ---------------------------------------------------------------------- |
| `src/data/pokemon.json`                                | All 151 normalized Pokémon records and their available English entries |
| `src/data/spriteManifest.ts`                           | Static local asset references                                          |
| `src/assets/sprites/0001.png` … `0151.png`             | Selected, consistent sprite set                                        |
| `reports/data-completeness.json`                       | Data coverage, sources, naming cases, and selected sprite generation   |
| `reports/sprites-brilliant-diamond-shining-pearl.json` | Successes and failures for the preferred set                           |
| `reports/sprites-diamond-pearl.json`                   | Fallback validation, produced only when needed                         |

`npm run validate` runs locally without upstream requests. It rejects incomplete or unordered data, absent FireRed entries, invalid metadata, mixed sprite generations, missing static references, invalid PNGs, or files that differ from their source checksums. See the generated reports for the actual selected generation and coverage, rather than assuming that a source has complete coverage.

The initial validation on 24 October 2026 confirmed **151/151 Brilliant Diamond/Shining Pearl sprites** and **151/151 FireRed entries**. The Diamond/Pearl fallback was not needed. Refresh the reports to verify later upstream changes.

Sprite generation and description game are independent. Choosing a Red description, for example, leaves the selected sprite set unchanged. PokéAPI does not provide every description shown elsewhere; the app offers only entries present in its validated dataset.

## Architecture

```text
src/
  components/          Device frame, display, readout, and reusable controls
  features/pokedex/    Screen composition and navigation state
  data/                Repository boundary, validation, generated JSON/manifest
  types/               Domain model and repository interface
  constants/           Theme, type colors, and game-name configuration
  utils/               Number, measurement, and flavor-text formatting
  assets/              Generated sprite PNGs (fonts are bundled from their package)
scripts/
  generatePokemonData.ts
  validatePokemonData.ts
  validateSprites.ts
  lib/                 Source access, caching, concurrency, and PNG validation
tests/                 Unit, component, navigation, and generated-bundle checks
reports/               Generated coverage and sprite source reports
```

`PokemonRepository` separates bundled storage from presentation. A future storage implementation can supply the same small interface. Components receive typed data and callbacks; source parsing and unit conversions stay outside layout code. Navigation uses React state, keeping the fixed dataset simple without a global state library, database, backend, or runtime cache.

The app deliberately keeps selection state in memory. It starts at Bulbasaur with FireRed selected on a new launch. Descriptions scroll inside the readout, while smaller screens can scroll the overall device. Typography and colors are configured centrally; no font CDN is required at runtime.

## Quality checks

Run generation once before these commands:

```sh
npm run typecheck
npm run lint
npm test
npm run check
npm run format:check
npm run export:web
```

Tests cover formatting/conversions, whitespace normalization, truthful game fallback selection, dataset rejection cases, the generated 151-record bundle, sprite references, navigation boundaries/jumps, accessible controls, details, hidden abilities, and description selection. A long-text component test checks that full text remains in a scrollable area; actual clipping and touch behavior also need visual/device checks.

GitHub Actions installs locked dependencies, restores the generator cache when available, generates and validates the bundle, runs TypeScript/lint/tests, and verifies the web export. CI therefore needs network access when its source cache is empty.

## Native offline verification

Automated tests and a web bundle are not substitutes for native airplane-mode testing. Native Android/iOS offline verification remains a manual release check:

1. Install a standalone build containing the generated dataset, images, and font.
2. Disable Wi-Fi/mobile data before the first launch; confirm Bulbasaur's sprite and information.
3. Browse all 151 Pokémon, checking every sprite and entry.
4. Switch between available games and verify immediate updates and correctly labeled fallbacks.
5. Close the app completely and relaunch while still offline.
6. Repeat on Android and iOS where available, including a small screen and larger accessibility text.

No native device or simulator airplane-mode run is claimed by this repository's automated checks.

## Sources, attribution, and rights

Pokémon names, characters, sprites, and game text belong to their respective rights holders. Public accessibility through PokéAPI or PokémonDB does not grant redistribution rights. This is an unofficial personal portfolio project, unaffiliated with or endorsed by the Pokémon rights holders.

Generated game text, sprites, and raw upstream responses are excluded from the public repository. Generate them locally only as permitted by the source terms and your intended use. Publishing a binary or hosting the generated web bundle redistributes those materials; confirm the necessary rights before doing so. Attribution alone does not grant permission. Any license for this project's original source code does not cover Pokémon material or third-party fonts.

Space Mono is bundled through [`@expo-google-fonts/space-mono`](https://github.com/expo/google-fonts/tree/master/font-packages/space-mono) under the SIL Open Font License 1.1. Its license notice is retained in [`src/assets/fonts/SpaceMono-OFL.txt`](src/assets/fonts/SpaceMono-OFL.txt). Retain the notice when redistributing the font. No license to Pokémon assets is included.
