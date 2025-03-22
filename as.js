const baseUrl = "https://anime-sama.fr/";

async function searchResults(html) {
    const results = [];

    // Regex to extract anime information from search results
    const filmListRegex = /<a href="([^"]+)">\s*<div class="image">\s*<amp-img.*?src="([^"]+)"[^>]*>\s*<\/amp-img>\s*<\/div>\s*<div class="text">\s*<p class="title">([^<]+)<\/p>/g;
    let match;

    while ((match = filmListRegex.exec(html)) !== null) {
        const href = match[1] ? match[1].trim() : '';
        const imageUrl = match[2] ? match[2].trim() : '';
        const title = match[3] ? match[3].trim() : '';

        if (title && href) {
            results.push({
                title,
                image: imageUrl,
                href: href.startsWith("/") ? baseUrl + href.slice(1) : baseUrl + href
            });
        }
    }
    console.log("Search Results:", results);
    return results;
}

async function extractDetails(html) {
    const details = {};

    // Extract description
    const descriptionMatch = html.match(/<div class="story">\s*<p>([^<]+)<\/p>/);
    details.description = descriptionMatch ? descriptionMatch[1].trim() : 'N/A';

    // Extract other details (example: year) - adapt regex as needed based on the details you want
    const yearMatch = html.match(/<span class="year">(\d+)<\/span>/);
    details.year = yearMatch ? yearMatch[1].trim() : 'N/A';

    console.log("Details:", details);
    return details;
}

async function extractEpisodes(html) {
    const episodes = [];

    // Regex to extract episode information
    const episodeRegex = /<a href="([^"]+)" class="episode">\s*<div class="number">([^<]+)<\/div>/g;
    let match;

    while ((match = episodeRegex.exec(html)) !== null) {
        const href = match[1] ? match[1].trim() : '';
        const number = match[2] ? match[2].trim() : '';

        if (href && number) {
            episodes.push({
                href: href.startsWith("/") ? baseUrl + href.slice(1) : href,
                number: parseInt(number) // Convert to number for proper sorting
            });
        }
    }

    // Sort episodes by number
    episodes.sort((a, b) => a.number - b.number);

    console.log("Episodes:", episodes);
    return episodes;
}

async function extractStreamUrl(html) {
    // Look for iframe or direct link to video source
    const iframeMatch = html.match(/<iframe.*?src="([^"]+)".*?>/);
    const directLinkMatch = html.match(/<source.*?src="([^"]+)"/); // Adjust regex based on HTML

    let streamUrl = null;

    if (iframeMatch && iframeMatch[1]) {
        streamUrl = iframeMatch[1];
    } else if (directLinkMatch && directLinkMatch[1]) {
        streamUrl = directLinkMatch[1];
    }

    console.log("Stream URL:", streamUrl);
    return streamUrl;
}

module.exports = {
    searchResults,
    extractDetails,
    extractEpisodes,
    extractStreamUrl
};
