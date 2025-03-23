export const fetchServerTime = async () => {
    const apiURL = `${import.meta.env.VITE_API_URL}/time`;
    
    try {
        const response = await fetch(apiURL);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        console.log('Server Time (Unix Epoch):', data.serverTime);
        return data.serverTime;
    } catch (error) {
        console.error('Error fetching server time:', error);
        return null;
    }
};