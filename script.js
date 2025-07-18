document.addEventListener('DOMContentLoaded', () => {
    const adContainer = document.getElementById('ad-container');
    const closeAd = document.getElementById('close-ad');
    const adContainer2 = document.getElementById('ad-container-2');
    const closeAd2 = document.getElementById('close-ad-2');

    // Initially hide the second ad
    adContainer2.classList.add('hidden');

    if (closeAd) {
        closeAd.addEventListener('click', () => {
            adContainer.classList.add('hidden');

            // Show the second ad after a delay
            setTimeout(() => {
                adContainer2.classList.remove('hidden');
            }, 1000); // 1 second delay
        });
    }

    if (closeAd2) {
        closeAd2.addEventListener('click', () => {
            adContainer2.classList.add('hidden');
        });
    }
});