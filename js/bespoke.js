// ============================================
// OPTIMIZED BESPOKE.JS - Custom Heels Designer
// Requires: cart.js, auth.js
// ============================================

// Bespoke customization state
let bespokeState = {
  heelHeight: '105mm',
  heelPrice: 420,
  material: 'leather',
  materialPrice: 0,
  color: null,
  size: null,
  specialRequests: ''
};

// Material availability by heel height
const materialsByHeight = {
  '70mm': ['leather', 'suede', 'satin', 'patent'],
  '85mm': ['leather', 'suede', 'satin', 'velvet', 'patent'],
  '105mm': ['leather', 'suede', 'satin', 'velvet', 'patent', 'glitter'],
  '120mm': ['leather', 'suede', 'patent', 'glitter']
};

// Colors available for each material
const colorsByMaterial = {
  leather: [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Red', value: 'red', hex: '#B22222' },
    { name: 'Ivory', value: 'ivory', hex: '#F6EBDD' }
  ],
  suede: [
    { name: 'Navy', value: 'navy', hex: '#001f3f' },
    { name: 'Lilac', value: 'lilac', hex: '#C8A2C8' },
    { name: 'Coffee', value: 'coffee', hex: '#6F4E37' },
    { name: 'Camel', value: 'camel', hex: '#A9744F' },
    { name: 'Fuchsia', value: 'fuchsia', hex: '#FF1493' }
  ],
  satin: [
    { name: 'Red', value: 'red', hex: '#FF0000' },
    { name: 'Blush', value: 'blush', hex: '#F8D7D0' },
    { name: 'Fuchsia', value: 'fuchsia', hex: '#FF00FF' },
    { name: 'Purple', value: 'purple', hex: '#5A2A5E' },
    { name: 'Emerald', value: 'emerald', hex: '#0BDA51' },
    { name: 'Sapphire', value: 'sapphire', hex: '#0F52BA' }
  ],
  velvet: [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Burgundy', value: 'burgundy', hex: '#800020' },
    { name: 'Navy', value: 'navy', hex: '#000080' },
    { name: 'Purple', value: 'purple', hex: '#4B2C4F' },
    { name: 'Forest Green', value: 'forest', hex: '#1B3A2A' }
  ],
  patent: [
    { name: 'Black', value: 'black', hex: '#000000' },
    { name: 'Red', value: 'red', hex: '#C41E3A' },
    { name: 'Yellow', value: 'yellow', hex: '#FFD300' },
    { name: 'White', value: 'white', hex: '#FFFFFF' },
    { name: 'Grey', value: 'grey', hex: '#A7A9AC' },
    { name: 'Pink', value: 'pink', hex: '#FF69B4' }
  ],
  glitter: [
    { name: 'Rose Gold', value: 'rosegold', hex: '#E6B7A9' },
    { name: 'Aqua', value: 'aqua', hex: '#00CED1' },
    { name: 'Pink', value: 'pink', hex: '#FF1788' },
    { name: 'Sapphire', value: 'sapphire', hex: '#0F52BA' },
    { name: 'Yellow', value: 'yellow', hex: '#FFD300' }
  ]
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
  // Initialize with default selections
  updateAvailableMaterials(bespokeState.heelHeight);
  updateAvailableColors(bespokeState.material);
  updateSummary();
  calculatePrice();
  
  // Theme toggle
  const themeToggle = document.querySelector('.theme-toggle');
  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      document.body.classList.toggle('dark');
      const icon = themeToggle.querySelector('i');
      if (document.body.classList.contains('dark')) {
        icon.className = 'fa-solid fa-sun';
      } else {
        icon.className = 'fa-solid fa-moon';
      }
    });
  }
});

// Update available materials based on heel height
function updateAvailableMaterials(height) {
  const availableMaterials = materialsByHeight[height] || [];
  const allMaterialOptions = document.querySelectorAll('.material-selector .circular-option');
  
  allMaterialOptions.forEach(option => {
    const material = option.getAttribute('data-material');
    
    if (availableMaterials.includes(material)) {
      option.style.opacity = '1';
      option.style.pointerEvents = 'auto';
      option.classList.remove('disabled');
    } else {
      option.style.opacity = '0.3';
      option.style.pointerEvents = 'none';
      option.classList.add('disabled');
      option.classList.remove('active');
    }
  });
}

// Update available colors based on material
function updateAvailableColors(material) {
  const availableColors = colorsByMaterial[material] || [];
  const colorContainer = document.querySelector('.color-selector-bespoke');
  
  colorContainer.innerHTML = '';
  
  availableColors.forEach((color, index) => {
    const colorOption = document.createElement('div');
    colorOption.className = 'color-option-bespoke' + (index === 0 ? ' active' : '');
    colorOption.setAttribute('data-color', color.value);
    colorOption.style.backgroundColor = color.hex;
    
    if (color.hex === '#FFFFFF' || color.hex === '#FFFFF0' || color.hex === '#F7E7CE') {
      colorOption.style.border = '2px solid #e8ecef';
    }
    
    colorOption.onclick = function() { selectColor(this); };
    
    colorOption.innerHTML = `
      <div class="color-check"><i class="fa-solid fa-check"></i></div>
      <span class="color-name">${color.name}</span>
    `;
    
    colorContainer.appendChild(colorOption);
  });
  
  // Set first color as selected
  if (availableColors.length > 0) {
    bespokeState.color = availableColors[0].value;
    updateSummary();
  }
}

// Heel Height Selection
function selectHeelHeight(element) {
  document.querySelectorAll('.heel-selector .circular-option').forEach(opt => {
    opt.classList.remove('active');
  });
  
  element.classList.add('active');
  
  bespokeState.heelHeight = element.getAttribute('data-height');
  bespokeState.heelPrice = parseInt(element.getAttribute('data-price'));
  
  // Reset material and color selections
  bespokeState.material = null;
  bespokeState.materialPrice = 0;
  bespokeState.color = null;
  
  document.querySelectorAll('.material-selector .circular-option').forEach(opt => {
    opt.classList.remove('active');
  });
  
  updateAvailableMaterials(bespokeState.heelHeight);
  updateSummary();
  calculatePrice();
  animateSelection(element);
  showStepMessage('Great! Now choose your material.');
}

// Material Selection
function selectMaterial(element) {
  if (element.classList.contains('disabled')) return;
  
  document.querySelectorAll('.material-selector .circular-option').forEach(opt => {
    opt.classList.remove('active');
  });
  
  element.classList.add('active');
  
  bespokeState.material = element.getAttribute('data-material');
  bespokeState.materialPrice = parseInt(element.getAttribute('data-price'));
  
  updateAvailableColors(bespokeState.material);
  updateSummary();
  calculatePrice();
  animateSelection(element);
  
  const materialName = bespokeState.material.charAt(0).toUpperCase() + bespokeState.material.slice(1);
  showStepMessage(`Perfect! ${materialName} is an excellent choice. Now pick your color.`);
}

// Color Selection
function selectColor(element) {
  document.querySelectorAll('.color-option-bespoke').forEach(opt => {
    opt.classList.remove('active');
  });
  
  element.classList.add('active');
  bespokeState.color = element.getAttribute('data-color');
  updateSummary();
  animateSelection(element);
  
  const colorName = element.querySelector('.color-name').textContent;
  showStepMessage(`Beautiful! ${colorName} will look stunning. Don't forget to select your size.`);
}

// Size Selection
function selectSize(element) {
  document.querySelectorAll('.size-option-bespoke').forEach(opt => {
    opt.classList.remove('active');
  });
  
  element.classList.add('active');
  bespokeState.size = element.getAttribute('data-size');
  updateSummary();
  animateSelection(element);
}

// Update summary display
function updateSummary() {
  document.getElementById('summaryHeight').textContent = bespokeState.heelHeight || 'Not Selected';
  
  const materialText = bespokeState.material 
    ? bespokeState.material.charAt(0).toUpperCase() + bespokeState.material.slice(1)
    : 'Not Selected';
  document.getElementById('summaryMaterial').textContent = materialText;
  
  const colorText = bespokeState.color 
    ? bespokeState.color.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    : 'Not Selected';
  document.getElementById('summaryColor').textContent = colorText;
  
  document.getElementById('summarySize').textContent = bespokeState.size ? `EU ${bespokeState.size}` : 'Not Selected';
}

// Calculate total price
function calculatePrice() {
  const totalPrice = bespokeState.heelPrice + bespokeState.materialPrice;
  document.getElementById('summaryPrice').textContent = `NIS ${totalPrice.toFixed(2)}`;
}

// Animation for selection
function animateSelection(element) {
  element.style.transform = 'scale(1.1)';
  setTimeout(() => {
    element.style.transform = '';
  }, 200);
}

// Show step message
function showStepMessage(message) {
  const existingMessage = document.querySelector('.step-message');
  if (existingMessage) existingMessage.remove();
  
  const messageDiv = document.createElement('div');
  messageDiv.className = 'step-message';
  messageDiv.textContent = message;
  messageDiv.style.cssText = `
    position: fixed;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #8C28B6 0%, #c0392b 100%);
    color: white;
    padding: 15px 30px;
    border-radius: 30px;
    font-size: 14px;
    font-weight: 600;
    box-shadow: 0 4px 20px rgba(140, 40, 182, 0.4);
    z-index: 10000;
    animation: slideUp 0.3s ease;
  `;
  
  document.body.appendChild(messageDiv);
  
  setTimeout(() => {
    messageDiv.style.animation = 'slideDown 0.3s ease';
    setTimeout(() => messageDiv.remove(), 300);
  }, 3000);
}

// Add to cart - INTEGRATED WITH SHARED CART
function addBespokeToCart() {
  // Validate selections
  if (!bespokeState.heelHeight) {
    alert('⚠️ Please select a heel height');
    document.querySelector('.heel-selector').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  
  if (!bespokeState.material) {
    alert('⚠️ Please select a material');
    document.querySelector('.material-selector').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  
  if (!bespokeState.color) {
    alert('⚠️ Please select a color');
    document.querySelector('.color-selector-bespoke').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  
  if (!bespokeState.size) {
    alert('⚠️ Please select a size');
    document.querySelector('.size-selector-bespoke').scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  
  // Get special requests
  bespokeState.specialRequests = document.getElementById('specialRequests').value;
  
  // Create cart item
  const totalPrice = bespokeState.heelPrice + bespokeState.materialPrice;
  const materialText = bespokeState.material.charAt(0).toUpperCase() + bespokeState.material.slice(1);
  const colorText = bespokeState.color.charAt(0).toUpperCase() + bespokeState.color.slice(1);
  
  const cartItem = {
    title: `Bespoke Heels - ${bespokeState.heelHeight} ${materialText}`,
    price: `NIS ${totalPrice.toFixed(2)}`,
    image: document.getElementById('previewImage').src,
    size: `EU ${bespokeState.size}`,
    color: colorText,
    quantity: 1,
    type: 'bespoke'
  };
  
  // Add to cart using global cart system
  addToCartGlobal(cartItem);
  
  // Show success message
  alert(`✓ Your bespoke heels have been added to cart!\n\nDetails:\n• Heel Height: ${bespokeState.heelHeight}\n• Material: ${materialText}\n• Color: ${colorText}\n• Size: EU ${bespokeState.size}\n• Price: NIS ${totalPrice.toFixed(2)}\n\nProduction time: 4-6 weeks`);
  
  // Show cart
  toggleCart();
}

// Save design
function saveBespokeDesign() {
  if (!bespokeState.heelHeight) {
    alert('⚠️ Please select at least a heel height before saving the design.');
    return;
  }
  
  bespokeState.specialRequests = document.getElementById('specialRequests').value;
  
  const design = {
    timestamp: new Date().toISOString(),
    heelHeight: bespokeState.heelHeight,
    material: bespokeState.material,
    color: bespokeState.color,
    size: bespokeState.size,
    specialRequests: bespokeState.specialRequests,
    totalPrice: bespokeState.heelPrice + bespokeState.materialPrice
  };
  
  // Save to localStorage
  const savedDesigns = JSON.parse(localStorage.getItem('bespokeDesigns') || '[]');
  savedDesigns.push(design);
  localStorage.setItem('bespokeDesigns', JSON.stringify(savedDesigns));
  
  alert('✓ Your design has been saved!\n\nYou can access your saved designs from your account.');
  
  // Visual feedback
  const saveButton = document.querySelector('.btn-secondary-bespoke');
  const originalText = saveButton.innerHTML;
  saveButton.innerHTML = '<i class="fa-solid fa-check"></i> Saved!';
  saveButton.style.background = '#27ae60';
  saveButton.style.color = 'white';
  
  setTimeout(() => {
    saveButton.innerHTML = originalText;
    saveButton.style.background = '';
    saveButton.style.color = '';
  }, 2000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes slideUp {
    from {
      transform: translateX(-50%) translateY(100px);
      opacity: 0;
    }
    to {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
  }
  
  @keyframes slideDown {
    from {
      transform: translateX(-50%) translateY(0);
      opacity: 1;
    }
    to {
      transform: translateX(-50%) translateY(100px);
      opacity: 0;
    }
  }
`;
document.head.appendChild(style);

// Make functions globally accessible
window.selectHeelHeight = selectHeelHeight;
window.selectMaterial = selectMaterial;
window.selectColor = selectColor;
window.selectSize = selectSize;
window.addBespokeToCart = addBespokeToCart;
window.saveBespokeDesign = saveBespokeDesign;