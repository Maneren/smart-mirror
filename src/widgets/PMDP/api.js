import Utils from '../../Utils';
import querystring from 'querystring';
const { requestWithProxy } = Utils.Network;

async function fetchFromMapyczAPI (phrase) {
  const query = querystring.stringify({
    limit: 1,
    locality: 'Plzeň|Bušovice|Dýšina|Chotěšov okres plzeň město|Chrást okres plzeň město|Horní Bříza|Kozolupy okres plzeň město|Kyšice okres plzeň město|Letkov|Líně|Město Touškov|Nová Ves okres plzeň město|Starý Plzenec|Stod|Třemošná|Vejprnice|Vochov|Zbůch|Zruč-Senec',
    type: 'street|address|poi|pubt',
    pubtBoost: 1,
    lang: 'cs,en',
    phrase
  });
  const url = 'https://api.mapy.cz/suggest/?' + query;

  const options = {
    method: 'GET',
    headers: {
      'user-agent': 'smart-mirror'
    }
  };

  const response = await requestWithProxy(url, options);
  const data = JSON.parse(response);

  const viable = data.result.filter(location => location.category === 'pubtran_cz')[0];
  if (viable === undefined) return false;
  const { latitude, longitude } = viable.userData;
  return { latitude, longitude };
}

async function fetchConnectionsFromPMDP (from, to, datetime, limit) {
  // look up stations' locations
  from = await fetchFromMapyczAPI(from);
  to = await fetchFromMapyczAPI(to);
  // console.log(from, to);

  // scrape token from website
  const html = await requestWithProxy('https://novejizdnirady.pmdp.cz/');
  const tokenStart = html.search(/<input type='hidden' id='__APIRequestVerificationToken' name='__APIRequestVerificationToken' value='.*'>/gi);
  const token = html.substr(tokenStart + 100, 217);

  const url = 'https://novejizdnirady.pmdp.cz/Home/Vyhledat';
  const body = querystring.stringify({
    'Start[StopId]': '',
    'Start[Latitude]': from.latitude,
    'Start[Longitude]': from.longitude,
    'Destination[StopId]': '',
    'Destination[Latitude]': to.latitude,
    'Destination[Longitude]': to.longitude,
    'Waypoint[StopId]': '',
    'Waypoint[Latitude]': '',
    'Waypoint[Longitude]': '',
    DateAndTime: datetime.toISOString(),
    IsArrivalTime: false,
    DirectConnectionsOnly: false,
    BarrierFreeConnectionsOnly: false,
    MaxTransfers: 2,
    MaxTransferTimeMin: 10,
    ResultsStartIndex: 0,
    ResultsEndIndex: limit + 5,
    FullResults: true
  });

  const options = {
    method: 'POST',
    body,
    headers: {
      __apirequestverificationtoken: token,
      accept: 'application/json',
      'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      cookie: 'PMDP_SERCON_LOCALES=cs-CZ',
      'user-agent': 'smart-mirror'
    }
  };

  const response = await requestWithProxy(url, options);
  const data = JSON.parse(response);

  const parsed = data.map(connection => {
    const from = connection.StartName;
    const to = connection.DestinationName;
    const duration = connection.DurationMin;
    const departsIn = connection.LeavingInMin;

    const segments = connection.Segments.filter(segment => segment.Line.TractionType !== 0).map(segment => {
      const from = {
        name: segment.From.Name,
        datetime: new Date(segment.From.DepartureTime)
      };
      const to = {
        name: segment.To.Name,
        datetime: new Date(segment.To.ArrivalTime)
      };

      const lineTypes = {
        0: 'walk',
        1: 'tram',
        2: 'trolleybus',
        3: 'bus'
      };
      const line = {
        type: lineTypes[segment.Line.TractionType],
        number: segment.Line.Name,
        isBarrierfree: segment.Line.IsBarierFree
      };

      const delay = segment.DelayMin;
      const distance = segment.DistanceM;

      return { from, to, line, delay, distance };
    });
    const start = segments[0].from.datetime;
    const end = segments[segments.length - 1].to.datetime;
    return { from, to, duration, segments, departsIn, start, end };
  }).slice(0, limit);
  return parsed;
}

export default fetchConnectionsFromPMDP;
