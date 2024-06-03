# Getting wish data

1. Find the debug log (e.g. `D:\Wuthering Waves\Wuthering Waves Game\Client\Binaries\Win64\ThirdParty\KrPcSdk_Global\KRSDKRes\KRSDKWebView`)
2. Find the API call that looks like this: `https://aki-gm-resources-oversea.aki-game.net/aki/gacha/index.html#/record?svr_id=591d6af3a3090d8ea00d8f86cf6d7501&player_id=501055687&lang=en&gacha_id=4&gacha_type=6&svr_area=global&record_id=41cc692c5b9d3b70c9609f025a04ed2d&resources_id=917dfa695d6c6634ee4e972bb9168f6a`
3. Note all of the params
4. Call the following API (POST)

```
https://gmserver-api.aki-game2.net/gacha/record/query
POST
{
    "cardPoolId": "917dfa695d6c6634ee4e972bb9168f6a",
    "cardPoolType": 2,
    "languageCode": "en",
    "playerId": "501055687",
    "recordId": "41cc692c5b9d3b70c9609f025a04ed2d",
    "serverId": "591d6af3a3090d8ea00d8f86cf6d7501"
}
```

The Card Pool Type is the type of banner:

1. Limited character banner
2. Limited weapon banner
3. ?
4. ?
5. ?
6. ?

There are some scripts to find the URL in the debug.log: https://github.com/alpharmi/wuthering.app/blob/main/getGacha.ps1
