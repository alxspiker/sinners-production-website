// JavaScript for Song Details Page

document.addEventListener('DOMContentLoaded', function() {
  // Get song ID from URL query parameter
  const urlParams = new URLSearchParams(window.location.search);
  const songId = urlParams.get('id');
  
  if (!songId) {
    // If no song ID provided, redirect to music section of homepage
    window.location.href = 'index.html#music';
    return;
  }
  
  // Elements
  const songTitle = document.getElementById('songTitle');
  const songAlbum = document.getElementById('songAlbum');
  const songReleaseDate = document.getElementById('songReleaseDate');
  const songDuration = document.getElementById('songDuration');
  const songPlays = document.getElementById('songPlays');
  const songTags = document.getElementById('songTags');
  const songLyrics = document.getElementById('songLyrics');
  const songDescription = document.getElementById('songDescription');
  const moreSongs = document.getElementById('moreSongs');
  const songCoverImg = document.querySelector('.song-cover img');
  
  // Global variables
  let songsData = [];
  let albumsData = [];
  let currentSong = null;
  
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
      
      // Find the current song
      currentSong = songsData.find(song => song.id === songId);
      
      if (!currentSong) {
        // If song not found, show error and redirect after a delay
        displayError('Song not found');
        setTimeout(() => {
          window.location.href = 'index.html#music';
        }, 3000);
        return;
      }
      
      // Update page with song details
      updateSongDetails();
      
      // Update related songs
      updateRelatedSongs();
    })
    .catch(error => {
      console.error('Error loading songs data:', error);
      displayError('Error loading song data');
    });
  
  // Update song details in the UI
  function updateSongDetails() {
    // Update document title
    document.title = `${currentSong.title} | SIN`;
    
    // Update basic song info
    songTitle.textContent = currentSong.title;
    songAlbum.textContent = `${currentSong.album} ${albumsData.find(a => a.id === currentSong.albumId)?.type || 'EP'}`;
    
    // Format and display release date
    const releaseDate = new Date(currentSong.releaseDate);
    songReleaseDate.textContent = `Released: ${releaseDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`;
    
    // Display duration and plays
    songDuration.textContent = `Duration: ${currentSong.duration}`;
    songPlays.textContent = `Plays: ${currentSong.plays.toLocaleString()}`;
    
    // Display tags
    songTags.innerHTML = '';
    currentSong.tags.forEach(tag => {
      const tagElement = document.createElement('span');
      tagElement.className = 'tag';
      tagElement.textContent = tag;
      songTags.appendChild(tagElement);
    });
    
    // Display song description
    songDescription.textContent = currentSong.description;
    
    // Update cover image (would use actual path in production)
    songCoverImg.src = songCoverImg.src || 'https://via.placeholder.com/500x500/1a1a1a/ff0000?text=' + encodeURIComponent(currentSong.title);
    songCoverImg.alt = currentSong.title;
    
    // Update lyrics
    updateLyrics();
  }
  
  // Update lyrics with proper formatting
  function updateLyrics() {
    songLyrics.innerHTML = '';
    
    // Handle placeholder lyrics
    if (currentSong.lyrics.placeholder) {
      const placeholder = document.createElement('p');
      placeholder.textContent = currentSong.lyrics.placeholder;
      songLyrics.appendChild(placeholder);
      return;
    }
    
    // Process each section of lyrics
    for (const [section, text] of Object.entries(currentSong.lyrics)) {
      // Create section title
      const sectionTitle = document.createElement('div');
      sectionTitle.className = 'section-title';
      sectionTitle.textContent = formatSectionName(section);
      songLyrics.appendChild(sectionTitle);
      
      // Create lyrics text
      const lyrics = document.createElement('p');
      lyrics.textContent = text;
      songLyrics.appendChild(lyrics);
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
  
  // Update the related songs section
  function updateRelatedSongs() {
    // Get other songs from the same album
    const albumSongs = songsData
      .filter(song => song.albumId === currentSong.albumId && song.id !== currentSong.id)
      .slice(0, 5); // Limit to 5 songs
    
    // Clear the list
    moreSongs.innerHTML = '';
    
    // If no other songs, hide the section
    if (albumSongs.length === 0) {
      document.querySelector('.more-songs').style.display = 'none';
      return;
    }
    
    // Add each related song
    albumSongs.forEach(song => {
      const li = document.createElement('li');
      
      const a = document.createElement('a');
      a.href = `song.html?id=${song.id}`;
      
      const thumb = document.createElement('div');
      thumb.className = 'thumb';
      
      const img = document.createElement('img');
      img.src = 'https://via.placeholder.com/50x50/1a1a1a/ff0000?text=' + encodeURIComponent(song.title);
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
      
      moreSongs.appendChild(li);
    });
  }
  
  // Display error message
  function displayError(message) {
    songTitle.textContent = 'Error';
    songAlbum.textContent = '';
    songReleaseDate.textContent = '';
    songDuration.textContent = '';
    songPlays.textContent = '';
    songTags.innerHTML = '';
    
    songLyrics.innerHTML = '';
    const error = document.createElement('p');
    error.textContent = message;
    error.style.color = 'var(--primary-color)';
    songLyrics.appendChild(error);
    
    songDescription.textContent = 'An error occurred while loading the song details. Redirecting to the music page...';
    
    // Hide more songs section
    document.querySelector('.more-songs').style.display = 'none';
  }
  
  // Play button functionality
  const playButton = document.querySelector('.play-button');
  if (playButton) {
    playButton.addEventListener('click', function() {
      // In a real implementation, this would play the song
      // For now, just toggle the play/pause icon
      const icon = this.querySelector('i');
      
      if (icon.classList.contains('fa-play')) {
        icon.classList.remove('fa-play');
        icon.classList.add('fa-pause');
      } else {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
      }
    });
  }
});