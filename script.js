const apiKey = 'API_KEY'; // Get here https://developer.riotgames.com
const summonerName = 'SUMMONER_NAME'; // Enter Username (not login name)
const region = 'REGION'; // set region, z.B. 'euw1', 'na1', 'kr'

// Riot API URLs
const baseUrl = `https://${region}.api.riotgames.com/lol`;
const summonerUrl = `${baseUrl}/summoner/v4/summoners/by-name/${summonerName}`;
const rankedStatsUrl = (id) => `${baseUrl}/league/v4/entries/by-summoner/${id}`;

// Create Widget
let widget = new ListWidget();
widget.backgroundColor = new Color("#1A1A1A");

function getColorForRank(rank) {
    const colors = {
        'IRON': '#5E6C70',
        'BRONZE': '#8C4A2F',
        'SILVER': '#A0A0A0',
        'GOLD': '#E5C100',
        'PLATINUM': '#0E8A16',
        'DIAMOND': '#4B9BFF',
        'MASTER': '#6E23D5',
        'GRANDMASTER': '#EB2F34',
        'CHALLENGER': '#F0B90D'
    };
    return colors[rank] || '#FFFFFF';
}

async function fetchRankedStats() {
    let summonerData = await fetchUrl(summonerUrl);
    let rankedStats = await fetchUrl(rankedStatsUrl(summonerData.id));

    return rankedStats;
}

async function fetchUrl(url) {
    let req = new Request(url);
    req.headers = {
        "X-Riot-Token": apiKey
    };
    return await req.loadJSON();
}

async function createWidget(rankedStats) {
    const title = widget.addText(`Ranked Stats: ${summonerName}`);
    title.textColor = new Color("#FFFFFF"); // Weißer Text
    title.font = Font.boldSystemFont(16);
    widget.addSpacer(5);

    rankedStats.forEach(stat => {
        const rankText = widget.addText(`${stat.tier} ${stat.rank}`);
        rankText.textColor = new Color(getColorForRank(stat.tier));
        rankText.font = Font.systemFont(14);
        widget.addSpacer(3);
        
        const rankLP = widget.addText(`${stat.leaguePoints} LP`);
        rankLP.textColor = new Color(getColorForRank(stat.tier));
        rankLP.font = Font.systemFont(40);
        widget.addSpacer(3);
    });

    return widget;
}

async function run() {
    try {
        let rankedStats = await fetchRankedStats();
        widget = await createWidget(rankedStats);
    } catch (e) {
        const errorText = widget.addText("Fehler beim Laden der Daten");
        errorText.textColor = new Color("#FF0000"); // Red Text for Errors
        console.error(e);
    }
    widget.presentSmall();
}

run();
