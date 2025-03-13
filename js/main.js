// JavaScript for SIN Website

document.addEventListener('DOMContentLoaded', function() {
  // Elements
  const header = document.querySelector('.sticky-header');
  const hamburgerMenu = document.querySelector('.hamburger-menu');
  const nav = document.querySelector('nav ul');
  const trackListContainer = document.querySelector('.tracks');
  const musicPlayerModal = document.getElementById('musicPlayerModal');
  const closeModal = document.querySelector('.close-modal');
  const playPauseBtn = document.querySelector('.play-pause');
  
  // Global variables
  let songsData = [];
  let albumsData = [];
  let currentSongIndex = 0;
  
  // Load songs data
  fetch('songs/songs.json')
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      songsData = data.songs;
      albumsData = data.albums;
      renderTracks();
      setupTrackEvents();
      updateLatestRelease();
    })
    .catch(error => {
      console.error('Error loading songs data:', error);
      // Fallback to static tracks if JSON fails to load
    });
  
  // Render tracks dynamically
  function renderTracks() {
    if (!trackListContainer) return;
    
    // Clear existing tracks
    trackListContainer.innerHTML = '';
    
    // Filter songs by album (in this case, DARK MATTER EP)
    const albumSongs = songsData.filter(song => song.album === 'DARK MATTER');
    
    // Sort by newest first
    albumSongs.sort((a, b) => new Date(b.releaseDate) - new Date(a.releaseDate));
    
    // Render each track
    albumSongs.forEach((song, index) => {
      const trackItem = document.createElement('div');
      trackItem.className = 'track-item';
      trackItem.dataset.songId = song.id;
      trackItem.dataset.index = index;
      
      // Create track number
      const trackNumber = document.createElement('div');
      trackNumber.className = 'track-number';
      trackNumber.textContent = (index + 1).toString().padStart(2, '0');
      
      // Create track info
      const trackInfo = document.createElement('div');
      trackInfo.className = 'track-info';
      
      const trackTitle = document.createElement('h4');
      trackTitle.textContent = song.title;
      
      const trackAlbum = document.createElement('p');
      trackAlbum.textContent = `SIN • ${song.album} EP`;
      
      trackInfo.appendChild(trackTitle);
      trackInfo.appendChild(trackAlbum);
      
      // Create track time
      const trackTime = document.createElement('div');
      trackTime.className = 'track-time';
      trackTime.textContent = song.duration;
      
      // Create play button
      const trackPlay = document.createElement('div');
      trackPlay.className = 'track-play';
      trackPlay.innerHTML = '<i class="fas fa-play"></i>';
      
      // Add new badge if the song is new
      if (song.isNew) {
        const newBadge = document.createElement('div');
        newBadge.className = 'new-badge';
        newBadge.textContent = 'NEW';
        trackItem.appendChild(newBadge);
      }
      
      // Append all elements to track item
      trackItem.appendChild(trackNumber);
      trackItem.appendChild(trackInfo);
      trackItem.appendChild(trackTime);
      trackItem.appendChild(trackPlay);
      
      // Append track item to container
      trackListContainer.appendChild(trackItem);
    });
  }
  
  // Update the latest release section
  function updateLatestRelease() {
    // Find the newest song
    const latestSong = songsData.sort((a, b) => 
      new Date(b.releaseDate) - new Date(a.releaseDate)
    )[0];
    
    if (!latestSong) return;
    
    // Update the latest release section
    const albumCoverImg = document.querySelector('.album-cover img');
    if (albumCoverImg) {
      // Use placeholder if actual cover is not available yet
      albumCoverImg.src = albumCoverImg.src || 'https://via.placeholder.com/500x500/1a1a1a/ff0000?text=DARK+MATTER';
      albumCoverImg.alt = latestSong.title;
    }
    
    const releaseTitle = document.querySelector('.release-info h3');
    if (releaseTitle) {
      releaseTitle.textContent = latestSong.album;
    }
    
    const releaseDescription = document.querySelector('.release-info .description');
    if (releaseDescription) {
      // Find the album description
      const album = albumsData.find(album => album.id === latestSong.albumId);
      if (album) {
        releaseDescription.textContent = album.description;
      }
    }
  }
  
  // Setup track events after rendering
  function setupTrackEvents() {
    const trackItems = document.querySelectorAll('.track-item');
    
    trackItems.forEach(item => {
      item.addEventListener('click', function() {
        const songId = this.dataset.songId;
        const index = parseInt(this.dataset.index);
        
        // Find the song in our data
        const song = songsData.find(s => s.id === songId);
        if (!song) return;
        
        currentSongIndex = index;
        
        // Update music player
        updateMusicPlayer(song);
        
        // Show music player modal
        musicPlayerModal.classList.add('show');
      });
    });
  }
  
  // Update music player with song data
  function updateMusicPlayer(song) {
    const trackTitle = document.querySelector('.track-title');
    const trackArtist = document.querySelector('.track-artist');
    const duration = document.querySelector('.duration');
    const albumArt = document.querySelector('.player-album-art img');
    
    if (trackTitle) trackTitle.textContent = song.title;
    if (trackArtist) trackArtist.textContent = 'SIN';
    if (duration) duration.textContent = song.duration;
    
    // Update album art if available
    if (albumArt) {
      albumArt.src = albumArt.src || 'https://via.placeholder.com/500x500/1a1a1a/ff0000?text=DARK+MATTER';
      albumArt.alt = song.title;
    }
    
    // Reset progress bar
    const progress = document.querySelector('.progress');
    if (progress) progress.style.width = '0%';
    
    // Reset current time
    const currentTime = document.querySelector('.current-time');
    if (currentTime) currentTime.textContent = '0:00';
  }
  
  // Play next track
  function playNextTrack() {
    const tracks = document.querySelectorAll('.track-item');
    if (tracks.length === 0) return;
    
    currentSongIndex = (currentSongIndex + 1) % tracks.length;
    const nextTrack = tracks[currentSongIndex];
    if (!nextTrack) return;
    
    const songId = nextTrack.dataset.songId;
    const song = songsData.find(s => s.id === songId);
    if (!song) return;
    
    updateMusicPlayer(song);
  }
  
  // Play previous track
  function playPreviousTrack() {
    const tracks = document.querySelectorAll('.track-item');
    if (tracks.length === 0) return;
    
    currentSongIndex = (currentSongIndex - 1 + tracks.length) % tracks.length;
    const prevTrack = tracks[currentSongIndex];
    if (!prevTrack) return;
    
    const songId = prevTrack.dataset.songId;
    const song = songsData.find(s => s.id === songId);
    if (!song) return;
    
    updateMusicPlayer(song);
  }
  
  // Sticky Header
  window.addEventListener('scroll', function() {
    if (window.scrollY > 50) {
      header.style.background = 'rgba(0, 0, 0, 0.9)';
      header.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.5)';
    } else {
      header.style.background = 'rgba(0, 0, 0, 0.7)';
      header.style.boxShadow = 'none';
    }
  });
  
  // Mobile Menu Toggle
  if (hamburgerMenu) {
    hamburgerMenu.addEventListener('click', function() {
      nav.classList.toggle('show');
      hamburgerMenu.classList.toggle('active');
      
      // Transform hamburger to X
      const bars = hamburgerMenu.querySelectorAll('.bar');
      bars.forEach(bar => bar.classList.toggle('animate'));
    });
  }
  
  // Add CSS for mobile menu and animation
  const style = document.createElement('style');
  style.textContent = `
    @media (max-width: 768px) {
      nav ul.show {
        display: flex;
        flex-direction: column;
        position: absolute;
        top: 80px;
        left: 0;
        width: 100%;
        background-color: rgba(0, 0, 0, 0.9);
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        padding: 20px 0;
        z-index: 1000;
        box-shadow: 0 5px 20px rgba(0, 0, 0, 0.5);
        animation: slideDown 0.3s ease forwards;
      }
      
      nav ul.show li {
        margin: 15px 0;
        text-align: center;
      }
      
      .hamburger-menu.active .bar:nth-child(1) {
        transform: rotate(-45deg) translate(-5px, 6px);
      }
      
      .hamburger-menu.active .bar:nth-child(2) {
        opacity: 0;
      }
      
      .hamburger-menu.active .bar:nth-child(3) {
        transform: rotate(45deg) translate(-5px, -6px);
      }
      
      @keyframes slideDown {
        from {
          opacity: 0;
          transform: translateY(-10px);
        }
        to {
          opacity: 1;
          transform: translateY(0);
        }
      }
    }
    
    /* Styling for new badge */
    .new-badge {
      position: absolute;
      top: 10px;
      right: 10px;
      background-color: var(--primary-color);
      color: white;
      font-size: 0.7rem;
      padding: 2px 6px;
      border-radius: 3px;
      font-weight: bold;
    }
    
    /* Position the track item relatively for the badge */
    .track-item {
      position: relative;
    }
  `;
  document.head.appendChild(style);
  
  // Smooth Scrolling for Navigation Links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (nav.classList.contains('show')) {
        nav.classList.remove('show');
        hamburgerMenu.classList.remove('active');
        const bars = hamburgerMenu.querySelectorAll('.bar');
        bars.forEach(bar => bar.classList.remove('animate'));
      }
      
      // Scroll to target
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        const headerOffset = 80;
        const elementPosition = targetElement.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
  
  // Close Modal
  if (closeModal) {
    closeModal.addEventListener('click', function() {
      musicPlayerModal.classList.remove('show');
    });
  }
  
  // Play/Pause Toggle
  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', function() {
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
  
  // Next/Previous buttons in music player
  const nextBtn = document.querySelector('.control-btn.next');
  if (nextBtn) {
    nextBtn.addEventListener('click', playNextTrack);
  }
  
  const prevBtn = document.querySelector('.control-btn.prev');
  if (prevBtn) {
    prevBtn.addEventListener('click', playPreviousTrack);
  }
  
  // Form Submissions
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Animation for submit
      const submitBtn = this.querySelector('button[type="submit"]');
      submitBtn.textContent = 'Sending...';
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Message Sent!';
        submitBtn.style.backgroundColor = '#2ecc71';
        
        // Reset form
        setTimeout(() => {
          this.reset();
          submitBtn.textContent = 'Send Message';
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }
  
  const newsletterForm = document.querySelector('.newsletter-form');
  if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
      e.preventDefault();
      
      // Animation for submit
      const submitBtn = this.querySelector('button[type="submit"]');
      const input = this.querySelector('input');
      submitBtn.textContent = 'Subscribing...';
      
      // Simulate form submission
      setTimeout(() => {
        submitBtn.textContent = 'Subscribed!';
        submitBtn.style.backgroundColor = '#2ecc71';
        
        // Reset form
        setTimeout(() => {
          this.reset();
          submitBtn.textContent = 'Subscribe';
          submitBtn.style.backgroundColor = '';
        }, 3000);
      }, 1500);
    });
  }
  
  // Reveal animations on scroll
  function reveal() {
    const reveals = document.querySelectorAll('.section-title, .track-item, .show-item, .info-item');
    
    for (let i = 0; i < reveals.length; i++) {
      const windowHeight = window.innerHeight;
      const elementTop = reveals[i].getBoundingClientRect().top;
      const elementVisible = 150;
      
      if (elementTop < windowHeight - elementVisible) {
        reveals[i].classList.add('active');
      }
    }
  }
  
  window.addEventListener('scroll', reveal);
  
  // Add CSS for reveal animations
  const revealStyle = document.createElement('style');
  revealStyle.textContent = `
    .section-title, .track-item, .show-item, .info-item {
      opacity: 0;
      transform: translateY(20px);
      transition: opacity 0.6s ease, transform 0.6s ease;
    }
    
    .section-title.active, .track-item.active, .show-item.active, .info-item.active {
      opacity: 1;
      transform: translateY(0);
    }
    
    .track-item:nth-child(1) { transition-delay: 0.1s; }
    .track-item:nth-child(2) { transition-delay: 0.2s; }
    .track-item:nth-child(3) { transition-delay: 0.3s; }
    .track-item:nth-child(4) { transition-delay: 0.4s; }
    .track-item:nth-child(5) { transition-delay: 0.5s; }
    
    .show-item:nth-child(1) { transition-delay: 0.1s; }
    .show-item:nth-child(2) { transition-delay: 0.2s; }
    .show-item:nth-child(3) { transition-delay: 0.3s; }
    .show-item:nth-child(4) { transition-delay: 0.4s; }
    
    .info-item:nth-child(1) { transition-delay: 0.1s; }
    .info-item:nth-child(2) { transition-delay: 0.2s; }
    .info-item:nth-child(3) { transition-delay: 0.3s; }
  `;
  document.head.appendChild(revealStyle);
  
  // Run reveal on load
  reveal();
});