async function handlePokemonClick(pokemonName) {
  try {
    // 1. Consultar tu API para ver si el Pokémon ya está registrado
    const response = await fetch(`${API_URL}/pokemon/name/${pokemonName}`);
    
    let pokemonData;

    if (response.status === 404) {
      // 2. Si no está registrado (404), registrar el Pokémon con la PokéAPI
      const registerResponse = await fetch(`${API_URL}/pokemon/register/${pokemonName}`, { method: 'POST' });
      pokemonData = await registerResponse.json();
    } else {
      // 3. Si está registrado, usar los datos de tu API
      pokemonData = await response.json();
    }

    // 4. Mostrar los datos del Pokémon en el frontend
    showPokemonDetails(pokemonData);

  } catch (error) {
    console.error('Error al manejar el clic en el Pokémon:', error);
  }
}
