import { Button } from "@/components/ui/button";
import React, { useState, useEffect } from 'react';
import { bancoDeFilmes } from './data/filmes';

const API_KEY = '4ede349037e0f200c7f9b833be392872';
const API_URL = `https://api.themoviedb.org/3/movie/now_playing?api_key=${API_KEY}&language=pt-BR&region=BR&page=1`;
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const genresMap = {
  28: "Ação", 12: "Aventura", 16: "Animação", 35: "Comédia", 80: "Crime",
  99: "Documentário", 18: "Drama", 10751: "Família", 14: "Fantasia",
  36: "História", 27: "Terror", 10402: "Música", 9648: "Mistério",
  10749: "Romance", 878: "Ficção Científica", 53: "Thriller", 10752: "Guerra", 37: "Faroeste"
};

export default function App() {
  const [movies, setMovies] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('all');
  const [usuarioApelido, setUsuarioApelido] = useState('');

  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showApelidoModal, setShowApelidoModal] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);

  const [emailInput, setEmailInput] = useState('');
  const [senhaInput, setSenhaInput] = useState('');
  const [apelidoInput, setApelidoInput] = useState('');

  useEffect(() => {
    const salvo = localStorage.getItem('usuarioApelido');
    if (salvo) setUsuarioApelido(salvo);
  }, []);

  useEffect(() => {
    async function loadMovies() {
      try {
        const response = await fetch(API_URL);
        const data = await response.json();
        
        if (data.results && data.results.length > 0) {
          // Processa filmes da API
          const apiFormatted = data.results.map(m => ({
            id: `api-${m.id}`,
            titulo: m.title,
            banner: m.poster_path ? `${IMAGE_BASE_URL}${m.poster_path}` : 'https://via.placeholder.com/500x750?text=Sem+Imagem',
            genre_ids: m.genre_ids || [],
            genero: m.genre_ids && m.genre_ids.length > 0 ? genresMap[m.genre_ids[0]] : 'Cinema',
            lancamento: m.release_date ? m.release_date.split('-')[0] : '2026',
            rating: m.vote_average ? m.vote_average.toFixed(1) : '7.0',
            saida: 'Em exibição nos cinemas'
          }));

          // Deduplicação rigorosa por palavra-chave do título
          const seenTitles = new Set();
          const uniqueList = [];

          apiFormatted.forEach(movie => {
            const cleanTitle = movie.titulo.toLowerCase().split(':')[0].trim();
            if (!seenTitles.has(cleanTitle)) {
              seenTitles.add(cleanTitle);
              uniqueList.push(movie);
            }
          });

          setMovies(uniqueList);
        } else {
          setMovies(bancoDeFilmes);
        }
      } catch (err) {
        console.error("Erro ao carregar filmes da API:", err);
        setMovies(bancoDeFilmes);
      }
    }
    loadMovies();
  }, []);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setShowLoginModal(false);
    setShowApelidoModal(true);
  };

  const handleApelidoSubmit = (e) => {
    e.preventDefault();
    if (apelidoInput.trim() !== '') {
      localStorage.setItem('usuarioApelido', apelidoInput.trim());
      setUsuarioApelido(apelidoInput.trim());
      setShowApelidoModal(false);
      setApelidoInput('');
      setEmailInput('');
      setSenhaInput('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('usuarioApelido');
    setUsuarioApelido('');
  };

  // Filtro por gênero
  const filmesFiltrados = movies.filter(movie => 
    selectedGenre === 'all' || (movie.genre_ids && movie.genre_ids.includes(Number(selectedGenre)))
  );

  return (
    <div>
      {/* HEADER */}
      <header className="topbar">
        <div className="brand" aria-label="PopFlix home">
          <span>Pop<span className="highlight">Flix</span></span>
        </div>

        <div className="header-actions">
          {usuarioApelido ? (
            <div className="user-perfil">
              <span>{usuarioApelido}</span>
              <button onClick={handleLogout} className="btn-sair">Sair</button>
            </div>
          ) : (
            <Button size="sm" onClick={() => setShowLoginModal(true)}>
            Entrar
          </Button>
          )}
        </div>
      </header>

      {/* CONTEÚDO PRINCIPAL */}
      <main className="content-layout">
        <aside className="sidebar-filters">
          <h2>Gêneros</h2>
          <div className="filters-container">
            {[
              { id: 'all', label: 'Todos' },
              { id: '28', label: 'Ação' },
              { id: '35', label: 'Comédia' },
              { id: '27', label: 'Terror' },
              { id: '18', label: 'Drama' },
              { id: '878', label: 'Ficção Científica' },
              { id: '53', label: 'Thriller' }
            ].map(genre => (
              <button
                key={genre.id}
                onClick={() => setSelectedGenre(genre.id)}
                className={`filter-btn ${selectedGenre === genre.id ? 'active' : ''}`}
              >
               {genre.label.replace(/filme de ação/i, 'Ação')}
              </button>
            ))}
          </div>
        </aside>

        <section className="movies-container">
          {filmesFiltrados.map(filme => (
            <article 
              key={filme.id} 
              className="movie-card"
              onClick={() => setSelectedMovie(filme)}
            >
              <img src={filme.banner} alt={filme.titulo} className="movie-poster" loading="lazy" />
              <div className="movie-details">
              <span className="movie-genre">{filme.genero?.replace(/filme de ação/i, 'Ação')}</span>
                <h3 className="movie-title" title={filme.titulo}>{filme.titulo}</h3>
                <div className="movie-meta">
                  <span>📅 {filme.lancamento}</span>
                  {filme.rating && <span>⭐ {filme.rating}</span>}
                </div>
              </div>
            </article>
          ))}
        </section>
      </main>

      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} PopFlix. Todos os direitos reservados.</p>
      </footer>

      {/* MODAL LOGIN */}
      {showLoginModal && (
        <div className="modal-container">
          <div className="modal-content">
            <button onClick={() => setShowLoginModal(false)} className="close-btn">&times;</button>
            <h2>Criar Conta</h2>
            <form onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <label htmlFor="emailInput">Gmail</label>
                <input 
                  type="email" 
                  id="emailInput" 
                  placeholder="seuemail@gmail.com" 
                  required 
                  value={emailInput}
                  onChange={e => setEmailInput(e.target.value)}
                />
              </div>
              <div className="input-group">
                <label htmlFor="senhaInput">Senha</label>
                <input 
                  type="password" 
                  id="senhaInput" 
                  placeholder="••••••••" 
                  required 
                  value={senhaInput}
                  onChange={e => setSenhaInput(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-submit">Criar</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL APELIDO */}
      {showApelidoModal && (
        <div className="modal-container">
          <div className="modal-content">
            <button onClick={() => setShowApelidoModal(false)} className="close-btn">&times;</button>
            <h2>Seu Apelido</h2>
            <p className="subtitulo-modal">Como você quer ser chamado no PopFlix?</p>
            <form onSubmit={handleApelidoSubmit}>
              <div className="input-group">
                <label htmlFor="apelidoInput">Apelido</label>
                <input 
                  type="text" 
                  id="apelidoInput" 
                  placeholder="Ex: Pedro123" 
                  required 
                  value={apelidoInput}
                  onChange={e => setApelidoInput(e.target.value)}
                />
              </div>
              <button type="submit" className="btn-submit">Concluir</button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL DETALHES */}
      {selectedMovie && (
        <div className="modal-container">
          <div className="modal-content" style={{ textAlign: 'center', maxWidth: '400px' }}>
            <button onClick={() => setSelectedMovie(null)} className="close-btn">&times;</button>
            <img id="bannerFilme" src={selectedMovie.banner} alt={selectedMovie.titulo} />
            <h2>{selectedMovie.titulo}</h2>
            <div style={{ marginTop: '16px', fontSize: '15px', color: '#ddd' }}>
              <p style={{ margin: '8px 0' }}>📅 Lançamento: <span>{selectedMovie.lancamento}</span></p>
              <p style={{ margin: '8px 0' }}>🎬 Saída: <span>{selectedMovie.saida}</span></p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}