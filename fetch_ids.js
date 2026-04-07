const movies = [
  'The Dark Knight', 'Interstellar', 'Oppenheimer', 'Inception', 'Memento',
  'Goodfellas', 'Taxi Driver', 'The Departed', 'The Wolf of Wall Street', 'The Irishman',
  'Pulp Fiction', 'Kill Bill', 'Django Unchained', 'Inglourious Basterds', 'Once Upon a Time in Hollywood',
  'Titanic', 'Avatar', 'Terminator 2', 'Aliens', 'The Terminator',
  'Gladiator', 'Alien', 'Blade Runner', 'The Martian', 'Prometheus',
  'Fight Club', 'Se7en', 'Gone Girl', 'The Social Network', 'Zodiac',
  'Psycho', 'Rear Window', 'Vertigo', 'North by Northwest', 'The Birds',
  'Dune', 'Arrival', 'Sicario', 'Prisoners', 'Blade Runner 2049',
  'Pans Labyrinth', 'The Shape of Water', 'Hellboy', 'Pacific Rim', 'Blade II',
  'Edward Scissorhands', 'Batman', 'Corpse Bride', 'Beetlejuice', 'Sweeney Todd',
  'Spirited Away', 'My Neighbor Totoro', 'Princess Mononoke', 'Howls Moving Castle', 'Ponyo'
];

async function fetchIds() {
  const map = {};
  for (const m of movies) {
    try {
      const res = await fetch(`https://api.imdbapi.dev/search/titles?query=${encodeURIComponent(m)}`);
      const data = await res.json();
      if (data.titles) {
        const first = data.titles.find(t => t.type === 'movie' || t.type === 'tvMovie');
        if (first) map[m] = first.id;
      }
    } catch(e) {
      console.error("Error on " + m, e);
    }
  }
  console.log(JSON.stringify(map, null, 2));
}
fetchIds();
