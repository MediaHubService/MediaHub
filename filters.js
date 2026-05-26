// ===================================
// Shop Filters JavaScript
// ===================================

// Filter state
let filterState = {
  platforms: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'twitch', 'pinterest'],
  priceRange: { min: 0, max: 5000 },
  followersRange: { min: 0, max: 1000000 },
  verifiedOnly: false,
  sortBy: 'newest',
  searchQuery: ''
};

// Load filters from localStorage
function loadFilters() {
  const saved = localStorage.getItem('mediahub_filters');
  if (saved) {
    filterState = { ...filterState, ...JSON.parse(saved) };
  }
}

// Save filters to localStorage
function saveFilters() {
  localStorage.setItem('mediahub_filters', JSON.stringify(filterState));
}

// Apply filters
function applyFilters(accounts) {
  let filtered = [...accounts];

  // Platform filter
  if (filterState.platforms.length < 8) {
    filtered = filtered.filter(acc => filterState.platforms.includes(acc.platform));
  }

  // Price filter
  filtered = filtered.filter(acc => 
    acc.price >= filterState.priceRange.min && 
    acc.price <= filterState.priceRange.max
  );

  // Followers filter
  filtered = filtered.filter(acc => 
    acc.followers >= filterState.followersRange.min && 
    acc.followers <= filterState.followersRange.max
  );

  // Verified filter
  if (filterState.verifiedOnly) {
    filtered = filtered.filter(acc => acc.verified);
  }

  // Search filter
  if (filterState.searchQuery) {
    const query = filterState.searchQuery.toLowerCase();
    filtered = filtered.filter(acc => 
      acc.name.toLowerCase().includes(query) ||
      acc.platform.toLowerCase().includes(query)
    );
  }

  // Sort
  switch (filterState.sortBy) {
    case 'price-low':
      filtered.sort((a, b) => a.price - b.price);
      break;
    case 'price-high':
      filtered.sort((a, b) => b.price - a.price);
      break;
    case 'followers':
      filtered.sort((a, b) => b.followers - a.followers);
      break;
    case 'popular':
      filtered.sort((a, b) => b.engagement - a.engagement);
      break;
    default: // newest
      filtered.sort((a, b) => b.id - a.id);
  }

  return filtered;
}

// Reset filters
function resetFilters() {
  filterState = {
    platforms: ['instagram', 'tiktok', 'youtube', 'twitter', 'facebook', 'linkedin', 'twitch', 'pinterest'],
    priceRange: { min: 0, max: 5000 },
    followersRange: { min: 0, max: 1000000 },
    verifiedOnly: false,
    sortBy: 'newest',
    searchQuery: ''
  };
  saveFilters();
}

// Update filter UI
function updateFilterUI() {
  // Update platform checkboxes
  document.querySelectorAll('#platformFilters input[type="checkbox"]').forEach(cb => {
    cb.checked = filterState.platforms.includes(cb.value);
  });

  // Update price range
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.value = filterState.priceRange.max;
    document.getElementById('priceValue').textContent = `$${filterState.priceRange.max}`;
  }

  // Update followers range
  const followersRange = document.getElementById('followersRange');
  if (followersRange) {
    followersRange.value = filterState.followersRange.min;
    document.getElementById('followersValue').textContent = formatNumber(filterState.followersRange.min);
  }

  // Update verified toggle
  const verifiedOnly = document.getElementById('verifiedOnly');
  if (verifiedOnly) {
    verifiedOnly.checked = filterState.verifiedOnly;
  }

  // Update sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.value = filterState.sortBy;
  }
}

// Initialize filters
function initFilters() {
  loadFilters();
  updateFilterUI();

  // Platform checkboxes
  document.querySelectorAll('#platformFilters input[type="checkbox"]').forEach(cb => {
    cb.addEventListener('change', function() {
      if (this.checked) {
        if (!filterState.platforms.includes(this.value)) {
          filterState.platforms.push(this.value);
        }
      } else {
        filterState.platforms = filterState.platforms.filter(p => p !== this.value);
      }
      saveFilters();
    });
  });

  // Price range
  const priceRange = document.getElementById('priceRange');
  if (priceRange) {
    priceRange.addEventListener('input', debounce(function() {
      filterState.priceRange.max = parseInt(this.value);
      document.getElementById('priceValue').textContent = `$${this.value}`;
      saveFilters();
    }, 300));
  }

  // Followers range
  const followersRange = document.getElementById('followersRange');
  if (followersRange) {
    followersRange.addEventListener('input', debounce(function() {
      filterState.followersRange.min = parseInt(this.value);
      document.getElementById('followersValue').textContent = formatNumber(this.value);
      saveFilters();
    }, 300));
  }

  // Verified toggle
  const verifiedOnly = document.getElementById('verifiedOnly');
  if (verifiedOnly) {
    verifiedOnly.addEventListener('change', function() {
      filterState.verifiedOnly = this.checked;
      saveFilters();
    });
  }

  // Sort
  const sortSelect = document.getElementById('sortSelect');
  if (sortSelect) {
    sortSelect.addEventListener('change', function() {
      filterState.sortBy = this.value;
      saveFilters();
    });
  }

  // Apply filters button
  const applyBtn = document.getElementById('applyFilters');
  if (applyBtn) {
    applyBtn.addEventListener('click', function() {
      showToast('Filters applied!', 'success');
      // Trigger grid refresh
      window.location.reload();
    });
  }

  // Reset filters button
  const resetBtn = document.getElementById('resetFilters');
  if (resetBtn) {
    resetBtn.addEventListener('click', function() {
      resetFilters();
      updateFilterUI();
      showToast('Filters reset', 'info');
    });
  }
}

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', initFilters);
