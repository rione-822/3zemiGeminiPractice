document.addEventListener('DOMContentLoaded', () => {
    const adContainer = document.getElementById('ad-container');
    const closeAd = document.getElementById('close-ad');

    if (closeAd) {
        closeAd.addEventListener('click', () => {
            if (adContainer) {
                adContainer.style.display = 'none';
            }
        });
    }
});