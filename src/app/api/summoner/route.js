export async function GET(request) {
  // i assume we are sending (exporting) a function an async (not sure what that means)function which will get a request(not sure from where)
  const url = new URL(request.url);
  const query = url.searchParams.get('name'); // then create a not changing variable called query which is new? then get a url of the request and look up the name maybe

  if (!query || !query.includes('#')) { // if not query ???? (maybe the query does not exist) or the query does not include #
    return new Response('Use: name#tag', { status: 400}); // return a new response that says to use name#tag not sure
  }

  const [gameName, tagLine] = query.split('#'); // then create a constant list which takes the query name#tag and splits it into the respective parts
  const key = process.env.RIOT_API_KEY; // then create constant variable which securely stores the api key

  // get the puuid
  const accountUrl = `https://americas.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${tagLine}?api_key=${key}`; // call the api using the key for the name tag
  const accountRes = await fetch(accountUrl); // no idea what this line does
  if (!accountRes.ok) return new Response('Player not found', { status: 404 });  // no idea what this line does
  const { puuid } = await accountRes.json(); // no idea what this line does gets the puuid from something

  // get summoner data
  const summonerUrl = `https://na1.api.riotgames.com/lol/summoner/v4/summoners/by-puuid/${puuid}?api_key=${key}`; // using the link insert the key and the puuid we got 
  const summonerRes = await fetch(summonerUrl); // no idea
  if (!summonerRes.ok) return new Response('Summoner error', { status: 500 });
  const data = await summonerRes.json(); // no idea

  return new Response(JSON.stringify({
    name: data.name,
    level: data.summonerLevel,
    icon: `https://ddragon.leagueoflegends.com/cdn/14.25.1/img/profileicon/${data.profileIconId}.png`
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}