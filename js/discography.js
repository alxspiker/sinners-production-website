// JavaScript for Discography Page

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const albumsContainer = document.getElementById('albumsContainer');
  const tracksContainer = document.getElementById('tracksContainer');
  const searchInput = document.getElementById('searchInput');
  const searchButton = document.getElementById('searchButton');
  const sortSelect = document.getElementById('sortSelect');
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  // Global variables
  let songsData = [];
  let albumsData = [];
  let filteredSongs = [];
  let currentFilter = 'all';
  let currentSort = 'newest';
  let searchQuery = '';
  
  // Load songs data
  fetch('../songs/songs.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      songsData = data.songs;
      albumsData = data.albums;
      
      // Initialize the page
      initializeDiscographyPage();
    })
    .catch(error => {
      console.error('Error loading songs data:', error);
      showError('Failed to load music data. Please try again later.');
    });
  
  // Initialize the discography page
  function initializeDiscographyPage() {
    // By default, start with all songs
    filteredSongs = [...songsData];
    
    // Render albums
    renderAlbums();
    
    // Apply initial sort and render tracks
    applySortFilter();
    renderTracks();
    
    // Set up event listeners
    setupEventListeners();
  }
  
  // Render albums
  function renderAlbums() {
    // Clear albums container
    albumsContainer.innerHTML = '';
    
    if (albumsData.length === 0) {
      albumsContainer.innerHTML = '<div class="no-results">No albums found</div>';
      return;
    }
    
    // Sort albums by release date (newest first)
    const sortedAlbums = [...albumsData].sort((a, b) => 
      new Date(b.releaseDate) - new Date(a.releaseDate)
    );
    
    // Create album grid
    const albumGrid = document.createElement('div');
    albumGrid.className = 'album-grid';
    
    // Add albums to grid
    sortedAlbums.forEach(album => {
      // Create album card
      const albumCard = createAlbumCard(album);
      albumGrid.appendChild(albumCard);
    });
    
    // Add album grid to container
    albumsContainer.appendChild(albumGrid);
  }
  
  // Create album card
  function createAlbumCard(album) {
    const albumCard = document.createElement('div');
    albumCard.className = 'album-card';
    albumCard.dataset.albumId = album.id;
    
    // Format release date
    const releaseDate = new Date(album.releaseDate);
    const releaseYear = releaseDate.getFullYear();
    
    // Get track count
    const trackCount = album.trackCount || songsData.filter(song => song.albumId === album.id).length;
    
    // Create album HTML
    albumCard.innerHTML = `
      <div class="album-cover">
        <img src="${album.coverPath || 'https://via.placeholder.com/500x500/1a1a1a/ff0000?text=' + encodeURIComponent(album.title)}" alt="${album.title}">
        <div class="album-play">
          <i class="fas fa-play"></i>
        </div>
      </div>
      <div class="album-info">
        <span class="album-type">${album.type || 'EP'}</span>
        <h3>${album.title}</h3>
        <div class="album-year">${releaseYear}</div>
        <div class="album-tracks">${trackCount} tracks</div>
      </div>
    `;
    
    // Add click event to filter tracks by this album
    albumCard.addEventListener('click', function() {
      // Update filter buttons to show "all" as active
      filterButtons.forEach(btn => btn.classList.remove('active'));
      document.querySelector('[data-filter="all"]').classList.add('active');
      
      // Filter songs by this album
      filteredSongs = songsData.filter(song => song.albumId === album.id);
      currentFilter = 'all';
      
      // Apply current sort and render tracks
      applySortFilter();
      renderTracks();
      
      // Scroll to tracks
      tracksContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
    
    return albumCard;
  }
  
  // Render tracks
  function renderTracks() {
    // Clear tracks container
    tracksContainer.innerHTML = '';
    
    if (filteredSongs.length === 0) {
      tracksContainer.innerHTML = '<div class="no-results">No tracks found matching your criteria</div>';
      return;
    }
    
    // Create tracks table
    const table = document.createElement('table');
    table.className = 'tracks-list';
    
    // Create table header
    const thead = document.createElement('thead');
    thead.innerHTML = `
      <tr>
        <th>#</th>
        <th>Title</th>
        <th>Album</th>
        <th>Release Date</th>
        <th>Plays</th>
        <th>Duration</th>
        <th></th>
      </tr>
    `;
    
    // Create table body
    const tbody = document.createElement('tbody');
    
    // Add tracks to table
    filteredSongs.forEach((song, index) => {
      const row = document.createElement('tr');
      row.className = 'track-row';
      if (song.isNew) row.classList.add('new-track');
      
      // Format release date
      const releaseDate = new Date(song.releaseDate);
      const formattedDate = releaseDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      
      // Find album data
      const album = albumsData.find(a => a.id === song.albumId) || {};
      
      // Create row HTML
      row.innerHTML = `
        <td class="track-number">${index + 1}</td>
        <td class="track-title">${song.title}</td>
        <td class="track-album-info">
          <div class="track-album-thumb">
            <img src="${album.coverPath || 'https://via.placeholder.com/500x500/1a1a1a/ff0000?text=' + encodeURIComponent(album.title || song.album)}" alt="${album.title || song.album}">
          </div>
          <span class="track-album-name">${song.album}</span>
        </td>
        <td class="track-release-date">${formattedDate}</td>
        <td class="track-plays">${song.plays.toLocaleString()}</td>
        <td class="track-duration">${song.duration}</td>
        <td class="track-actions">
          <button class="track-action-btn play-btn" title="Play" data-song-id="${song.id}" data-index="${index}">
            <i class="fas fa-play"></i>
          </button>
        </td>
      `;
      
      // Add event listener to go to the song details page
      row.addEventListener('click', function(e) {
        // Ignore if clicked on the play button
        if (e.target.closest('.track-action-btn')) return;
        
        // Navigate to song details page
        window.location.href = `song.html?id=${song.id}`;
      });
      
      // Add to table
      tbody.appendChild(row);
    });
    
    // Build table and add to container
    table.appendChild(thead);
    table.appendChild(tbody);
    tracksContainer.appendChild(table);
    
    // Add play button event listeners
    setupPlayButtons();
  }
  
  // Apply selected sort and filter
  function applySortFilter() {
    // First apply filter
    switch (currentFilter) {
      case 'all':
        // If searchQuery exists, filter by that
        if (searchQuery) {
          filteredSongs = songsData.filter(song => 
            song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.album.toLowerCase().includes(searchQuery.toLowerCase()) ||
            song.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
          );
        } else {
          // Otherwise, use all songs or current album filter
          filteredSongs = [...songsData];
        }
        break;
      case 'ep':
        filteredSongs = songsData.filter(song => {
          const album = albumsData.find(a => a.id === song.albumId);
          return album && album.type.toLowerCase() === 'ep';
        });
        break;
      case 'single':
        filteredSongs = songsData.filter(song => {
          const album = albumsData.find(a => a.id === song.albumId);
          return album && album.type.toLowerCase() === 'single';
        });
        break;
      case 'featured':
        filteredSongs = songsData.filter(song => song.isFeatured);
        break;
    }
    
    // Then apply sort
    switch (currentSort) {
      case 'newest':
        filteredSongs.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
        break;
      case 'oldest':
        filteredSongs.sort((a, b) => new Date(a.releaseDate) - new Date(b.releaseDate));
        break;
      case 'name-az':
        filteredSongs.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-za':
        filteredSongs.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'plays':
        filteredSongs.sort((a, b) => b.plays - a.plays);
        break;
    }
  }
  
  // Set up event listeners
  function setupEventListeners() {
    // Filter buttons
    filterButtons.forEach(button => {
      button.addEventListener('click', function() {
        // Remove active class from all buttons
        filterButtons.forEach(btn => btn.classList.remove('active'));
        
        // Add active class to clicked button
        this.classList.add('active');
        
        // Set current filter
        currentFilter = this.dataset.filter;
        
        // Apply filter and sort
        applySortFilter();
        
        // Render tracks
        renderTracks();
      });
    });
    
    // Sort select
    sortSelect.addEventListener('change', function() {
      currentSort = this.value;
      applySortFilter();
      renderTracks();
    });
    
    // Search input
    searchInput.addEventListener('keypress', function(e) {
      if (e.key === 'Enter') {
        searchQuery = this.value.trim();
        applySortFilter();
        renderTracks();
      }
    });
    
    // Search button
    searchButton.addEventListener('click', function() {
      searchQuery = searchInput.value.trim();
      applySortFilter();
      renderTracks();
    });
  }
  
  // Setup play buttons
  function setupPlayButtons() {
    const playButtons = document.querySelectorAll('.play-btn');
    
    playButtons.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        
        const songId = this.dataset.songId;
        const songIndex = parseInt(this.dataset.index);
        const song = filteredSongs[songIndex];
        
        if (!song) return;
        
        // Find album
        const album = albumsData.find(a => a.id === song.albumId);
        
        // Update music player
        updateMusicPlayer(song, album);
        
        // Show music player modal
        const musicPlayerModal = document.getElementById('musicPlayerModal');
        if (musicPlayerModal) {
          musicPlayerModal.classList.add('show');
        }
      });
    });
  }
  
  // Update music player
  function updateMusicPlayer(song, album) {
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const duration = document.querySelector('.duration');
    const albumArt = document.querySelector('.player-album-art img');
    const currentTime = document.querySelector('.current-time');
    const progress = document.querySelector('.progress');
    
    if (trackTitle) trackTitle.textContent = song.title;
    if (trackArtist) trackArtist.textContent = song.artist;
    if (duration) duration.textContent = song.duration;
    if (currentTime) currentTime.textContent = '0:00';
    if (progress) progress.style.width = '0%';
    
    // Update album art if available
    if (albumArt) {
      albumArt.src = album && album.coverPath ? album.coverPath : 
        `https://via.placeholder.com/500x500/1a1a1a/ff0000?text=${encodeURIComponent(song.album)}`;
      albumArt.alt = song.title;
    }
  }
  
  // Show error
  function showError(message) {
    albumsContainer.innerHTML = `<div class="no-results">${message}</div>`;
    tracksContainer.innerHTML = '';
  }
});