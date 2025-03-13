// JavaScript for Single-Page Website Functionality

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const songDetailsSection = document.getElementById('song-details');
  const backToDiscographyButton = document.getElementById('backToDiscography');
  const allSections = document.querySelectorAll('section');
  
  // Global variables
  let songsData = [];
  let albumsData = [];
  let currentSongId = null;
  
  // Initialize single-page navigation
  initSinglePageNav();
  
  // Setup event listeners for song navigation
  setupSongNavigation();
  
  // Check if URL contains a song ID parameter and display if needed
  checkForSongInURL();
  
  // Initialize single-page navigation
  function initSinglePageNav() {
    // Add event listener to the Back to Discography button
    if (backToDiscographyButton) {
      backToDiscographyButton.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Hide song details section and show discography section
        hideSongDetails();
        
        // Update URL without song parameter
        history.pushState({}, '', '#discography');
      });
    }
  }
  
  // Setup song navigation
  function setupSongNavigation() {
    // Modify track click behavior in main.js and discography.js
    // This function will set up custom event listeners to override
    // the default track click behaviors in those files
    
    // Listen for custom event from other scripts
    document.addEventListener('showSongDetails', function(e) {
      if (e.detail && e.detail.songId) {
        showSongDetails(e.detail.songId);
      }
    });
    
    // Override track item click behavior for the main page
    document.addEventListener('click', function(e) {
      const trackItem = e.target.closest('.track-item');
      if (trackItem && !e.target.closest('.track-play')) {
        e.preventDefault();
        e.stopPropagation();
        
        const songId = trackItem.dataset.songId;
        if (songId) {
          showSongDetails(songId);
        }
      }
    });
  }
  
  // Check if URL contains a song ID parameter
  function checkForSongInURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('song');
    
    if (songId) {
      // Wait for songs data to be loaded
      checkSongsDataReady().then(() => {
        showSongDetails(songId);
      });
    }
  }
  
  // Wait for songs data to be loaded
  function checkSongsDataReady() {
    return new Promise((resolve) => {
      const checkData = () => {
        if (window.songsData && window.songsData.length > 0) {
          songsData = window.songsData;
          albumsData = window.albumsData || [];
          resolve();
        } else {
          setTimeout(checkData, 100);
        }
      };
      
      checkData();
    });
  }
  
  // Show song details section
  function showSongDetails(songId) {
    currentSongId = songId;
    
    // Load song data if not already loaded
    if (songsData.length === 0) {
      loadSongData().then(() => {
        populateSongDetails(songId);
      });
    } else {
      populateSongDetails(songId);
    }
    
    // Hide all sections except footer
    allSections.forEach(section => {
      if (section.id !== 'song-details') {
        section.style.display = 'none';
      }
    });
    
    // Show song details section
    songDetailsSection.style.display = 'block';
    
    // Scroll to top
    window.scrollTo(0, 0);
    
    // Update URL with song ID parameter
    history.pushState({}, '', `?song=${songId}#song-details`);
  }
  
  // Hide song details section
  function hideSongDetails() {
    // Hide song details section
    songDetailsSection.style.display = 'none';
    
    // Show all sections except the song details section
    allSections.forEach(section => {
      if (section.id !== 'song-details') {
        section.style.display = '';
      }
    });
    
    // Scroll to discography section
    document.getElementById('discography').scrollIntoView();
  }
  
  // Load song data from JSON file
  function loadSongData() {
    return fetch('songs/songs.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        songsData = data.songs;
        albumsData = data.albums;
        
        // Make data available globally
        window.songsData = songsData;
        window.albumsData = albumsData;
        
        return data;
      })
      .catch(error => {
        console.error('Error loading songs data:', error);
        showError('Failed to load song data');
      });
  }
  
  // Populate song details section
  function populateSongDetails(songId) {
    const song = songsData.find(s => s.id === songId);
    if (!song) {
      showError('Song not found');
      return;
    }
    
    // Update song details
    const songTitle = document.getElementById('songTitle');
    const songAlbum = document.getElementById('songAlbum');
    const songReleaseDate = document.getElementById('songReleaseDate');
    const songDuration = document.getElementById('songDuration');
    const songPlays = document.getElementById('songPlays');
    const songTags = document.getElementById('songTags');
    const songLyrics = document.getElementById('songLyrics');
    const songDescription = document.getElementById('songDescription');
    const moreSongs = document.getElementById('moreSongs');
    const songCoverImg = document.querySelector('.song-details .song-cover img');
    
    // Update document title
    document.title = `${song.title} | SIN`;
    
    // Update song info
    if (songTitle) songTitle.textContent = song.title;
    if (songAlbum) songAlbum.textContent = `${song.album} ${albumsData.find(a => a.id === song.albumId)?.type || 'EP'}`;
    
    // Format and display release date
    if (songReleaseDate) {
      const releaseDate = new Date(song.releaseDate);
      songReleaseDate.textContent = `Released: ${releaseDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })}`;
    }
    
    // Display duration and plays
    if (songDuration) songDuration.textContent = `Duration: ${song.duration}`;
    if (songPlays) songPlays.textContent = `Plays: ${song.plays.toLocaleString()}`;
    
    // Display tags
    if (songTags) {
      songTags.innerHTML = '';
      song.tags.forEach(tag => {
        const tagElement = document.createElement('span');
        tagElement.className = 'tag';
        tagElement.textContent = tag;
        songTags.appendChild(tagElement);
      });
    }
    
    // Display song description
    if (songDescription) songDescription.textContent = song.description;
    
    // Update cover image
    if (songCoverImg) {
      songCoverImg.src = song.coverPath || `https://via.placeholder.com/500x500/1a1a1a/ff0000?text=${encodeURIComponent(song.title)}`;
      songCoverImg.alt = song.title;
    }
    
    // Update lyrics
    if (songLyrics) {
      updateLyrics(song, songLyrics);
    }
    
    // Update more songs from this album
    if (moreSongs) {
      updateMoreSongs(song, moreSongs);
    }
  }
  
  // Update lyrics with proper formatting
  function updateLyrics(song, lyricsContainer) {
    lyricsContainer.innerHTML = '';
    
    // Handle placeholder lyrics
    if (song.lyrics.placeholder) {
      const placeholder = document.createElement('p');
      placeholder.textContent = song.lyrics.placeholder;
      lyricsContainer.appendChild(placeholder);
      return;
    }
    
    // Process each section of lyrics
    for (const [section, text] of Object.entries(song.lyrics)) {
      // Create section title
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'section-title';
      sectionTitle.textContent = formatSectionName(section);
      lyricsContainer.appendChild(sectionTitle);
      
      // Create lyrics text
      const lyrics = document.createElement('p');
      lyrics.textContent = text;
      lyricsContainer.appendChild(lyrics);
    }
  }
  
  // Format section name (e.g., "verse1" to "Verse 1")
  function formatSectionName(section) {
    // Handle special cases
    if (section === 'verse1') return 'Verse 1';
    if (section === 'verse2') return 'Verse 2';
    if (section === 'verse3') return 'Verse 3';
    if (section === 'verse4') return 'Verse 4';
    if (section === 'chorus') return 'Chorus';
    if (section === 'bridge') return 'Bridge';
    if (section === 'intro') return 'Intro';
    if (section === 'outro') return 'Outro';
    if (section === 'hook') return 'Hook';
    if (section === 'interlude') return 'Interlude';
    if (section === 'pre_chorus') return 'Pre-Chorus';
    
    // Handle general case (e.g., "verse_1" to "Verse 1")
    return section
      .replace(/_/g, ' ')
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
  
  // Update more songs from this album
  function updateMoreSongs(currentSong, container) {
    // Get other songs from the same album
    const albumSongs = songsData
      .filter(song => song.albumId === currentSong.albumId && song.id !== currentSong.id)
      .slice(0, 5); // Limit to 5 songs
    
    // Clear the container
    container.innerHTML = '';
    
    // If no other songs, hide the section
    if (albumSongs.length === 0) {
      document.querySelector('.more-songs').style.display = 'none';
      return;
    } else {
      document.querySelector('.more-songs').style.display = 'block';
    }
    
    // Add each related song
    albumSongs.forEach(song => {
      const li = document.createElement('li');
      
      const a = document.createElement('a');
      a.href = `?song=${song.id}#song-details`;
      a.addEventListener('click', function(e) {
        e.preventDefault();
        showSongDetails(song.id);
      });
      
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      
      const img = document.createElement('img');
      img.src = song.coverPath || `https://via.placeholder.com/50x50/1a1a1a/ff0000?text=${encodeURIComponent(song.title)}`;
      img.alt = song.title;
      
      const info = document.createElement('div');
      info.className = 'song-info-small';
      
      const title = document.createElement('div');
      title.className = 'song-title';
      title.textContent = song.title;
      
      const duration = document.createElement('div');
      duration.className = 'song-duration';
      duration.textContent = song.duration;
      
      // Build the DOM structure
      thumb.appendChild(img);
      info.appendChild(title);
      info.appendChild(duration);
      a.appendChild(thumb);
      a.appendChild(info);
      li.appendChild(a);
      
      container.appendChild(li);
    });
  }
  
  // Show error message
  function showError(message) {
    const songTitle = document.getElementById('songTitle');
    const songLyrics = document.getElementById('songLyrics');
    const songDescription = document.getElementById('songDescription');
    
    if (songTitle) songTitle.textContent = 'Error';
    
    if (songLyrics) {
      songLyrics.innerHTML = '';
      const error = document.createElement('p');
      error.textContent = message;
      error.style.color = 'var(--primary-color)';
      songLyrics.appendChild(error);
    }
    
    if (songDescription) {
      songDescription.textContent = 'An error occurred while loading the song details. Please try again later.';
    }
    
    // Hide more songs section
    const moreSongsSection = document.querySelector('.more-songs');
    if (moreSongsSection) moreSongsSection.style.display = 'none';
  }
  
  // Handle browser history navigation
  window.addEventListener('popstate', function(e) {
    const urlParams = new URLSearchParams(window.location.search);
    const songId = urlParams.get('song');
    
    if (songId) {
      showSongDetails(songId);
    } else {
      // If there's no song parameter, show the main page
      hideSongDetails();
    }
  });
});