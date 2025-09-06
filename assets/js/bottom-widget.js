// Bottom Widget (bottom-right floating button)
class BottomWidget {
    constructor() {
        this.init();
    }

    init() {
        // Close popup when clicking outside
        document.addEventListener('click', (e) => {
            const popup = document.getElementById('bottomPopup');
            const widget = document.getElementById('bottomWidget');
            
            if (popup.classList.contains('show') && 
                !popup.contains(e.target) && 
                !widget.contains(e.target)) {
                this.closePopup();
            }
        });
    }

    togglePopup() {
        const popup = document.getElementById('bottomPopup');
        const widget = document.getElementById('bottomWidget');
        
        if (popup.classList.contains('show')) {
            this.closePopup();
        } else {
            popup.classList.add('show');
            widget.style.transform = 'scale(0.95)';
        }
    }

    closePopup() {
        const popup = document.getElementById('bottomPopup');
        const widget = document.getElementById('bottomWidget');
        
        popup.classList.remove('show');
        widget.style.transform = 'scale(1)';
    }
}

// Global functions for HTML onclick events
function toggleBottomPopup() {
    window.bottomWidget.togglePopup();
}

function closeBottomPopup() {
    window.bottomWidget.closePopup();
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.bottomWidget = new BottomWidget();
});